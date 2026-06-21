import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type LmsUser = {
  email: string;
  designation: string;
};

type AuthContextValue = {
  user: LmsUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: LmsUser) => void;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "lms_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LmsUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = useCallback((data: LmsUser) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: string[]) => !!user && roles.includes(user.designation),
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}