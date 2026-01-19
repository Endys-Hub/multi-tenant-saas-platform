import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/prisma";

export const healthRoutes = async (app: FastifyInstance) => {
  // Liveness probe
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Readiness probe
  app.get("/ready", async () => {
    // DB check
    await prisma.$queryRaw`SELECT 1`;

    // (Optional later: Redis ping)
    return { ready: true };
  });
};
