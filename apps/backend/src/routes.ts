import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";
import { orgRoutes } from "./modules/org/org.routes";

export const registerRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(orgRoutes, { prefix: "/org" });
};
