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
