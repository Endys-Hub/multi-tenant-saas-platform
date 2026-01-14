import { FastifyRequest } from "fastify";

export const tenantRateLimitKey = (request: FastifyRequest) => {
  return request.auth?.organizationId || request.ip;
};