import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_STOCK_TRANSACTIONS, STOCK_VARIANTS } from "../../../Types/Stock";

export const ListStockManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all categories, then add convert it to Array with new element called "All"
  const categories = useMemo(() => {
    return ["All", ...new Set(STOCK_VARIANTS.map((variant) => variant.category))]
  }, []);

  // Filter the displayed products based on the selected category and searched sku || name
  const filteredVariants = useMemo(() => {
    return STOCK_VARIANTS.filter((variant) => {
      const matchesSearch =
        variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || variant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // pagination logic
  const totalRows = filteredVariants.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const from = (currentPage - 1) * rowsPerPage;
  const currentVariants = filteredVariants.slice(from, from + rowsPerPage);

  return (
    <div className="min-h-screen rounded-3xl p-3.5 sm:p-5 lg:p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Stock Management</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Track and manage inventory movements and stock transactions.</p>
        </div>
        <Link
          to={'create'}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-(--hover-color)"
        >
          <span>New Transaction</span>
        </Link>
      </div>

      <div className="mb-5 sm:mb-6 grid gap-3 sm:gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:grid-cols-2">
        <div>
          <label htmlFor="skuSearch" className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-600">
            Search by SKU
          </label>
          <input
            id="skuSearch"
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search SKU or product name"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-700 outline-none transition-colors focus:border-(--main-color)"
          />
        </div>

        <div>
          <label htmlFor="categoryFilter" className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-600">
            Category
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-700 outline-none transition-colors focus:border-(--main-color)"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full min-w-[650px] table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm">
            <tr>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Product Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Quantity</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Created At</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Transaction Type</th>
              <th className="px-3.5 sm:px-4 py-3 text-right font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {currentVariants.map((variant) => {
              const transaction = MOCK_STOCK_TRANSACTIONS.find((item) => item.id === variant.id);

              return (
                <tr key={variant.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-3.5 sm:px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{variant.productName}</td>
                  <td className="px-3.5 sm:px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{variant.quantity}</td>
                  <td className="px-3.5 sm:px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{new Date().toLocaleDateString()}</td>
                  <td className="px-3.5 sm:px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{variant.transactiounType}</td>
                  <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-right">
                    <Link
                      to={`edit/${variant.id}`}
                      state={{ transaction }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 p-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      <Edit size={15} />
                    </Link>
                  </td>
                </tr>
              );
            })}

            {currentVariants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No stock variants matched your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-slate-500">{totalRows} row(s)</div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 outline-none focus:border-teal-500 text-xs sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-slate-600 text-xs sm:text-sm">
              Page {Math.min(currentPage, totalPages)} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
