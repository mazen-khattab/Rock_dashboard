import type { PropsWithChildren } from "react";
import { useAuth } from "../../Context/useAuth";

export const SessionBoundary = ({ children }: PropsWithChildren) => {
  const { initializing, error, initializeAuth } = useAuth();

  if (initializing) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center text-slate-600">
        Checking your session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Unable to check your session</h1>
          <p role="alert" className="mt-3 text-sm text-slate-600">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void initializeAuth()}
            className="mt-6 cursor-pointer rounded-lg bg-(--main-color) px-5 py-2.5 text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return children;
};
