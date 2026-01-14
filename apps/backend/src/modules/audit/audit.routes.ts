import { prisma } from "../../utils/prisma";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import { FastifyInstance, FastifyRequest } from "fastify";

export const auditRoutes = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      preHandler: [
        ...requireTenant,
        requireActiveSubscription,
        requirePermission(PERMISSIONS.AUDIT_READ),
      ],
       config: {
        rateLimit: {
          max: 100,
          timeWindow: "1 minute",
          keyGenerator: (request: FastifyRequest) => {
          return (
            request.auth?.organizationId ??
            request.headers["x-organization-id"] ??
            request.ip
          );
        },
        },
      },

    },
    async (request) => {
      return prisma.auditLog.findMany({
        where: {
          organizationId: request.auth.organizationId,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }
  );
};
