import { logAudit } from "../../utils/audit";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import crypto from "crypto";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";
import { prisma } from "../../utils/prisma";
import { emailQueue } from "../../queues/email.queue";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "ORG_ADMIN"]),
});

export const inviteRoutes = async (app: FastifyInstance) => {
  
  // Pending Invitations
  
  app.get(
    "/",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.USER_INVITE),
      ],
    },
    async (request) => {
      const invitations = await prisma.invitation.findMany({
        where: {
          organizationId: request.auth.organizationId,
          acceptedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          expiresAt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return invitations;
    }
  );

  // Invitation

  app.post(
    "/invite",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.USER_INVITE),
      ],
    },
    async (request) => {
      const body = inviteSchema.parse(request.body);

      const token = crypto.randomUUID();

      const invitation = await prisma.invitation.create({
        data: {
          email: body.email,
          role: body.role,
          token,
          organizationId: request.auth.organizationId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
        },
      });

      await logAudit({
        organizationId: request.auth.organizationId,
        userId: request.auth.userId,
        action: "INVITE_CREATED",
        entity: "Invitation",
        entityId: invitation.id,
        metadata: {
          email: body.email,
          role: body.role,
        },
      });

      const organization = await prisma.organization.findUnique({
        where: { id: request.auth.organizationId },
        select: { name: true },
      });

      await emailQueue.add("sendInvite", {
        email: body.email,
        token,
        organizationName:
          organization?.name ?? "Your Organization",
      });

      return { success: true };
    }
  );

  // Revoke

  app.delete(
    "/:id",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.USER_INVITE),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const invite = await prisma.invitation.findFirst({
        where: {
          id,
          organizationId: request.auth.organizationId,
        },
      });

      if (!invite) {
        return reply
          .status(404)
          .send({ message: "Invitation not found" });
      }

      if (invite.acceptedAt) {
        return reply
          .status(400)
          .send({ message: "Invitation already accepted" });
      }

      await prisma.invitation.delete({
        where: { id },
      });

      await logAudit({
        organizationId: request.auth.organizationId,
        userId: request.auth.userId,
        action: "INVITE_REVOKED",
        entity: "Invitation",
        entityId: id,
      });

      return { success: true };
    }
  );
};
