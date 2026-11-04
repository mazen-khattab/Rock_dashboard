import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  FolderTree,
  Package,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../../Context/ProductContext";
import type { Product } from "../../../Types/Product";
import { DeleteModal } from "../../Global/Components/DeleteModal";
import { toast } from "react-toastify";

export const ListProducts = () => {
  const { products, loading, error, totalProductCount, getAllProducts, deleteProdeuct } =
    useProduct();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void getAllProducts(currentPage, rowsPerPage).catch(() => {
      console.error("Error fetching products. Check ProductContext for details.");
    });
  }, [getAllProducts, currentPage, rowsPerPage]);

  // Client-side search filtering
  const filteredProducts = products.filter((prod) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const name = (prod.name ?? "").toLowerCase();
    const cat = (prod.category ?? "").toLowerCase();
    const id = String(prod.id).toLowerCase();
    return name.includes(query) || cat.includes(query) || id.includes(query);
  });

  const totalRows = filteredProducts.length > 0 ? filteredProducts.length : totalProductCount;
  const totalPages = Math.max(1, Math.ceil(totalProductCount / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleProductRowClick = (productId: number) => {
    navigate(`/admin/products/show/${productId}`);
  };

  const cancelDeleteProduct = () => {
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProdeuct(productToDelete.id);
      toast.success("Product deleted successfully!");
      setProductToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete product.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your product catalog, pricing, inventory variants, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void getAllProducts(currentPage, rowsPerPage).catch(() => {})}
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh products"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="create"
            className="inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--hover-color)"
          >
            <Plus size={16} />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-semibold">Unable to load products from server</div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products by name, category, or ID..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-800">{totalProductCount}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[12px] sm:text-[14px] lg:text-[16px]">
            <tr>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Product</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Category</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Price</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Inventory</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Sizes</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 text-right font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[12px] sm:text-[14px] lg:text-[16px]">
            {loading && products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={24} className="animate-spin text-teal-600" />
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <Package size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {searchQuery ? "No matching products" : "No products yet"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {searchQuery
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "Get started by adding your first product to the catalog."}
                    </p>
                    {!searchQuery && (
                      <Link
                        to="create"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--hover-color)"
                      >
                        <Plus size={16} />
                        <span>Add Product</span>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isActive = product.isActive ?? true;

                return (
                  <tr
                    key={product.id}
                    onClick={() => handleProductRowClick(product.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProductRowClick(product.id);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-slate-50/80 focus:bg-slate-50 focus:outline-none"
                  >
                    {/* Thumbnail & Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs font-mono text-slate-500">#{product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <FolderTree size={13} className="text-slate-400" />
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {typeof product.price === "number" ? `${product.price.toFixed(2)} EGP` : "—"}
                    </td>

                    {/* Inventory Pills */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700" title="Total Quantity">
                          Qty: {product.quantity ?? 0}
                        </span>
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700" title="Available to Sell">
                          Avail: {product.available ?? 0}
                        </span>
                      </div>
                    </td>

                    {/* Sizes */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes && product.sizes.length > 0 ? (
                          product.sizes.map((size) => (
                            <span
                              key={size}
                              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700"
                            >
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* View Details */}
                        <Link
                          to={`show/${product.id}`}
                          state={{ product }}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`edit/${product.id}`}
                          state={{ product }}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="cursor-pointer rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[12px] sm:text-[14px] text-slate-500">
          Showing {products.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, totalProductCount)} of {totalProductCount} row(s)
        </div>

        <div className="flex items-center gap-6 text-[12px] sm:text-[14px]">
          <div className="flex items-center gap-2">
            <span className="hidden text-slate-600 sm:block">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 outline-none focus:border-teal-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-slate-600 sm:block">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Delete Modal */}
      {productToDelete && (
        <DeleteModal
          type="product"
          name={productToDelete.name}
          canselFunction={cancelDeleteProduct}
          handleDeleteProduct={handleDeleteProduct}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
