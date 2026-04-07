import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { STOCK_VARIANTS } from "../../../Types/Stock";

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
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Stock Management</h1>
        <Link to={'create'} className="flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)">
          <span>New Transaction</span>
        </Link>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <div>
          <label htmlFor="skuSearch" className="mb-2 block text-sm font-medium text-slate-600">
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
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-(--main-color)"
          />
        </div>

        <div>
          <label htmlFor="categoryFilter" className="mb-2 block text-sm font-medium text-slate-600">
            Category
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-(--main-color)"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
          <label htmlFor="statusFilter" className="mb-2 block text-sm font-medium text-slate-600">
            Stock Status
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-(--main-color)"
          >
            <option value="All">All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div> */}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Product Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Created At</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Transaction Type</th>
            </tr>
          </thead>

          <tbody>
            {currentVariants.map((variant) => {
              return (
                <tr key={variant.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{variant.productName}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{variant.quantity}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{new Date().toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">Returned</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`show/${variant.id}`}
                      state={{ variant }}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      <Edit size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}

            {currentVariants.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                  No stock variants matched your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">{totalRows} row(s)</div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Page {Math.min(currentPage, totalPages)} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
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
