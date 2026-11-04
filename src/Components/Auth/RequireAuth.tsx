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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
          <p className="my-4 text-sm text-slate-600">Your account does not have permission to access this dashboard. Sign out to use another account.</p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return <Outlet />;
};
