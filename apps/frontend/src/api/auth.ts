import { api } from "./client";

export interface LoginResponse {
  token: string;
  organizationId: string;
  role: "ORG_ADMIN" | "MEMBER";
  userId: string;
}

export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const signupRequest = async (
  email: string,
  password: string,
  organizationName: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/signup", {
    email,
    password,
    organizationName,
  });

  return res.data;
};
