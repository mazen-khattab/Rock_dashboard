import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './Types/auth';

let API_URL = "";

if ((import.meta as any).env.MODE === "development") {
  API_URL = "https://localhost:7179/api";
} else {
  API_URL = "/api/";
}

let logoutCallback: (() => void) | null = null;

export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestId = generateRequestId();
    config.headers['X-Request-ID'] = requestId;

    return config;
  },
  (error) => {
    console.error('[API] Request setup failed:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError<ApiError>) => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // IMPORTANT: Check if this is the refresh endpoint itself
    // If refresh endpoint returns 401, don't try to refresh again!
    const isRefreshEndpoint = config.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !isRefreshEndpoint) {
      if (!config._retry) {
        config._retry = true;

        try {
          // console.log('[AUTH] Attempting token refresh...');
          await axiosInstance.post('/auth/refresh');
          // console.log('[AUTH] Token refresh successful');
          return axiosInstance(config);
        } catch (refreshError) {
          console.error('[AUTH] Token refresh failed, logging out');

          if (logoutCallback) {
            logoutCallback();
          }

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default axiosInstance;