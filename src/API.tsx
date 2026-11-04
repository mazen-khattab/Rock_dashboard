import axios from "axios";
import type { AxiosError } from "axios";
import type { ApiError, ApiResponse, User } from "./Types/auth";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "https://localhost:7179/api" : "/api");

let logoutCallback: (() => void) | null = null;
let refreshPromise: Promise<void> | null = null;
let sessionVersion = 0;

export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback;
  return () => {
    if (logoutCallback === callback) logoutCallback = null;
  };
}

/** Ignore responses from requests belonging to a previous signed-in session. */
export function resetAuthSession() {
  sessionVersion += 1;
}

/** Finish any cookie rotation before asking the server to delete its cookies. */
export async function waitForAuthRefresh() {
  await refreshPromise?.catch(() => {});
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "en",
  },
});

api.interceptors.request.use((config) => {
  config.headers["X-Request-ID"] = crypto.randomUUID();
  config._sessionVersion ??= sessionVersion;
  return config;
});

async function refreshSession() {
  const refresh = async () => {
    const response = await api.post<ApiResponse<User>>("/Auth/Refresh", undefined, {
      skipAuthRefresh: true,
    });
    if (!response.data.isSuccess) {
      throw new Error("Unable to refresh your session.");
    }
  };

  // A different tab may have rotated the shared cookie while this tab waited.
  if (typeof navigator !== "undefined" && navigator.locks) {
    await navigator.locks.request(`rock-auth-refresh:${API_URL}`, async () => {
      try {
        await api.get("/Auth/UserInfo", { skipAuthRefresh: true });
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
        await refresh();
      }
    });
  } else {
    await refresh();
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError | string>) => {
    const config = error.config;
    const authEndpoint = /\/auth\/(login|refresh|logout)(?:[/?]|$)/i.test(config?.url ?? "");

    if (!config || config.skipAuthRefresh || authEndpoint || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (config._sessionVersion !== sessionVersion) return Promise.reject(error);

    if (config._retry) {
      resetAuthSession();
      logoutCallback?.();
      return Promise.reject(error);
    }

    config._retry = true;
    const version = sessionVersion;

    if (!refreshPromise) {
      refreshPromise = refreshSession()
        .catch((refreshError: unknown) => {
          if (version === sessionVersion && axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
            resetAuthSession();
            logoutCallback?.();
          }
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    await refreshPromise;
    if (version !== sessionVersion) throw new axios.CanceledError("Session changed.");
    return api(config);
  },
);

export default api;
