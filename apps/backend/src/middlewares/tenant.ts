import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolveTenant = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const organizationId = request.headers["x-organization-id"];

  if (!organizationId || typeof organizationId !== "string") {
    return reply.code(400).send({
      message: "Missing X-Organization-Id header",
    });
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: request.auth.userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    return reply.code(403).send({
      message: "User does not belong to this organization",
    });
  }

  request.auth.organizationId = organizationId;
  request.auth.role = membership.role;
};
