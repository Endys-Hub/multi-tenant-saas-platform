import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  role: null,
  organizationId: null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as AuthState["role"];
    const organizationId = localStorage.getItem("organizationId");

    if (token && organizationId) {
      setAuth({
        isAuthenticated: true,
        token,
        role,
        organizationId,
      });
    }

    setLoading(false);
  }, []);

  const login = (
    token: string,
    role: AuthState["role"],
    organizationId: string
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role ?? "");
    localStorage.setItem("organizationId", organizationId);

    setAuth({
      isAuthenticated: true,
      token,
      role,
      organizationId,
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

