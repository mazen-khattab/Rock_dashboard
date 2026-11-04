export interface User {
  userId: number;
  /** The backend returns initials here, rather than the user's full name. */
  userName: string;
  role: string[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  fullAddress: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  errorType?: number;
  data: T;
}

export interface ApiError {
  message?: string;
  title?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  canAccessDashboard: boolean;
  initializing: boolean;
  loggingOut: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}
