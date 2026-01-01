import { FastifyRequest, FastifyReply } from "fastify";

export const requireAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const payload = await request.jwtVerify<{ userId: string }>();
    request.auth = {
      userId: payload.userId,
      organizationId: "",
      role: "",
    };
  } catch {
    reply.code(401).send({ message: "Unauthorized" });
  }
};
