import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { ShutdownManager } from "./shutdownManager.ts";

import * as routes from "@backend/routes";
import zodValidatorWrapper from "./utils/zodValidatorWrapper.ts";
import * as schema from "@shared/schema";
import type { ValidationTargets } from "hono";

const backend = new Hono();
export { backend };

// Logger Middleware
backend.use("*", logger());

// // CORS Middleware
const safeEnv = (key: string) => {
  try {
    return Deno.env.get(key);
  } catch {
    return undefined;
  }
};
backend.use(
  "*",
  cors({
    origin:
      safeEnv("NODE_ENV") === "production"
        ? [safeEnv("APP_URL") || ""]
        : ["http://localhost:3000"],
    credentials: true,
  })
);

// Rate Limiting Middleware
// TODO: add rate limiting middleware here

// // Error Handling Middleware
backend.onError((err, c) => {
  console.error("Error occurred:", err);
  return c.json(
    { message: "Internal Server Error", details: err.message },
    500
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

// Contacts API
// Use zod-validator wrapper middleware to validate the JSON body for create
backend.post(
  "/api/contacts",
  zodValidatorWrapper("json", schema.ContactCreateSchema),
  routes.createContactHandler
);
backend.get(
  "/api/contacts",
  zodValidatorWrapper("query", schema.ContactsQuerySchema),
  routes.listContactsHandler
);
backend.patch(
  "/api/contacts/:id/verify",
  zodValidatorWrapper(
    "params" as keyof ValidationTargets,
    schema.IdParamsSchema
  ),
  routes.verifyContactHandler
);
backend.delete(
  "/api/contacts/:id",
  zodValidatorWrapper(
    "params" as keyof ValidationTargets,
    schema.IdParamsSchema
  ),
  routes.deleteContactHandler
);

if (import.meta.main) {
  const server = Deno.serve(backend.fetch);

  // Instantiate and hook into SIGINT
  const shutdownManager = new ShutdownManager(server);
  shutdownManager.listenToSignal("SIGINT");
}
