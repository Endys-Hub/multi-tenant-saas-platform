import { FastifyInstance } from "fastify";
import { stripe } from "../../utils/stripe";
import { prisma } from "../../utils/prisma";
import { requireTenant } from "../../middlewares/requireTenant";

export const billingRoutes = async (app: FastifyInstance) => {
  
   // Start paid plan

  app.post(
    "/checkout",
    { preHandler: [...requireTenant] },
    async (request) => {
      const orgId = request.auth.organizationId;

      const subscription = await prisma.subscription.findUnique({
        where: { organizationId: orgId },
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      let stripeCustomerId = subscription.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          metadata: { organizationId: orgId },
        });

        stripeCustomerId = customer.id;

        await prisma.subscription.update({
          where: { organizationId: orgId },
          data: { stripeCustomerId },
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        line_items: [
          {
            price: process.env.STRIPE_PRO_PRICE_ID!,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/dashboard?billing=success`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard?billing=cancel`,
      });

      return { url: session.url };
    }
  );

  app.post(
    "/portal",
    { preHandler: [...requireTenant] },
    async (request) => {
      const orgId = request.auth.organizationId;

      const subscription = await prisma.subscription.findUnique({
        where: { organizationId: orgId },
      });

      if (!subscription?.stripeCustomerId) {
        throw new Error("No Stripe customer found");
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.FRONTEND_URL}/dashboard`,
      });

      return { url: session.url };
    }
  );

  app.get(
    "/current",
    { preHandler: [...requireTenant] },
    async (request) => {
      const orgId = request.auth.organizationId;

      const subscription = await prisma.subscription.findUnique({
        where: { organizationId: orgId },
        select: {
          plan: true,
          status: true,
          trialEndsAt: true,
          startedAt: true,
          canceledAt: true,
        },
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      return subscription;
    }
  );
};





