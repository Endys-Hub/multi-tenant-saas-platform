import { FastifyInstance } from "fastify";
import { requireTenant } from "../../middlewares/requireTenant";

export const orgRoutes = async (app: FastifyInstance) => {
  app.get(
    "/me",
    { preHandler: requireTenant },
    async (request) => {
      return {
        organizationId: request.auth.organizationId,
        role: request.auth.role,
      };
    }
  );
};