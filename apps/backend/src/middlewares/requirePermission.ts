import { FastifyRequest, FastifyReply } from "fastify";
import { ROLE_PERMISSIONS } from "../config/roles";
import { Permission } from "../config/permissions";

export const requirePermission =
  (permission: Permission) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const role = request.auth.role;

    const permissions = ROLE_PERMISSIONS[role] ?? [];

    if (!permissions.includes(permission)) {
      return reply.code(403).send({
        message: "Insufficient permissions",
      });
    }
  };
