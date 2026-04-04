import { Queue, Worker } from "bullmq";
import { redisConnection } from "./connection";
import { prisma } from "../utils/prisma";

export const billingQueue = new Queue("billing", {
  connection: redisConnection.connection,
});

// Worker to process billing jobs

new Worker(
  "billing",
  async (job) => {
    console.log("Processing job:", job.name);

    switch (job.name) {
      case "checkoutCompleted": {
        const { organizationId } = job.data;

        await prisma.subscription.update({
          where: { organizationId },
          data: {
            status: "ACTIVE",
            plan: "PRO",
          },
        });

        break;
      }

      case "paymentSucceeded": {
        const { stripeCustomerId } = job.data;

        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId },
        });

        if (!subscription) return;

        await prisma.subscription.update({
          where: { organizationId: subscription.organizationId },
          data: {
            status: "ACTIVE",
          },
        });

        break;
      }

      case "paymentFailed": {
        const { stripeCustomerId } = job.data;

        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId },
        });

        if (!subscription) return;

        await prisma.subscription.update({
          where: { organizationId: subscription.organizationId },
          data: {
            status: "CANCELED", //
          },
        });

        break;
      }

      case "subscriptionUpdated": {
        const { stripeCustomerId, status } = job.data;

        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId },
        });

        if (!subscription) return;

        await prisma.subscription.update({
          where: { organizationId: subscription.organizationId },
          data: {
            status: status.toUpperCase(),
          },
        });

        break;
      }

      default:
        console.log("Unknown job:", job.name);
    }
  },
  {
  connection: redisConnection.connection,
  }
);
