import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { LogoutButton } from "./LogoutButton";

export const RequireAuth = () => {
  const { isAuthenticated, canAccessDashboard } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />;
  }

  if (!canAccessDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-zinc-200">
        <div className="max-w-md rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl">
          <h1 className="text-xl font-bold text-zinc-100">Access denied</h1>
          <p className="my-4 text-sm text-zinc-400">
            Your account does not have permission to access this dashboard. Sign out to use another account.
          </p>
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
