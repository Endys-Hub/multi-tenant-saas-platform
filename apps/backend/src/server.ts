// Global process guards

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// App bootstrap
import "./config/env";
import "./queues/email.queue";
import "./queues/billing.queue";

import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();

  try {
    const port = Number(process.env.PORT) || 4000;

    await app.listen({ port, host: "0.0.0.0" });
    console.log(`API running on http://localhost:${port}`);
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();

