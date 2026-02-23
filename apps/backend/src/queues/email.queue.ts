import { Queue, Worker } from "bullmq";
import { redisConnection } from "./connection";
import { sendInviteEmail } from "../utils/email";

export const emailQueue = new Queue("email", {
  connection: redisConnection,
});

// Worker to process email jobs
new Worker(
  "email",
  async (job) => {
    if (job.name === "sendInvite") {
      const { email, token, organizationId } = job.data;

      await sendInviteEmail(email, token, organizationId);
    }
  },
  {
    connection: redisConnection,
  }
);
