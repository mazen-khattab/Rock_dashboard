import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import "./ListUsers.css";
import { MOCK_ADMIN_USERS, type AdminUser } from "../../../Types/User";

const roleClassName: Record<AdminUser["role"], string> = {
  "Super Admin": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Admin: "border-sky-200 bg-sky-50 text-sky-700",
  Support: "border-amber-200 bg-amber-50 text-amber-700",
};

export const ListUsers = () => {
  const [users] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalRows = users.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage;
  const currentUsers = users.slice(from, from + rowsPerPage);

  return (
    <div className="min-h-screen rounded-3xl p-3.5 sm:p-5 lg:p-6 text-slate-800 shadow-sm">
      <div className="mb-5 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">All admin users with their account role and contact email.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full min-w-[500px] table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm">
            <tr>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">First Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Last Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {currentUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50">
                <td className="px-3.5 sm:px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{user.firstName}</td>
                <td className="px-3.5 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{user.lastName}</td>
                <td className="px-3.5 sm:px-4 py-3 text-slate-500 whitespace-nowrap">{user.email}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap">
                  <span className={`rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium ${roleClassName[user.role]}`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-slate-500">
          Showing {users.length === 0 ? 0 : from + 1} to{" "}
          {Math.min(from + rowsPerPage, users.length)} of {totalRows} row(s)
        </div>

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
              Page {currentPage} of {totalPages || 1}
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
