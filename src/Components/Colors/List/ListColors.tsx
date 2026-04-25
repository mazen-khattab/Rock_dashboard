import { useState } from "react";
import { Edit, Trash2, ChevronRight, ChevronsLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_COLORS, type Color } from "../../../Types/Color";

export const ListColors = () => {
  const [colors, setColors] = useState<Color[]>(MOCK_COLORS);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // pagination
  const totalRows = colors.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage;
  const currentColors = colors.slice(from, from + rowsPerPage);

  const handleDelete = (id: string) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Colors</h1>
        <Link to="create" className="flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)">
          <span>New Color</span>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[12px] sm:text-[14px] lg:text-[16px]">
            <tr>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Color Name</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Color Hex</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Is Active</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[12px] sm:text-[14px] lg:text-[16px]">
            {currentColors.map((color) => (
              <tr key={color.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-5 w-5 rounded-full border border-slate-200 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className="font-medium text-slate-800">{color.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-700">{color.hex}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`rounded border px-3 py-1 text-xs ${color.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                  >
                    {color.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`edit/${color.id}`}
                      state={{ color }}
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(color.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
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
        <div className="text-slate-500 text-[12px] sm:text-[14px] lg:text-[16px]">{totalRows} row(s)</div>

        <div className="flex items-center gap-6 text-[12px] sm:text-[14px] lg:text-[16px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 hidden sm:block">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-200 bg-white px-3 py-1 text-slate-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 hidden sm:block">
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
