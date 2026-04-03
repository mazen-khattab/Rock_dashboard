export interface User {
  userId: number;
  userName: string;
  role: ["admin" | "user" | "guest" | "owner"];
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fname: string;
  lname: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  isSucess: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface AssignRoleRequest {
  userId: number;
  role: "admin" | "user" | "owner";
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  assignRole: (
    userId: number,
    role: "admin" | "user" | "owner",
  ) => Promise<void>;
  clearError: () => void;

  initializeAuth: () => Promise<void>;
}

export interface AxiosErrorData {
  response?: {
    status: number;
    data: ApiError;
  };
  message: string;
  config?: any;
}

// export interface AuthResponse {
//   user: User;
//   message?: string;
// }

// export interface RefreshResponse {
//   user: User;
//   message: string;
// }

// export interface AssignRoleResponse {
//   user: User;
//   role: string;
// }
