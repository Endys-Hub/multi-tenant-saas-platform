import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (app) => {
  await app.register(jwt as any, {
    secret: process.env.JWT_SECRET || "supersecret",
  });
});