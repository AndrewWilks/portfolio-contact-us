import { Hono } from "hono";
import { zodValidatorWrapper } from "../utils/zodValidatorWrapper.ts";
import { ContactCreateSchema, ContactSchema } from "@shared/schema";
import type { ContactCreate } from "@shared/schema";

const router = new Hono();

// POST /api/contacts
router.post(
  "/",
  // validate JSON body using the wrapper which uses @hono/zod-validator
  zodValidatorWrapper("json", ContactCreateSchema),
  async (c) => {
    // c.req.valid('json') is provided by zod-validator middleware
    const data = c.req.valid("json") as ContactCreate;

    // TODO: persist contact using DB/repository (Drizzle + libSQL) — placeholder implementation
    const contact = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message ?? null,
      verified: false,
      createdAt: Date.now(),
    } as const;

    return c.json({ ok: true, data: contact }, 201);
  }
);

export default router;
