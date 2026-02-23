import { api } from "./client";

export interface Member {
  userId: string; // match backend
  email: string;
  role: "ORG_ADMIN" | "MEMBER";
  joinedAt: string;
}

export const fetchMembers = async (): Promise<Member[]> => {
  const res = await api.get("/members");
  return res.data;
};

export const removeMember = async (userId: string) => {
  await api.delete(`/members/${userId}`);
};

