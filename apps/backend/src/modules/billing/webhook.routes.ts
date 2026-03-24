import { FastifyInstance } from "fastify";
import { stripe } from "../../utils/stripe";
import { billingQueue } from "../../queues/billing.queue";

export const webhookRoutes = async (app: FastifyInstance) => {
  app.post("/webhook", async (request, reply) => {
    const signature = request.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return reply
        .status(400)
        .send({ message: "Missing Stripe signature" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body as Buffer,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return reply
        .status(400)
        .send({ message: "Webhook signature verification failed" });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as any;

          await billingQueue.add("checkoutCompleted", {
            organizationId: session.metadata.organizationId,
            stripeSessionId: session.id,
          });

          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as any;

          await billingQueue.add("paymentSucceeded", {
            stripeCustomerId: invoice.customer,
          });

          break;
        }

        case "invoice_payment.paid": {
          const invoice = event.data.object as any;

          await billingQueue.add("paymentSucceeded", {
            stripeCustomerId: invoice.customer,
          });

          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as any;

          await billingQueue.add("paymentFailed", {
            stripeCustomerId: invoice.customer,
          });

          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as any;

          await billingQueue.add("subscriptionUpdated", {
            stripeCustomerId: subscription.customer,
            status: subscription.status,
          });

          break;
        }

        default:
          console.log("Unhandled Stripe event:", event.type);
      }

      return reply.send({ received: true });
    } catch (err) {
      console.error("Webhook handler error:", err);
      return reply.status(500).send({ message: "Webhook failed" });
    }
  });
};


