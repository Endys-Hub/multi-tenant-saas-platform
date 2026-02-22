import { api } from "./client";

export const inviteUser = async (
  email: string,
  role: "MEMBER" | "ORG_ADMIN"
) => {
  const res = await api.post("/invitations/invite", {
    email,
    role,
  });

  return res.data;
};

export const getPendingInvitations = async () => {
  const res = await api.get("/invitations");
  return res.data;
};

export const acceptInvitation = async (
  token: string,
  password: string
) => {
  const res = await api.post("/invitations/accept", {
    token,
    password,
  });

  return res.data;
};
