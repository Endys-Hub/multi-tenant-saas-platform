import { FastifyInstance } from "fastify";
import { stripe } from "../../lib/stripe";
import { billingQueue } from "../../queues/billing.queue";

export const webhookRoutes = async (app: FastifyInstance) => {
 
  app.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (req, body, done) => {
      done(null, body);
    }
  );

  app.post("/webhook", async (request, reply) => {
    const signature = request.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      reply.status(400).send({ message: "Missing Stripe signature" });
      return;
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body as Buffer,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      reply.status(400).send({ message: "Webhook signature verification failed" });
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      await billingQueue.add("checkoutCompleted", {
        organizationId: session.metadata.organizationId,
        stripeSessionId: session.id,
      });
    }

    // Stripe requires a 2xx response
    reply.send({ received: true });
  });
};


