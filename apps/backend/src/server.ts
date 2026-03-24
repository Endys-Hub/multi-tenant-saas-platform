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
    await app.listen({ port: 4000, host: "0.0.0.0" });
    console.log("API running on http://localhost:4000");
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();

