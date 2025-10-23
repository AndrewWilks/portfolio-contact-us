import { zodValidatorWrapper } from "../utils/zodValidatorWrapper.ts";
import { ContactCreateSchema } from "@shared/schema";
import type { ContactCreate } from "@shared/schema";
import type { Context } from "hono";
import { createContact } from "@backend/repos";

export const validateCreateContact = zodValidatorWrapper(
  "json",
  ContactCreateSchema
);

export async function createContactHandler(c: Context) {
  const reqWithValid = c.req as unknown as { valid: (t: string) => unknown };
  const data = reqWithValid.valid("json") as ContactCreate;

  // persist contact using DB/repository (Drizzle + libSQL)
  const dbPayload = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message ?? null,
    verified: false,
  };

  const created = await createContact(dbPayload);

  // map DB row to API shape
  const apiContact = {
    id: created.id,
    firstName: created.first_name,
    lastName: created.last_name,
    email: created.email,
    phone: created.phone,
    message: created.message,
    verified: created.verified,
    createdAt: created.created_at,
  };

  return c.json({ ok: true, data: apiContact }, 201);
}

export default { validateCreateContact, createContactHandler };
