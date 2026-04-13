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
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-slate-500">All admin users with their account role and contact email.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">First Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Last Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Role</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{user.firstName}</td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{user.lastName}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`rounded border px-3 py-1 text-xs ${roleClassName[user.role]}`}>
                    {user.role}
                  </span>
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
