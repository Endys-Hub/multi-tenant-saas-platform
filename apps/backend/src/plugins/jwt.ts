import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyPluginAsync } from "fastify";

const jwtPlugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt as any, {
    secret: process.env.JWT_SECRET || "supersecret",
  });
};

export default fp(jwtPlugin as any);