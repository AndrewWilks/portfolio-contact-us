import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { ShutdownManager } from "./shutdownManager.ts";
import onErrorHandler from "./middleware/errorHandler.ts";

import * as routes from "@backend/routes";
import zodValidatorWrapper from "./utils/zodValidatorWrapper.ts";
import * as schema from "@shared/schema";
import type { ValidationTargets as _ValidationTargets } from "hono";

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
    origin: safeEnv("NODE_ENV") === "production"
      ? [safeEnv("APP_URL") || ""]
      : ["http://localhost:3000"],
    credentials: true,
  }),
);

// Rate Limiting Middleware
// TODO: add rate limiting middleware here

// Error handling moved to middleware file
backend.onError(onErrorHandler);

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
  "contacts",
  zodValidatorWrapper("json", schema.ContactCreateSchema),
  routes.createContactHandler,
);
backend.get(
  "contacts",
  zodValidatorWrapper("query", schema.ContactsQuerySchema),
  routes.listContactsHandler,
);
backend.patch("contacts/:id/verify", routes.verifyContactHandler);
backend.delete("contacts/:id", routes.deleteContactHandler);
backend.patch("contacts/:id/unverify", routes.unverifyContactHandler);
backend.patch(
  "contacts/:id",
  zodValidatorWrapper("json", schema.ContactCreateSchema.partial()),
  routes.updateContactHandler,
);

if (import.meta.main) {
  const server = Deno.serve(backend.fetch);

  // Instantiate and hook into SIGINT
  const shutdownManager = new ShutdownManager(server);
  shutdownManager.listenToSignal("SIGINT");
}
