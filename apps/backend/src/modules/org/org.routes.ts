import { FastifyInstance } from "fastify";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";


export const orgRoutes = async (app: FastifyInstance) => {
  app.get(
    "/me",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.ORG_UPDATE), //R
      ],
    },
    async (request) => {
      return {
        organizationId: request.auth.organizationId,
        role: request.auth.role,
      };
    }
  );
};
