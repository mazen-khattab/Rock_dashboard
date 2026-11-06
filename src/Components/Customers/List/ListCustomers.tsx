import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Eye, Users } from "lucide-react";
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
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Customers</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">View and manage customer contact records and addresses.</p>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
          <span>Total registered:</span>
          <span className="font-semibold text-zinc-200 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-lg">
            {customers.length}
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-sm">
        <table className="w-full min-w-[650px] table-auto">
          <thead className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 text-xs sm:text-sm font-semibold">
            <tr>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">First Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Last Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Phone</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Governorate</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">City</th>
              <th className="px-3.5 sm:px-4 py-3 text-right font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="transition-colors hover:bg-zinc-850/50">
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap font-medium text-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300">
                      {customer.firstName.charAt(0)}
                    </div>
                    <span>{customer.firstName}</span>
                  </div>
                </td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-200">{customer.lastName}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-400">{customer.email}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap font-mono text-zinc-300">{customer.phone}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-300">{customer.governorate}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-400">{customer.city}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2">
                    <Link
                      to={`show/${customer.id}`}
                      state={{ customer }}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
                      aria-label={`Show ${customer.firstName} ${customer.lastName}`}
                      title="Show"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      to={`edit/${customer.id}`}
                      state={{ customer }}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400 cursor-pointer"
                      aria-label={`Edit ${customer.firstName} ${customer.lastName}`}
                      title="Edit"
                    >
                      <Edit size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {currentCustomers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users size={24} className="text-zinc-500" />
                    <span>No customer records available.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-zinc-400">
          Showing {customers.length === 0 ? 0 : from + 1} to{" "}
          {Math.min(from + rowsPerPage, customers.length)} of {totalRows} row(s)
        </div>

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
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
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
