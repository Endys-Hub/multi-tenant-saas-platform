import { FastifyInstance } from "fastify";
import { signupSchema, loginSchema } from "./auth.schemas";
import * as service from "./auth.service";

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/signup",  {
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

      const token = (app as any).jwt.sign({ userId: user.id });
      return reply.send({ token });
    });

  app.post("/login",  {
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
      const token = (app as any).jwt.sign({ userId: user.id });

      return reply.send({ token });
    });
};
