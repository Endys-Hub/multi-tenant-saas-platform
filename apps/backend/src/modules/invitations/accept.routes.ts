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
      // Find or create user
      const existingUser = await tx.user.findUnique({
        where: { email: invite.email },
      });

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const hashed = await hashPassword(password);

        const user = await tx.user.create({
          data: {
            email: invite.email,
            password: hashed,
          },
        });

        userId = user.id;
      }

      // Ensure membership exists
      await tx.membership.upsert({
        where: {
          userId_organizationId: {
            userId,
            organizationId: invite.organizationId,
          },
        },
        update: {},
        create: {
          userId,
          organizationId: invite.organizationId,
          role: invite.role,
        },
      });

      // Mark invite as accepted
      await tx.invitation.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });

      // AUDIT LOG — same transaction
      await tx.auditLog.create({
        data: {
          organizationId: invite.organizationId,
          userId,
          action: "INVITE_ACCEPTED",
          entity: "Invitation",
          entityId: invite.id,
        },
      });

      return { success: true };
    });
  });
};


