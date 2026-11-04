import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { isAxiosError } from "axios";
import { resetAuthSession, setLogoutCallback, waitForAuthRefresh } from "../API";
import { AuthService, getAuthErrorMessage } from "../Services/AuthService";
import type { LoginRequest, User, UserProfile } from "../Types/auth";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const operation = useRef(0);
  const logoutInProgress = useRef(false);

  const clearSession = useCallback(() => {
    operation.current += 1;
    setUser(null);
    setProfile(null);
    setError(null);
    setInitializing(false);
  }, []);

  const loadProfile = useCallback(async (version: number) => {
    try {
      const data = await AuthService.getProfile();
      if (version === operation.current) setProfile(data);
    } catch {
      // Profile details are optional; a confirmed expired session is handled by API.tsx.
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    const version = ++operation.current;
    setInitializing(true);
    setError(null);
    try {
      const currentUser = await AuthService.getUserInfo();
      if (version !== operation.current) return;
      setUser(currentUser);
      void loadProfile(version);
    } catch (err) {
      if (version !== operation.current) return;
      setUser(null);
      setProfile(null);
      if (!isAxiosError(err) || err.response?.status !== 401) {
        setError(getAuthErrorMessage(err, "Unable to check your session. Please try again."));
      }
    } finally {
      if (version === operation.current) setInitializing(false);
    }
  }, [loadProfile]);

  useEffect(() => {
    const removeCallback = setLogoutCallback(clearSession);
    void initializeAuth();
    return () => {
      operation.current += 1;
      removeCallback();
    };
  }, [clearSession, initializeAuth]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const version = ++operation.current;
      resetAuthSession();
      setError(null);
      await waitForAuthRefresh();
      const currentUser = await AuthService.login(credentials);
      if (version !== operation.current) return;
      setProfile(null);
      setUser(currentUser);
      void loadProfile(version);
    },
    [loadProfile],
  );

  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;
    setLoggingOut(true);
    resetAuthSession();
    try {
      await waitForAuthRefresh();
      await AuthService.logout();
      clearSession();
    } finally {
      logoutInProgress.current = false;
      setLoggingOut(false);
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: user !== null,
      canAccessDashboard: user?.role.some((role) => role === "Admin" || role === "Owner") ?? false,
      initializing,
      loggingOut,
      error,
      login,
      logout,
      initializeAuth,
    }),
    [user, profile, initializing, loggingOut, error, login, logout, initializeAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
