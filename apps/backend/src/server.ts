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
import { execSync } from "child_process";

const start = async () => {
  // Run DB sync
  try {
    console.log("Syncing database schema...");

    execSync("npx prisma db push", {
      stdio: "inherit",
    });

    console.log("Database synced.");
  } catch (err) {
    console.error("DB sync failed:", err);
  }

  const app = buildApp();

  try {
    const port = Number(process.env.PORT) || 4000;

    await app.listen({ port, host: "0.0.0.0" });

    console.log(`API running on port ${port}`);
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();

