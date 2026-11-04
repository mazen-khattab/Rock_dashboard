import { isAxiosError } from "axios";
import api from "../API";
import type { ApiError, ApiResponse, LoginRequest, User, UserProfile } from "../Types/auth";

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiError | string>(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      const validationError = Object.values(data.errors ?? {}).flat()[0];
      if (validationError) return validationError;
      if (data.title) return data.title;
    }
    return error.response ? fallback : "Unable to reach the server. Check your connection and try again.";
  }
  return error instanceof Error ? error.message : fallback;
}

const readUser = (response: ApiResponse<User>): User => {
  const user = response.data;
  if (!response.isSuccess || !user || !Number.isInteger(user.userId) || user.userId <= 0 ||
      typeof user.userName !== "string" || !Array.isArray(user.role) ||
      !user.role.every((role) => typeof role === "string")) {
    throw new Error("The server returned an invalid authentication response.");
  }
  return user;
};

export const AuthService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await api.post<ApiResponse<User>>("/Auth/Login", credentials, {
      skipAuthRefresh: true,
    });
    return readUser(response.data);
  },

  async getUserInfo(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/Auth/UserInfo");
    return readUser(response.data);
  },

  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>("/Users/profile");
    if (!response.data.isSuccess || !response.data.data) throw new Error("Unable to load your profile.");
    return response.data.data;
  },

  async logout(): Promise<void> {
    const response = await api.post<ApiResponse<null>>("/Auth/logout", undefined, {
      skipAuthRefresh: true,
    });
    if (!response.data.isSuccess) throw new Error("Unable to sign out. Please try again.");
  },
};
