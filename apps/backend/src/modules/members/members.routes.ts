import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/prisma";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";
import { logAudit } from "../../utils/audit";

export const membersRoutes = async (app: FastifyInstance) => {
  /**
   * 🔹 Get Members
   */
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

  // Remove Member

  app.delete(
    "/:userId",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.USER_REMOVE),
      ],
    },
    async (request, reply) => {
      const { userId } = request.params as { userId: string };

      // Prevent self-removal
      if (userId === request.auth.userId) {
        return reply
          .status(400)
          .send({ message: "You cannot remove yourself." });
      }

      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          organizationId: request.auth.organizationId,
        },
      });

      if (!membership) {
        return reply
          .status(404)
          .send({ message: "Member not found." });
      }

      await prisma.membership.delete({
        where: {
          userId_organizationId: {
            userId,
            organizationId: request.auth.organizationId,
          },
        },
      });

      await logAudit({
        organizationId: request.auth.organizationId,
        userId: request.auth.userId,
        action: "MEMBER_REMOVED",
        entity: "Membership",
        entityId: userId,
      });

      return { success: true };
    }
  );
};
