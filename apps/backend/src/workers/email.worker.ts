import { Worker } from "bullmq";
import { redisConnection } from "../queues/connection";

new Worker(
  "email",
  async (job) => {
    if (job.name === "sendInvite") {
      const { email, token } = job.data;

      console.log(
        `📧 Sending invite to ${email}: https://yourapp.com/accept?token=${token}`
      );
    }
  },
  {
    connection: redisConnection,
  }
);
