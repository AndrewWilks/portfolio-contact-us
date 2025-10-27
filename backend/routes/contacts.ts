import { Context } from "hono";
import { IdParamsSchema } from "@shared/schema";
import {
  type ContactInsertRow,
  createContact,
  deleteContact,
  listContacts,
  unverifyContact,
  updateContact,
  verifyContact,
} from "@backend/repos";
import type { ContactCreate } from "@shared/schema";

import {
  badRequest,
  created,
  noContent,
  notFound,
  ok,
} from "../utils/errors.ts";

// Helper to convert camelCase DTO to snake_case DB insert shape
function dtoToDb(
  payload: ContactCreate,
): Omit<ContactInsertRow, "id" | "createdAt"> {
  return {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    verified: false,
  };
}

export async function createContactHandler(c: Context) {
  const body = await c.req.json().catch(() => null);
  if (!body) return badRequest(c, "Missing or invalid JSON body");

  // Validation is performed by the zod-validator middleware wrapper
  // (applied in `backend/server.ts`). Here we assume the body is valid
  // and map it to the DB shape.
  const dbPayload = dtoToDb(body);
  const createdRow = await createContact({ payload: dbPayload });

  // map DB row to API DTO (camelCase)
  const apiContact = {
    id: createdRow.id,
    firstName: createdRow.firstName,
    lastName: createdRow.lastName,
    email: createdRow.email,
    phone: createdRow.phone,
    message: createdRow.message,
    verified: createdRow.verified,
    createdAt: createdRow.createdAt,
  };

  return created(c, apiContact);
}

export async function listContactsHandler(c: Context) {
  const q = c.req.query("q") || undefined;
  const verifiedParam = c.req.query("verified");
  const verified = typeof verifiedParam === "string"
    ? verifiedParam === "true"
    : undefined;

  const rows = await listContacts();

  // Apply simple in-memory filters for now (Sprint 2 scope)
  let filtered = rows;
  if (typeof verified !== "undefined") {
    filtered = filtered.filter((r) => !!r.verified === verified);
  }
  if (q) {
    const term = q.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        (r.firstName || "").toLowerCase().includes(term) ||
        (r.lastName || "").toLowerCase().includes(term) ||
        (r.email || "").toLowerCase().includes(term),
    );
  }

  return ok(c, filtered);
}

export async function verifyContactHandler(c: Context) {
  const id = c.req.param("id");
  if (!id) return badRequest(c, "Missing id param");

  // Validate param using shared Zod schema (middleware ordering can be tricky
  // for params so we validate inside the handler).
  const parsed = IdParamsSchema.safeParse({ id });
  if (!parsed.success) return badRequest(c, parsed.error.message);

  const updated = await verifyContact({ id });
  if (!updated) return notFound(c, "Contact not found");
  return ok(c, updated);
}

export async function deleteContactHandler(c: Context) {
  const id = c.req.param("id");
  if (!id) return badRequest(c, "Missing id param");

  const parsed = IdParamsSchema.safeParse({ id });
  if (!parsed.success) return badRequest(c, parsed.error.message);

  const deleted = await deleteContact({ id });
  if (!deleted) return notFound(c, "Contact not found");
  return noContent(c);
}

export async function unverifyContactHandler(c: Context) {
  const id = c.req.param("id");
  if (!id) return badRequest(c, "Missing id param");

  const parsed = IdParamsSchema.safeParse({ id });
  if (!parsed.success) return badRequest(c, parsed.error.message);

  const updated = await unverifyContact({ id });
  if (!updated) return notFound(c, "Contact not found");
  return ok(c, updated);
}

export async function updateContactHandler(c: Context) {
  const id = c.req.param("id");
  if (!id) return badRequest(c, "Missing id param");

  // Validate id param
  const parsed = IdParamsSchema.safeParse({ id });
  if (!parsed.success) return badRequest(c, parsed.error.message);

  const body = await c.req.json().catch(() => null);
  if (!body) return badRequest(c, "Missing or invalid JSON body");

  // Use the shared ContactCreate schema as a basis for validation but allow partial updates.
  // We validate here to avoid middleware ordering assumptions.
  const { ContactCreateSchema } = await import("@shared/schema");
  const updateSchema = ContactCreateSchema.partial();
  const parsedBody = updateSchema.safeParse(body);
  if (!parsedBody.success) return badRequest(c, parsedBody.error.message);

  const updated = await updateContact({ id, payload: parsedBody.data });
  if (!updated) return notFound(c, "Contact not found");
  return ok(c, updated);
}

export default {
  createContactHandler,
  listContactsHandler,
  verifyContactHandler,
  deleteContactHandler,
  unverifyContactHandler,
};
