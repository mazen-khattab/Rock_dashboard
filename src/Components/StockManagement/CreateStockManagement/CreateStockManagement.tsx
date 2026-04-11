import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, PackageSearch, Plus, Search, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  INVENTORY_PRODUCTS,
  TRANSACTION_TYPE_OPTIONS,
  type InventoryProduct,
  type StockFieldProps,
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
 * A reusable wrapper component for form fields.
 * @param {string} label - The text to display above the input.
 * @param {React.ReactNode} children - The form element (Input, Select, etc.) to be wrapped.
 */
const Field = ({ label, children }: StockFieldProps) => (
  <label className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    {children}
  </label>
);

export const CreateStockManagement = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [transactionType, setTransactionType] = useState<TransactionType>("Shipping");
  const [note, setNote] = useState("");
  const [variantRows, setVariantRows] = useState<VariantRow[]>([createEmptyRow()]);
  const [errorMessage, setErrorMessage] = useState("");
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // It retrieves the complete data of the selected product from the list based on the ID, 
  // and only perform this operation when the ID changes.
  const selectedProduct = useMemo(
    () => INVENTORY_PRODUCTS.find((product) => product.id === selectedProductId) ?? null,
    [selectedProductId]
  );

  // It retrieves the products based on searched product, 
  // and only perform this operation when the searched product changes.
  const filteredProducts = useMemo(() => {
    const searchValue = productSearch.trim().toLowerCase();

    // Return all the available products if the searched value is empty
    if (!searchValue) {
      return INVENTORY_PRODUCTS;
    }

    // search for the searched value in name, sku, and category of the products
    return INVENTORY_PRODUCTS.filter((product) =>
      [product.name, product.sku, product.category].some((value) => value.toLowerCase().includes(searchValue)),
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

  // Sets the selected product, updates search text, and closes the dropdown menu.
  const handleSelectProduct = (product: InventoryProduct) => {
    setSelectedProductId(product.id);
    setVariantRows([createEmptyRow()]);
    setProductSearch(product.name);
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
      productId: selectedProduct.id,
      price: isPriceVisible ? Number(price) : null,
      type: transactionType,
      note: note.trim(),
      variants: sanitizedVariants,
    };

    console.log("Create stock transaction payload:", payload);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-6 shadow-sm ring-1 ring-slate-200/70">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/stock-management"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to Stock Management
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create Transaction</h1>
            </div>
          </div>

          <button
            type="submit"
            form="create-stock-transaction-form"
            disabled={isSubmitDisabled}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Submit Transaction
          </button>
        </div>

        {/* Form body */}
        <form id="create-stock-transaction-form" onSubmit={handleSubmit} className="space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            {/* Transaction Details */}
            <div className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/80 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Transaction Details</h2>
              </div>

              <div className={`grid gap-5 ${isPriceVisible ? "md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr]" : "md:grid-cols-2 xl:grid-cols-[1.4fr_1fr]"}`}>
                <Field label="Product">
                  <div ref={productDropdownRef} className="relative">
                    <div className="flex items-center rounded-[10px] border border-slate-200 bg-white px-4 py-4 h-14 text-slate-900 transition focus-within:border-(--main-color) focus-within:ring-4 focus-within:ring-[#d9f1ee]">
                      <Search size={16} className="mr-3 text-slate-400" />
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
                        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />

                      {productSearch ? (
                        <button
                          type="button"
                          onClick={() => {
                            setProductSearch("");
                            setSelectedProductId("");
                            setIsProductMenuOpen(false);
                            setErrorMessage("");
                          }}
                          className="ml-3 inline-flex h-6 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          aria-label="Clear product search"
                        >
                          <X size={14} />
                        </button>
                      ) : null}
                    </div>

                    {isProductMenuOpen && (
                      <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-[10px] border border-slate-200 bg-white p-2 shadow-lg">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleSelectProduct(product)}
                              className="flex w-full items-start justify-between rounded-[10px] px-3 py-3 text-left transition hover:bg-slate-50"
                            >
                              <div>
                                <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                                <div className="mt-1 text-xs text-slate-500">
                                  {product.category} | {product.sku}
                                </div>
                              </div>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500">
                                {product.status}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-6 text-center text-sm text-slate-500">
                            No products matched your search.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Field>

                {isPriceVisible ? (
                  <Field label="Unit Cost">
                    <div className="flex min-h-13 w-full overflow-hidden rounded-[10px] border border-slate-200 bg-white transition focus-within:border-(--main-color) focus-within:ring-4 focus-within:ring-[#d9f1ee]">
                      {/* <span className="flex min-w-24 items-center justify-center border-r border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-600">
                        EGP
                      </span> */}
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
                        className="w-full bg-white px-5 py-3 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
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
                    className="min-h-13 w-full rounded-[10px] border border-slate-200 bg-white px-5 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                  >
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="space-y-5 rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Variants</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Sizes and colors update automatically based on the selected product.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-(--main-color) hover:bg-white hover:text-(--main-color)"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {variantRows.map((row, index) => {
                    return (
                      <div
                        key={row.id}
                        className="grid gap-4 rounded-[10px] border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[1fr_1fr_0.8fr_auto]">

                        <Field label={`Size ${index + 1}`}>
                          <select
                            value={row.size}
                            onChange={(event) => handleRowChange(row.id, "size", event.target.value)}
                            disabled={!selectedProduct}
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee] disabled:cursor-not-allowed disabled:bg-slate-100"
                          >
                            <option value="">Select size</option>
                            {selectedProduct?.sizes.map((size) => (
                              <option key={size} value={size}>
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
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee] disabled:cursor-not-allowed disabled:bg-slate-100"
                          >
                            <option value="">Select color</option>
                            {selectedProduct?.colors.map((color) => (
                              <option key={color} value={color}>
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
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                          />
                        </Field>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-[10px] border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                            aria-label={`Delete variant row ${index + 1}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="space-y-6">
              <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-[10px] bg-[color:var(--main-color)]/10 p-3 text-(--main-color)">
                    <PackageSearch size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Transaction Summary</h2>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Selected product</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedProduct?.name ?? "No product selected"}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {selectedProduct
                        ? `${selectedProduct.category} | ${selectedProduct.sku}`
                        : "Pick a product to unlock matching sizes and colors."}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-medium text-slate-700">Sizes</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedProduct?.sizes.length ? (
                          selectedProduct.sizes.map((size) => (
                            <span
                              key={size}
                              className="rounded-[10px] border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                            >
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">Unavailable</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-medium text-slate-700">Colors</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedProduct?.colors.length ? (
                          selectedProduct.colors.map((color) => (
                            <span
                              key={color}
                              className="rounded-[10px] border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                            >
                              {color}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-6 text-white shadow-sm">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Notes</h2>
                  <p className="text-sm text-slate-200">
                    Add context that will help the team understand why this stock movement happened.
                  </p>
                </div>

                <div className="mt-6">
                  <textarea
                    rows={8}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Write a clear reason for the inventory movement..."
                    className="w-full resize-none rounded-[10px] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-200 focus:border-white/40 focus:bg-white/15"
                  />
                </div>

                {errorMessage ? (
                  <div className="mt-4 rounded-[10px] border border-red-200/40 bg-red-500/20 px-4 py-3 text-sm text-red-50">
                    {errorMessage}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[10px] border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100">
                    Select a product and complete at least one variant row to enable submission.
                  </div>
                )}
              </section>
            </div>
          </section>
        </form>
      </div>
    </div >
  );
};
