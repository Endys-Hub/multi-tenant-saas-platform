import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/prisma";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";

export const auditRoutes = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.AUDIT_READ),
      ],
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
