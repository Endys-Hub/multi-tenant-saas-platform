import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.warn("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(stripeKey || "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover" as any,
});