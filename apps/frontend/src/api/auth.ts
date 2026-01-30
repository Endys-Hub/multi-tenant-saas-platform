import { api } from "./client";

export const loginRequest = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
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
): Promise<{ token: string }> => {
  const res = await api.post("/auth/signup", {
    email,
    password,
    organizationName,
  });

  return res.data;
};
