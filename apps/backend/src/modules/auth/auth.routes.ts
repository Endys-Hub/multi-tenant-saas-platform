import { FastifyInstance } from "fastify";
import { signupSchema, loginSchema } from "./auth.schemas";
import * as service from "./auth.service";
import { prisma } from "../../utils/prisma";

export const authRoutes = async (app: FastifyInstance) => {
  /**
   * 🔹 Signup
   */
  app.post(
    "/signup",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    async (req, reply) => {
      const body = signupSchema.parse(req.body);

      const { user, organization } = await service.signup(
        body.email,
        body.password,
        body.organizationName
      );

      // Get membership for new user
      const membership = await prisma.membership.findFirst({
        where: { userId: user.id },
        select: {
          organizationId: true,
          role: true,
        },
      });

      if (!membership) {
        return reply.status(400).send({ message: "No organization found" });
      }

      const token = (app as any).jwt.sign({
        userId: user.id,
        organizationId: membership.organizationId,
        role: membership.role,
      });

      return reply.send({
        token,
        organizationId: membership.organizationId,
        role: membership.role,
      });
    }
  );

  /**
   * 🔹 Login
   */
  app.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
    },
    async (req, reply) => {
      const body = loginSchema.parse(req.body);

      const user = await service.login(body.email, body.password);

      // Fetch first membership (single-org model for now)
      const membership = await prisma.membership.findFirst({
        where: { userId: user.id },
        select: {
          organizationId: true,
          role: true,
        },
      });

      if (!membership) {
        return reply.status(400).send({ message: "No organization found" });
      }

      const token = (app as any).jwt.sign({
        userId: user.id,
        organizationId: membership.organizationId,
        role: membership.role,
      });

      return reply.send({
        token,
        organizationId: membership.organizationId,
        role: membership.role,
        userId: user.id,
      });
    }
  );
};
