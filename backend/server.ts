import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// import { db } from "@db";
import { ShutdownManager } from "./shutdownManager.ts";

import * as routes from "@backend/routes";

const backend = new Hono();
export { backend };

// Logger Middleware
backend.use("*", logger());

// // CORS Middleware
backend.use(
  "*",
  cors({
    origin: Deno.env.get("NODE_ENV") === "production"
      ? [Deno.env.get("APP_URL") || ""]
      : ["http://localhost:3000"],
    credentials: true,
  }),
);

// Rate Limiting Middleware
// TODO: add rate limiting middleware here

// // Error Handling Middleware
backend.onError((err, c) => {
  console.error("Error occurred:", err);
  return c.json(
    { message: "Internal Server Error", details: err.message },
    500,
  );
});

backend.get("/", (c) => {
  return c.json({ message: "Welcome to the Portfolio Contact Us API" });
});

// Health check
backend.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    locale: "en-AU",
    timezone: "Australia/Brisbane",
  });
});

// API Routes
backend.get("/hello", routes.api_hello);

if (import.meta.main) {
  const server = Deno.serve(backend.fetch);

  // Instantiate and hook into SIGINT
  const shutdownManager = new ShutdownManager(server);
  shutdownManager.listenToSignal("SIGINT");
}
