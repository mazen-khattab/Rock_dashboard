import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import { getAuthErrorMessage } from "../../Services/AuthService";

export const LogoutButton = ({ compact = false }: { compact?: boolean }) => {
  const { logout, loggingOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to sign out. Please try again."));
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={loggingOut}
      aria-label={loggingOut ? "Signing out" : "Logout"}
      title="Logout"
      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
    >
      <LogOut size={18} />
      {!compact && <span>{loggingOut ? "Signing out..." : "Logout"}</span>}
    </button>
  );
};
