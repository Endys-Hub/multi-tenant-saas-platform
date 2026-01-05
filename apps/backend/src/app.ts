import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import { registerRoutes } from "./routes";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  // Fastify typing boundary — coerced ONCE
  app.register(jwtPlugin as any);

  app.register(registerRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  app.ready(() => {
  console.log(app.printRoutes());
});


  return app;
};

