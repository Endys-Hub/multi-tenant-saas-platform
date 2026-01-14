import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import { registerRoutes } from "./routes";
import rateLimit from "@fastify/rate-limit";
import { tenantRateLimitKey } from "./plugins/rateLimit";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  // Fastify typing boundary — coerced ONCE
  app.register(jwtPlugin as any);

  app.register(rateLimit as any, {
  global: false, // controled per route
});

  app.register(rateLimit as any, {
  global: false,
  //keyGenerator: tenantRateLimitKey,
});

  app.register(registerRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  app.ready(() => {
  console.log(app.printRoutes());
});


  return app;
};

