import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Eye, FolderTree, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCategory } from "../../../Context/CategoryContext";
import type { Category } from "../../../Types/Category";
import { DeleteModal } from "../../Global/Components/DeleteModal";
import { toast } from "react-toastify";

export const ListCategories = () => {
  const { categories, loading, error, getAllCategories, deleteCategory } = useCategory();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void getAllCategories().catch(() => {
      console.error("Error fetching categories. Check CategoryContext for details.");
    });
  }, [getAllCategories]);

  // Client-side search filtering
  const filteredCategories = categories.filter((cat) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const name = (cat.name ?? "").toLowerCase();
    const id = String(cat.id).toLowerCase();
    return name.includes(query) || id.includes(query);
  });

  const totalRows = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const from = (currentPage - 1) * rowsPerPage;
  const currentCategories = filteredCategories.slice(from, from + rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleRowClick = (categoryId: string | number) => {
    navigate(`/admin/categories/show/${categoryId}`);
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success("Category deleted successfully!");
      setCategoryToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete category.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Categories</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">Manage your store's product categories and catalog structure.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => void getAllCategories().catch(() => {})}
            disabled={loading}
            className="inline-flex h-9 sm:h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 sm:px-3.5 text-xs sm:text-sm font-medium text-zinc-300 shadow-xs transition hover:bg-zinc-850 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh categories"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="create"
            className="inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm px-3.5 sm:px-4 text-xs sm:text-sm transition"
          >
            <Plus size={16} />
            <span>New Category</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-rose-900/40 bg-zinc-900/90 p-3.5 sm:p-4 text-xs sm:text-sm text-rose-300">
          <div className="font-semibold">Unable to load categories from server</div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search categories by name or ID..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 sm:py-2.5 pl-10 pr-4 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-zinc-600 focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-700"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs sm:text-sm text-zinc-400">
          <span>Total categories:</span>
          <span className="font-semibold text-zinc-200 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-lg">{categories.length}</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-sm">
        <table className="min-w-[550px] w-full table-auto">
          <thead className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 text-xs sm:text-sm font-semibold">
            <tr>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">ID</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Category Name</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Status</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
            {loading && categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={22} className="animate-spin text-zinc-300" />
                    <span className="text-sm">Loading categories...</span>
                  </div>
                </td>
              </tr>
            ) : currentCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 sm:py-16 text-center px-4">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                      <FolderTree size={22} />
                    </div>
                    <h3 className="mt-3 text-base sm:text-lg font-bold text-zinc-200">
                      {searchQuery ? "No matching categories" : "No categories yet"}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                      {searchQuery
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "Get started by adding your first product category."}
                    </p>
                    {!searchQuery && (
                      <Link
                        to="create"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-750 hover:text-zinc-100"
                      >
                        <Plus size={16} />
                        <span>Add Category</span>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentCategories.map((category) => {
                const isActive = category.isActive ?? true;

                return (
                  <tr
                    key={category.id}
                    onClick={() => handleRowClick(category.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleRowClick(category.id);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-zinc-850/50 focus:bg-zinc-850/70 focus:outline-none"
                  >
                    {/* ID */}
                    <td className="px-3.5 sm:px-5 py-3.5 whitespace-nowrap font-mono text-xs sm:text-sm text-zinc-500">#{category.id}</td>

                    {/* Category Name */}
                    <td className="px-3.5 sm:px-5 py-3.5 whitespace-nowrap font-semibold text-zinc-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                          <FolderTree size={16} />
                        </div>
                        <span>{category.name}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3.5 sm:px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          isActive
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? "bg-emerald-400" : "bg-zinc-500"
                          }`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3.5 sm:px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* View Details */}
                        <Link
                          to={`show/${category.id}`}
                          state={{ category }}
                          className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                          title="View Category"
                        >
                          <Eye size={15} />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`edit/${category.id}`}
                          state={{ category }}
                          className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400"
                          title="Edit Category"
                        >
                          <Edit size={15} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category)}
                          className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
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
      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-zinc-400">
          Showing {filteredCategories.length === 0 ? 0 : from + 1} to {Math.min(from + rowsPerPage, filteredCategories.length)} of {totalRows} row(s)
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 outline-none focus:border-zinc-600"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-zinc-400">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                title="First Page"
              >
                <ChevronsLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                title="Last Page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Delete Modal */}
      {categoryToDelete && (
        <DeleteModal
          type="category"
          name={categoryToDelete.name}
          canselFunction={cancelDelete}
          handleDeleteProduct={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
