import { FastifyInstance } from "fastify";
import { stripe } from "../../lib/stripe";
import { requireTenant } from "../../middlewares/requireTenant";
import { prisma } from "../../utils/prisma";

export const checkoutRoutes = async (app: FastifyInstance) => {
  app.post(
    "/checkout",
    { preHandler: requireTenant },
    async (request) => {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRO_PRICE_ID!,
            quantity: 1,
          },
        ],
        success_url: "https://yourapp.com/billing/success",
        cancel_url: "https://yourapp.com/billing/cancel",
        metadata: {
          organizationId: request.auth.organizationId,
        },
      });

      return { url: session.url };
    }
  );
};
