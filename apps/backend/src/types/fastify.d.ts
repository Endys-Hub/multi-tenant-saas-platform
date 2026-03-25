import "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      userId: string;
      organizationId: string;
      role: string;
    };
    jwt: any;
  }

  interface FastifyInstance {
    jwt: any;
  }
}

