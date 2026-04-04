import Fastify from "fastify";
import cors from "@fastify/cors";
import jwtPlugin from "./plugins/jwt";
import { registerRoutes } from "./routes";
import rateLimit from "@fastify/rate-limit";
import { tenantRateLimitKey } from "./plugins/rateLimit";

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  app.register(cors as any, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Organization-Id"],
  });

  // Fastify typing boundary — coerced ONCE
  app.register(jwtPlugin as any);

  app.register(rateLimit as any, {
    global: false,
  });

  app.register(rateLimit as any, {
    global: false,
    // keyGenerator: tenantRateLimitKey,
  });

  app.register(registerRoutes);

  app.ready(() => {
    console.log(app.printRoutes());
  });

  return app;
};

