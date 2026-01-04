import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../../utils/password";

const prisma = new PrismaClient();

export const signup = async (
  email: string,
  password: string,
  organizationName: string
) => {
  const hashedPassword = await hashPassword(password);

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

    return { user, organization };
  });
};

export const login = async (email: string, password: string) => {
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

  return user;
};



