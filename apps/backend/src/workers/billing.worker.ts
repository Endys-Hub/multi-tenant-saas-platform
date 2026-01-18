import { Worker } from "bullmq";
import { redisConnection } from "../queues/connection";
import { prisma } from "../utils/prisma";
import { emailQueue } from "../queues/email.queue";

new Worker(
  "billing",
  async (job) => {
    if (job.name === "checkoutCompleted") {
      const { organizationId } = job.data;

      await prisma.subscription.upsert({
        where: { organizationId },
        update: {
          status: "ACTIVE",
          plan: "PRO",
        },
        create: {
          organizationId,
          status: "ACTIVE",
          plan: "PRO",
        },
      });

      await emailQueue.add("billingActivated", {
        organizationId,
      });
    }
  },
  {
    connection: redisConnection,
  }
);
