import { logAudit } from "../../utils/audit";
import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/prisma";
import { hashPassword } from "../../utils/password";

interface AcceptInviteBody {
  token: string;
  password: string;
}

export const acceptInviteRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: AcceptInviteBody }>("/accept", async (request) => {
    const { token, password } = request.body;

    const invite = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new Error("Invalid invitation");
    }

    if (invite.acceptedAt) {
      throw new Error("Invitation already accepted");
    }

    if (invite.expiresAt < new Date()) {
      throw new Error("Invitation expired");
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingUser = await tx.user.findUnique({
        where: { email: invite.email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashed = await hashPassword(password);

      const user = await tx.user.create({
        data: {
          email: invite.email,
          password: hashed,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: invite.organizationId,
          role: invite.role,
        },
      });

      await tx.invitation.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });

      // AUDIT LOG — AFTER SUCCESSFUL ACCEPTANCE
      await logAudit({
        organizationId: invite.organizationId,
        userId: user.id,
        action: "INVITE_ACCEPTED",
        entity: "Invitation",
        entityId: invite.id,
      });

      return { success: true };
    });
  });
};
