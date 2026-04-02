import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";

export const requirePlan =
  (requiredPlan: "PRO") =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const organizationId = request.auth.organizationId;

    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!subscription || subscription.plan !== requiredPlan) {
      return reply.status(403).send({
        message: "Upgrade to PRO to access this feature",
      });
    }
  };
