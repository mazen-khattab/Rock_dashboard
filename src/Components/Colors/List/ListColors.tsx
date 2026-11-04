import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useColor } from "../../../Context/ColorContext";
import type { Color } from "../../../Types/Color";
import { DeleteModal } from "../../Global/Components/DeleteModal";
import { toast } from "react-toastify";

export const ListColors = () => {
  const { colors, loading, error, totalColorCount, getAllColors, deleteColor } = useColor();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void getAllColors().catch(() => {
      console.error("Error fetching colors. Check ColorContext for details.");
    });
  }, [getAllColors]);

  // Client-side search filtering
  const filteredColors = colors.filter((col) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const name = (col.name ?? "").toLowerCase();
    const nameEn = (col.nameEn ?? "").toLowerCase();
    const nameAr = (col.nameAr ?? "").toLowerCase();
    const hex = (col.hex ?? col.hexCode ?? "").toLowerCase();
    const id = String(col.id).toLowerCase();
    return (
      name.includes(query) ||
      nameEn.includes(query) ||
      nameAr.includes(query) ||
      hex.includes(query) ||
      id.includes(query)
    );
  });

  const totalRows = filteredColors.length > 0 ? filteredColors.length : totalColorCount;
  const totalPages = Math.max(1, Math.ceil(filteredColors.length / rowsPerPage));
  const from = (currentPage - 1) * rowsPerPage;
  const currentColors = filteredColors.slice(from, from + rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleRowClick = (colorId: string | number) => {
    navigate(`/admin/colors/show/${colorId}`);
  };

  const cancelDelete = () => {
    setColorToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!colorToDelete) return;

    setIsDeleting(true);
    try {
      await deleteColor(colorToDelete.id);
      toast.success("Color deleted successfully!");
      setColorToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete color.";
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Colors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage product colors, hex palette values, and catalog availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void getAllColors().catch(() => {})}
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="create"
            className="inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--hover-color)"
          >
            <Plus size={16} />
            <span>New Color</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-semibold">Unable to load colors from server</div>
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
            placeholder="Search colors by name, hex (#FFF), or ID..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-800">{colors.length}</span>
        </div>
      </div>

      {/* Colors Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[12px] sm:text-[14px] lg:text-[16px]">
            <tr>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Color</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Hex Code</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 text-right font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[12px] sm:text-[14px] lg:text-[16px]">
            {loading && colors.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={24} className="animate-spin text-teal-600" />
                    <span>Loading colors...</span>
                  </div>
                </td>
              </tr>
            ) : currentColors.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <Palette size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {searchQuery ? "No matching colors" : "No colors yet"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {searchQuery
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "Get started by adding your first product color."}
                    </p>
                    {!searchQuery && (
                      <Link
                        to="create"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--hover-color)"
                      >
                        <Plus size={16} />
                        <span>Add Color</span>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentColors.map((color) => {
                const hex = color.hex || color.hexCode || "#000000";
                const isActive = color.isActive ?? true;

                return (
                  <tr
                    key={color.id}
                    onClick={() => handleRowClick(color.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleRowClick(color.id);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-slate-50/80 focus:bg-slate-50 focus:outline-none"
                  >
                    {/* Color Swatch & Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-7 w-7 rounded-full border border-slate-300 shadow-sm shrink-0"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                        <div>
                          <span className="font-semibold text-slate-900">{color.name}</span>
                          {(color.nameAr || color.nameEn) && (
                            <div className="text-xs text-slate-500">
                              {color.nameEn ? `EN: ${color.nameEn}` : ""}{" "}
                              {color.nameAr ? `| AR: ${color.nameAr}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Hex Code */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-3.5 w-3.5 rounded border border-slate-300"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-sm font-medium text-slate-700 uppercase">
                          {hex}
                        </span>
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
                          to={`show/${color.id}`}
                          state={{ color }}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`edit/${color.id}`}
                          state={{ color }}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                          title="Edit Color"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setColorToDelete(color)}
                          className="cursor-pointer rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                          title="Delete Color"
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
          Showing {filteredColors.length === 0 ? 0 : from + 1} to{" "}
          {Math.min(from + rowsPerPage, filteredColors.length)} of {totalRows} row(s)
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
      {colorToDelete && (
        <DeleteModal
          type="color"
          name={colorToDelete.name}
          canselFunction={cancelDelete}
          handleDeleteProduct={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
