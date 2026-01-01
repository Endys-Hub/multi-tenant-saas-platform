import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (app) => {
  // Runtime
  app.register(jwt as any, {
    secret: process.env.JWT_SECRET || "dev-secret",
  });
});

