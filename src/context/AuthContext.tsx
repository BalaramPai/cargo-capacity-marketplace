import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/mock/authService";
import type { User, UserRole } from "../types";

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => { ok: boolean; message?: string; user?: User };
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(authService.getCurrentUser());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("cargolink:auth_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const login = useCallback((email: string, password: string) => {
    const user = authService.login(email, password);

    if (!user) {
      return { ok: false, message: "Invalid email or password." };
    }

    setCurrentUserState(user);
    return { ok: true, user };
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUserState(null);
  }, []);

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    if (!user) {
      authService.logout();
      return;
    }
    localStorage.setItem("cargolink:auth_user", JSON.stringify(user));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      role: currentUser ? currentUser.role : null,
      login,
      logout,
      setCurrentUser,
    }),
    [currentUser, login, logout, setCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
