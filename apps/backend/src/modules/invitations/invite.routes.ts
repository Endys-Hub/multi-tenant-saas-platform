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

      // Email sending comes next (stub for now)
      // console.log("Invite link:", `https://yourapp.com/accept-invite?token=${token}`);

      await emailQueue.add("sendInvite", {
        email: body.email,
        token,
        organizationId: request.auth.organizationId,
      });


      return { success: true };
    }
  );
};
