import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";
import { orgRoutes } from "./modules/org/org.routes";
import { inviteRoutes } from "./modules/invitations/invite.routes";
import { acceptInviteRoutes } from "./modules/invitations/accept.routes";

export const registerRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(orgRoutes, { prefix: "/org" });
  app.register(inviteRoutes, { prefix: "/invitations" });
  app.register(acceptInviteRoutes, { prefix: "/invitations" });
};
