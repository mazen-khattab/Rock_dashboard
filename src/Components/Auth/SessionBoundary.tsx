import type { PropsWithChildren } from "react";
import { useAuth } from "../../Context/useAuth";

export const SessionBoundary = ({ children }: PropsWithChildren) => {
  const { initializing, error, initializeAuth } = useAuth();

  if (initializing) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
        Checking your session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-zinc-200">
        <div className="max-w-md rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl">
          <h1 className="text-xl font-bold text-zinc-100">Unable to check your session</h1>
          <p role="alert" className="mt-3 text-sm text-zinc-400">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void initializeAuth()}
            className="mt-6 cursor-pointer rounded-xl bg-zinc-800 border border-zinc-700/80 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700 shadow-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return children;
};
