import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { hashPassword, verifyPassword } from "../../utils/password";
import { logAudit } from "../../utils/audit";
import { FastifyInstance } from "fastify";

export const signup = async (
  email: string,
  password: string,
  organizationName: string
) => {
  const hashedPassword = await hashPassword(password);

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: organizationName,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "ORG_ADMIN",
        },
      });

      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          plan: "FREE",
          status: "TRIALING",
          trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        },
      });

      return { user, organization };
    }
  );

  await logAudit({
    organizationId: result.organization.id,
    userId: result.user.id,
    action: "ORG_CREATED",
    entity: "Organization",
  });

  return result;
};

export const login = async (
  app: FastifyInstance,
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  });

  if (!membership) {
    throw new Error("User has no organization");
  }

  // Type FIX
  const token = (app.jwt as any).sign({
    userId: user.id,
    organizationId: membership.organizationId,
    role: membership.role,
  });

  return {
    token,
    organizationId: membership.organizationId,
    role: membership.role,
    userId: user.id,
  };
};



