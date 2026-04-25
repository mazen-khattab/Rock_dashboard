import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import "./ListCustomers.css";
import { MOCK_CUSTOMERS, type Customer } from "../../../Types/Customer";

export const ListCustomers = () => {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalRows = customers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage;
  const currentCustomers = customers.slice(from, from + rowsPerPage);

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[12px] sm:text-[14px] lg:text-[16px]">
            <tr>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">First Name</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Last Name</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Phone</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Governorate</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">City</th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[12px] sm:text-[14px] lg:text-[16px]">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{customer.firstName}</td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{customer.lastName}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{customer.email}</td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{customer.phone}</td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{customer.governorate}</td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{customer.city}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`show/${customer.id}`}
                      state={{ customer }}
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
                      aria-label={`Show ${customer.firstName} ${customer.lastName}`}
                      title="Show"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`edit/${customer.id}`}
                      state={{ customer }}
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
                      aria-label={`Edit ${customer.firstName} ${customer.lastName}`}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
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
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
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
