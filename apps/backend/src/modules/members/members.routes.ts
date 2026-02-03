import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/prisma";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";

export const membersRoutes = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.USER_READ),
      ],
    },
    async (request) => {
      const members = await prisma.membership.findMany({
        where: {
          organizationId: request.auth.organizationId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          user: {
            createdAt: "asc",
          },
        },
      });

      return members.map((m) => ({
        userId: m.user.id,
        email: m.user.email,
        role: m.role,
        joinedAt: m.user.createdAt,
      }));
    }
  );
};
