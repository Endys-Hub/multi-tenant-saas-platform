import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const billingQueue = new Queue("billing", {
  connection: redisConnection,
});
