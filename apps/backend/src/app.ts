import Fastify from "fastify";
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

//  app.get("/health", async () => ({ status: "ok" }));

  app.ready(() => {
  console.log(app.printRoutes());
});


  return app;
};

