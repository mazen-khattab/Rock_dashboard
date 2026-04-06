import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import "./ListOrders.css";
import { MOCK_ORDERS, orderStatusClassName } from "../../../Types/Order";

export const ListOrders = () => {
  const [orders] = useState(MOCK_ORDERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalRows = orders.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage;
  const currentOrders = orders.slice(from, from + rowsPerPage);

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total Price</th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium">Full Address</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Governorate</th> */}
              <th className="px-4 py-3 text-left text-sm font-medium">City</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Created At</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{order.number}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer}</td>
                <td className="px-4 py-3 text-slate-700">${order.totalPrice.toFixed(2)}</td>
                {/* <td className="max-w-xs px-4 py-3 text-slate-500">{order.fullAddress}</td>
                <td className="px-4 py-3 text-slate-500">{order.governorate}</td> */}
                <td className="px-4 py-3 text-slate-500">{order.city}</td>
                <td className="px-4 py-3">
                  <span className={`rounded border px-3 py-1 text-xs ${orderStatusClassName[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{order.createdAt}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`${order.id}`}
                    state={{ order }}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    <Eye size={16} />
                    <span>Details</span>
                  </Link>
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
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
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
