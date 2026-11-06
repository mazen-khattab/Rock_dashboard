import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, PackageSearch, Plus, Save, Search, Trash2, X } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  INVENTORY_PRODUCTS,
  MOCK_STOCK_TRANSACTIONS,
  TRANSACTION_TYPE_OPTIONS,
  type InventoryProduct,
  type StockFieldProps,
  type StockTransaction,
  type TransactionType,
  type VariantRow,
} from "../../../Types/Stock";

/**
 * Initial variant row values
 */
const createEmptyRow = (): VariantRow => ({
  id: crypto.randomUUID(),
  size: "",
  color: "",
  quantity: 0,
});

/**
 * Converts stored transaction variants into editable form rows.
 */
const mapTransactionVariantToRow = (variant: StockTransaction["variants"][number]): VariantRow => ({
  id: variant.id,
  size: variant.size,
  color: variant.color,
  quantity: variant.quantity,
});

/**
 * A reusable wrapper component for form fields.
 * @param {string} label - The text to display above the input.
 * @param {React.ReactNode} children - The form element (Input, Select, etc.) to be wrapped.
 */
const Field = ({ label, children }: StockFieldProps) => (
  <label className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs sm:text-sm font-medium text-zinc-300">{label}</span>
    </div>
    {children}
  </label>
);

