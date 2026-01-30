import { createContext } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: "ORG_ADMIN" | "MEMBER" | null;
}

export interface AuthContextValue {
  auth: AuthState;
  login: (token: string, role: AuthState["role"]) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);




