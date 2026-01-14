import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../utils/prisma";

export const requireActiveSubscription = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const orgId = request.auth.organizationId;

  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
  });

  if (!subscription) {
    return reply.status(403).send({ message: "No subscription found" });
  }

  if (
    subscription.status === "CANCELED" ||
    (subscription.status === "TRIALING" &&
      subscription.trialEndsAt &&
      subscription.trialEndsAt < new Date())
  ) {
    return reply
      .status(402)
      .send({ message: "Subscription required" });
  }
};
