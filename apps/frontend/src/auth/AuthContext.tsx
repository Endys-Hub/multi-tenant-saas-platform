import { createContext } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: "ORG_ADMIN" | "MEMBER" | null;
  organizationId: string | null;
  userId: string | null; // 👈 ADD THIS
}

export interface AuthContextValue {
  auth: AuthState;
  login: (
    token: string,
    role: AuthState["role"],
    organizationId: string,
    userId: string // 👈 ADD THIS
  ) => void;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | null>(null);




