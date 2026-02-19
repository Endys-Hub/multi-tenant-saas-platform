import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";
import { orgRoutes } from "./modules/org/org.routes";
import { inviteRoutes } from "./modules/invitations/invite.routes";
import { acceptInviteRoutes } from "./modules/invitations/accept.routes";
import { auditRoutes } from "./modules/audit/audit.routes";
import { webhookRoutes } from "./modules/billing/webhook.routes";
import { healthRoutes } from "./modules/health/health.routes";
import { membersRoutes } from "./modules/members/members.routes";
import { billingRoutes } from "./modules/billing/billing.routes";


export const registerRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(orgRoutes, { prefix: "/org" });
  app.register(inviteRoutes, { prefix: "/invitations" });
  app.register(acceptInviteRoutes, { prefix: "/invitations" });
  app.register(auditRoutes, { prefix: "/audit" });
  app.register(billingRoutes, { prefix: "/billing" });
  app.register(webhookRoutes, { prefix: "/billing" });
  app.register(membersRoutes, { prefix: "/members" });
  app.register(healthRoutes);
};
