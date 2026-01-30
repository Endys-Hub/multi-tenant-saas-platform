import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  role: null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as AuthState["role"];

    if (token) {
      setAuth({
        isAuthenticated: true,
        token,
        role,
      });
    }

    setLoading(false);
  }, []);

  const login = (token: string, role: AuthState["role"]) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role ?? "");

    setAuth({
      isAuthenticated: true,
      token,
      role,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuth(initialAuthState);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

