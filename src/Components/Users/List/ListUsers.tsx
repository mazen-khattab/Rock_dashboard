import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ShieldCheck } from "lucide-react";
import "./ListUsers.css";
import { MOCK_ADMIN_USERS, type AdminUser } from "../../../Types/User";

const roleClassName: Record<AdminUser["role"], string> = {
  "Super Admin": "border-rose-500/30 bg-rose-500/10 text-rose-400",
  Admin: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  Support: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
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
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Users</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">All admin users with their account role and contact email.</p>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
          <span>Active accounts:</span>
          <span className="font-semibold text-zinc-200 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-lg">
            {users.length}
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-sm">
        <table className="w-full min-w-[500px] table-auto">
          <thead className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 text-xs sm:text-sm font-semibold">
            <tr>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">First Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Last Name</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
              <th className="px-3.5 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
            {currentUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-zinc-850/50">
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap font-medium text-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300">
                      {user.firstName.charAt(0)}
                    </div>
                    <span>{user.firstName}</span>
                  </div>
                </td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-200">{user.lastName}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap text-zinc-400">{user.email}</td>
                <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium ${roleClassName[user.role]}`}>
                    <ShieldCheck size={12} />
                    <span>{user.role}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-zinc-400">
          Showing {users.length === 0 ? 0 : from + 1} to{" "}
          {Math.min(from + rowsPerPage, users.length)} of {totalRows} row(s)
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
