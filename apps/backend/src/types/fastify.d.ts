import "@fastify/jwt";
import { FastifyJWT } from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
    };
  }
}