export const EditStockManagement = () => {
  const { variantId } = useParams();
  const { state } = useLocation();
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // Prefer the transaction passed from navigation state, then fall back to the mock list by route ID.
  const initialTransaction = useMemo(() => {
    const transactionFromState = (state as { transaction?: StockTransaction })?.transaction;
    return transactionFromState ?? MOCK_STOCK_TRANSACTIONS.find((transaction) => transaction.id === variantId) ?? null;
  }, [state, variantId]);

  const [selectedProductId, setSelectedProductId] = useState(initialTransaction?.productId ?? "");
  const [productSearch, setProductSearch] = useState("");
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [price, setPrice] = useState(initialTransaction?.price?.toString() ?? "");
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransaction?.type ?? "Shipping");
  const [note, setNote] = useState(initialTransaction?.note ?? "");
  const [variantRows, setVariantRows] = useState<VariantRow[]>(
    initialTransaction?.variants.length
      ? initialTransaction.variants.map(mapTransactionVariantToRow)
      : [createEmptyRow()],
  );
  const [errorMessage, setErrorMessage] = useState("");

  // It retrieves the complete data of the selected product from the list based on the ID,
  // and only perform this operation when the ID changes.
  const selectedProduct = useMemo(() => {
    return INVENTORY_PRODUCTS.find((product) => String(product.id) === selectedProductId) ?? null;
  }, [selectedProductId]);

  // Keep the searchable input synced with the selected product when loading an existing transaction.
  useEffect(() => {
    if (selectedProduct) {
      setProductSearch(selectedProduct.name);
    }
  }, [selectedProduct]);

  // It retrieves the products based on searched product,
  // and only perform this operation when the searched product changes.
  const filteredProducts = useMemo(() => {
    const searchValue = productSearch.trim().toLowerCase();

    // Return all the available products if the searched value is empty
    if (!searchValue) {
      return INVENTORY_PRODUCTS;
    }

    // search for the searched value in name and category of the products
    return INVENTORY_PRODUCTS.filter((product) =>
      [product.name, product.category].some((value) => value.toLowerCase().includes(searchValue)),
    );
  }, [productSearch]);

  // Determines if the price input should be displayed (hidden for 'Updating' type).
  const isPriceVisible = transactionType !== "Updating";
  // Checks if at least one row has a selected size, color, and a positive quantity.
  const hasValidVariantRow = variantRows.some((row) => row.size && row.color && Number(row.quantity) > 0);
  // Disables the submit button if product is missing, rows are invalid, or price is required but missing/negative.
  const isSubmitDisabled =
    !selectedProduct ||
    !hasValidVariantRow ||
    (isPriceVisible && (!price || Number(price) < 0));

  // Remove all added variant rows when the product changes 
  // useEffect(() => {
  //   setVariantRows([createEmptyRow()]);
  // }, [selectedProduct]);

  // Remove the entered price when the type changes to "Updating"
  useEffect(() => {
    if (!isPriceVisible) {
      setPrice("");
    }
  }, [isPriceVisible]);

  // Closes the product menu if the user clicks anywhere outside of the dropdown element.
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      // If the clicked element is NOT inside the dropdown ref, close the menu.
      if (!productDropdownRef.current?.contains(event.target as Node)) {
        setIsProductMenuOpen(false);
      }
    };

    // Add listener when component mounts and clean it up when it unmounts.
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  // Sets the selected product, updates search text, resets variants, and closes the dropdown menu.
  const handleSelectProduct = (product: InventoryProduct) => {
    setSelectedProductId(String(product.id));
    setProductSearch(product.name);
    setVariantRows([createEmptyRow()]);
    setIsProductMenuOpen(false);
    setErrorMessage("");
  };

  // Appends a new empty row to the variants list.
  const handleAddRow = () => {
    setVariantRows((currentRows) => [...currentRows, createEmptyRow()]);
  };

  // Removes a specific row by ID, but ensures at least one empty row remains.
  const handleRemoveRow = (rowId: string) => {
    setVariantRows((currentRows) => {
      if (currentRows.length === 1) {
        return [createEmptyRow()];
      }

      return currentRows.filter((row) => row.id !== rowId);
    });
  };

  // Updates a specific field (size, color, or quantity) in a row by its ID.
  const handleRowChange = (rowId: string, key: keyof Omit<VariantRow, "id">, value: string) => {
    setVariantRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    );
    setErrorMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProduct) {
      setErrorMessage("Please select a product before saving the transaction.");
      return;
    }

    const sanitizedVariants = variantRows
      .map((row) => ({
        id: row.id,
        size: row.size,
        color: row.color,
        quantity: Number(row.quantity),
      }))
      .filter((row) => row.size && row.color && row.quantity > 0);

    if (sanitizedVariants.length === 0) {
      setErrorMessage("Add at least one variant row with size, color, and quantity greater than zero.");
      return;
    }

    if (isPriceVisible && (!price || Number(price) < 0)) {
      setErrorMessage("Enter a valid unit cost before submitting.");
      return;
    }

    const payload = {
      id: initialTransaction?.id ?? variantId,
      productId: String(selectedProduct.id),
      price: isPriceVisible ? Number(price) : null,
      type: transactionType,
      note: note.trim(),
      variants: sanitizedVariants,
    };
    void payload;

    setErrorMessage("");
  };

  if (!initialTransaction) {
    return (
      <div className="min-h-[50vh] p-4 sm:p-6 text-zinc-100 shadow-sm flex items-center justify-center">
        <div className="mx-auto max-w-xl w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-6 sm:p-8 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Transaction not found</h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            The selected transaction could not be loaded for editing.
          </p>
          <Link
            to="/admin/stock-management"
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
            <span>Back to Stock Management</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-100 shadow-sm">
      <div className="mx-auto max-w-6xl rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/stock-management"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
            >
              <ArrowLeft size={16} />
              Back to Stock Management
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Edit Transaction</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">Modify stock movement details and recorded variant quantities.</p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-stock-transaction-form"
            disabled={isSubmitDisabled}
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>

        <form id="edit-stock-transaction-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 sm:space-y-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-6 backdrop-blur-xs">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">Transaction Details</h2>
              </div>

              <div className={`grid gap-4 sm:gap-5 ${isPriceVisible ? "md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr]" : "md:grid-cols-2 xl:grid-cols-[1.4fr_1fr]"}`}>
                <Field label="Product">
                  <div ref={productDropdownRef} className="relative">
                    <div className="flex h-11 sm:h-12 items-center rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 text-zinc-100 transition focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-600">
                      <Search size={16} className="mr-2.5 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(event) => {
                          setProductSearch(event.target.value);
                          setSelectedProductId("");
                          setIsProductMenuOpen(true);
                          setErrorMessage("");
                        }}
                        onFocus={() => setIsProductMenuOpen(true)}
                        placeholder="Search products"
                        className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      />

                      {productSearch ? (
                        <button
                          type="button"
                          onClick={() => {
                            setProductSearch("");
                            setSelectedProductId("");
                            setVariantRows([createEmptyRow()]);
                            setIsProductMenuOpen(false);
                            setErrorMessage("");
                          }}
                          className="ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                          aria-label="Clear product search"
                        >
                          <X size={14} />
                        </button>
                      ) : null}
                    </div>

                    {isProductMenuOpen && (
                      <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl backdrop-blur-md">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleSelectProduct(product)}
                              className="flex w-full items-start justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-900"
                            >
                              <div>
                                <div className="text-xs sm:text-sm font-semibold text-zinc-100">{product.name}</div>
                                <div className="mt-0.5 text-xs text-zinc-400">
                                  {product.category} | #{product.id}
                                </div>
                              </div>
                              <span className={product.isActive ? "rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-emerald-400" : "rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-zinc-400"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-6 text-center text-xs sm:text-sm text-zinc-500">
                            No products matched your search.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Field>

                {isPriceVisible ? (
                  <Field label="Unit Cost">
                    <div className="flex h-11 sm:h-12 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-600">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(event) => {
                          setPrice(event.target.value);
                          setErrorMessage("");
                        }}
                        placeholder="0.00"
                        className="w-full bg-transparent px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </Field>
                ) : null}

                <Field label="Transaction Type">
                  <select
                    value={transactionType}
                    onChange={(event) => {
                      setTransactionType(event.target.value as TransactionType);
                      setErrorMessage("");
                    }}
                    className="h-11 sm:h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2 text-sm sm:text-base font-medium text-zinc-100 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                  >
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-zinc-950 text-zinc-100">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="space-y-4 sm:space-y-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-zinc-800/80 pb-4 sm:pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-white">Variants</h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
                      Sizes and colors update automatically based on the selected product.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>

                <div className="space-y-3.5 sm:space-y-4">
                  {variantRows.map((row, index) => (
                    <div
                      key={row.id}
                      className="grid gap-3 sm:gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 sm:p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_0.8fr_auto]"
                    >
                      <Field label={`Size ${index + 1}`}>
                        <select
                          value={row.size}
                          onChange={(event) => handleRowChange(row.id, "size", event.target.value)}
                          disabled={!selectedProduct}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-100 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-zinc-900"
                        >
                          <option value="" className="bg-zinc-950 text-zinc-100">Select size</option>
                          {selectedProduct?.sizes.map((size) => (
                            <option key={size} value={size} className="bg-zinc-950 text-zinc-100">
                              {size}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label={`Color ${index + 1}`}>
                        <select
                          value={row.color}
                          onChange={(event) => handleRowChange(row.id, "color", event.target.value)}
                          disabled={!selectedProduct}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-100 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-zinc-900"
                        >
                          <option value="" className="bg-zinc-950 text-zinc-100">Select color</option>
                          {selectedProduct?.colors.map((color) => (
                            <option key={color} value={color} className="bg-zinc-950 text-zinc-100">
                              {color}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label={`Quantity ${index + 1}`}>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={row.quantity}
                          onChange={(event) => handleRowChange(row.id, "quantity", event.target.value)}
                          placeholder="0"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                        />
                      </Field>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="inline-flex h-9 sm:h-10 w-full md:w-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs sm:text-sm text-zinc-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                          aria-label={`Delete variant row ${index + 1}`}
                        >
                          <Trash2 size={16} />
                          <span className="md:hidden">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-6 shadow-sm backdrop-blur-xs">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-zinc-800/80 border border-zinc-700/60 p-2.5 sm:p-3 text-zinc-300">
                    <PackageSearch size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-white">Transaction Summary</h2>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 sm:p-4">
                    <div className="text-xs sm:text-sm text-zinc-400">Selected product</div>
                    <div className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-white">
                      {selectedProduct?.name ?? "No product selected"}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-zinc-400">
                      {selectedProduct
                        ? `${selectedProduct.category} | #${selectedProduct.id}`
                        : "Pick a product to unlock matching sizes and colors."}
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 sm:p-4">
                      <div className="text-xs sm:text-sm font-medium text-zinc-300">Sizes</div>
                      <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedProduct?.sizes.length ? (
                          selectedProduct.sizes.map((size) => (
                            <span
                              key={size}
                              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 sm:px-3 py-1 text-xs font-medium text-zinc-300"
                            >
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs sm:text-sm text-zinc-500">Unavailable</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 sm:p-4">
                      <div className="text-xs sm:text-sm font-medium text-zinc-300">Colors</div>
                      <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedProduct?.colors.length ? (
                          selectedProduct.colors.map((color) => (
                            <span
                              key={color}
                              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 sm:px-3 py-1 text-xs font-medium text-zinc-300"
                            >
                              {color}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs sm:text-sm text-zinc-500">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 sm:p-6 text-white shadow-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-white">Notes</h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Update the context so the team understands why this stock movement changed.
                  </p>
                </div>

                <div className="mt-4 sm:mt-6">
                  <textarea
                    rows={6}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Write a clear reason for the inventory movement..."
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/90 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                  />
                </div>

                {errorMessage ? (
                  <div className="mt-3.5 sm:mt-4 rounded-xl border border-rose-500/30 bg-rose-500/15 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-rose-400">
                    {errorMessage}
                  </div>
                ) : (
                  <div className="mt-3.5 sm:mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-400">
                    Review the prefilled transaction and update any fields before saving.
                  </div>
                )}
              </section>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
