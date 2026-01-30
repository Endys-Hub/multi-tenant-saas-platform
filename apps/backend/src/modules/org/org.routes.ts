import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/prisma";
import { requireTenant } from "../../middlewares/requireTenant";
import { requirePermission } from "../../middlewares/requirePermission";
import { PERMISSIONS } from "../../config/permissions";


  // JWT-only guard (no tenant required)
 
const jwtOnly = async (request: any) => {
  await request.jwtVerify();
};

export const orgRoutes = async (app: FastifyInstance) => {
 
  // Runs immediately after login. Uses JWT only → request.user

  app.get(
    "/bootstrap",
    { preHandler: jwtOnly },
    async (request: any) => {
      const membership = await prisma.membership.findFirst({
        where: { userId: request.user.userId }, 
      });

      if (!membership) {
        throw new Error("User has no organization");
      }

      return {
        organizationId: membership.organizationId,
        role: membership.role,
      };
    }
  );

   // Tenant-Scoped. Uses requireTenant → request.auth
   
  app.get(
    "/me",
    {
      preHandler: [
        ...requireTenant,
        requirePermission(PERMISSIONS.ORG_UPDATE),
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




