import { FastifyInstance } from "fastify";
import { signupSchema, loginSchema } from "./auth.schemas";
import * as service from "./auth.service";
import { prisma } from "../../utils/prisma";

export const authRoutes = async (app: FastifyInstance) => {

   // Signup
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

      const { user } = await service.signup(
        body.email,
        body.password,
        body.organizationName
      );

      const membership = await prisma.membership.findFirst({
        where: { userId: user.id },
      });

      if (!membership) {
        return reply.status(400).send({ message: "No organization found" });
      }

      const token = (app.jwt as any).sign({
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

  // Login
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

      const result = await service.login(
        app,
        body.email,
        body.password
      );

      return reply.send(result);
    }
  );
};
