import { api } from "./client";

export interface Member {
  id: string;
  email: string;
  role: "ORG_ADMIN" | "MEMBER";
  joinedAt: string;
}

export const fetchMembers = async (): Promise<Member[]> => {
  const res = await api.get("/members");
  return res.data;
};

