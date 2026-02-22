import api from "../lib/api";

export const getCurrentSubscription = async () => {
  const res = await api.get("/billing/current");
  return res.data;
};