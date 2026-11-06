import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Plus, Search, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_STOCK_TRANSACTIONS, STOCK_VARIANTS } from "../../../Types/Stock";

const getTransactionBadge = (type: string) => {
  switch (type.toLowerCase()) {
    case "shipping":
      return "border-sky-500/30 bg-sky-500/10 text-sky-400";
    case "returned":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "damaged":
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    case "updating":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-300";
  }
};

export const ListStockManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all categories, then add convert it to Array with new element called "All"
  const categories = useMemo(() => {
    return ["All", ...new Set(STOCK_VARIANTS.map((variant) => variant.category))];
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
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Stock Management</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">Track and manage inventory movements and stock transactions.</p>
        </div>
        <Link
          to={"create"}
          className="inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm px-3.5 sm:px-4 text-xs sm:text-sm transition"
        >
          <Plus size={16} />
          <span>New Transaction</span>
        </Link>
      </div>

      <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 md:grid-cols-2 shadow-xl">
        <div>
          <label htmlFor="skuSearch" className="mb-1.5 sm:mb-2 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400">
            <Search size={14} className="text-zinc-400" />
            <span>Search by SKU or Name</span>
          </label>
          <input
            id="skuSearch"
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search SKU or product name..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="categoryFilter" className="mb-1.5 sm:mb-2 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400">
            <Tag size={14} className="text-zinc-400" />
            <span>Category</span>
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-200 outline-none transition focus:border-zinc-500 focus:bg-zinc-900"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-zinc-900 text-zinc-200">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-sm">
        <table className="w-full min-w-[650px] table-auto">
          <thead className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 text-xs sm:text-sm font-semibold">
            <tr>
              <th className="px-3.5 sm:px-4 py-3 sm:py-3.5 text-left whitespace-nowrap">Product Name</th>
              <th className="px-3.5 sm:px-4 py-3 sm:py-3.5 text-left whitespace-nowrap">Quantity</th>
              <th className="px-3.5 sm:px-4 py-3 sm:py-3.5 text-left whitespace-nowrap">Created At</th>
              <th className="px-3.5 sm:px-4 py-3 sm:py-3.5 text-left whitespace-nowrap">Transaction Type</th>
              <th className="px-3.5 sm:px-4 py-3 sm:py-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
            {currentVariants.map((variant) => {
              const transaction = MOCK_STOCK_TRANSACTIONS.find((item) => item.id === variant.id);

              return (
                <tr key={variant.id} className="transition-colors hover:bg-zinc-850/50">
                  <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap font-medium text-zinc-200">
                    <div>{variant.productName}</div>
                    <div className="text-[11px] font-mono text-zinc-500">{variant.sku}</div>
                  </td>
                  <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap font-mono font-semibold text-zinc-200">
                    {variant.quantity}
                  </td>
                  <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-400">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getTransactionBadge(
                        variant.transactiounType
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {variant.transactiounType}
                    </span>
                  </td>
                  <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-right">
                    <Link
                      to={`edit/${variant.id}`}
                      state={{ transaction }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400"
                      title="Edit Transaction"
                    >
                      <Edit size={15} />
                    </Link>
                  </td>
                </tr>
              );
            })}

            {currentVariants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">
                  No stock variants matched your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-zinc-400">{totalRows} row(s)</div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-200 outline-none focus:border-zinc-500 text-xs sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-zinc-400 text-xs sm:text-sm">
              Page {Math.min(currentPage, totalPages)} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="First Page"
              >
                <ChevronsLeft size={15} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight size={15} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Last Page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
