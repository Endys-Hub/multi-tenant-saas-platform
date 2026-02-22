import { api } from "./client";

export const openBillingPortal = async (): Promise<string> => {
  const res = await api.post("/billing/portal");
  return res.data.url;
};

export const createCheckoutSession = async () => {
  const res = await api.post("/billing/checkout");
  return res.data.url;
};
