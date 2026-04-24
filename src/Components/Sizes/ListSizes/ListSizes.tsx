import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { MOCK_SIZES, type Size } from "../../../Types/Size";

export const ListSizes = () => {
  const [sizes, setSizes] = useState<Size[]>(MOCK_SIZES);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalRows = sizes.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage;
  const currentSizes = sizes.slice(from, from + rowsPerPage);

  const handleDelete = (id: string) => {
    setSizes(sizes.filter((size) => size.id !== id));
  };

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Sizes</h1>
        <Link
          to="create"
          className="flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)"
        >
          <span>New Size</span>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Sort Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Is Active</th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentSizes.map((size) => (
              <tr key={size.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">{size.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-700">{size.sortOrder}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`rounded border px-3 py-1 text-xs ${size.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                  >
                    {size.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`edit/${size.id}`}
                      state={{ size }}
                      className="cursor-pointer rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(size.id)}
                      className="cursor-pointer rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              Page {currentPage} of {totalPages || 1}
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
