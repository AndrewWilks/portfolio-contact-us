import { eq, desc } from "drizzle-orm";
import { db } from "../index.ts";
import { contacts } from "../schema/contacts.ts";

export type ContactRow = typeof contacts.$inferInsert;

export async function createContact(
  payload: Omit<ContactRow, "id" | "created_at">
) {
  const id = crypto.randomUUID();
  const created_at = Date.now();

  await db.insert(contacts).values({
    id,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    verified: !!payload.verified,
    created_at,
  });

  return {
    id,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    verified: !!payload.verified,
    created_at,
  } as const;
}

export async function listContacts() {
  const rows = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.created_at));
  return rows;
}

export async function getContactById(id: string) {
  const row = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .orderBy(desc(contacts.created_at))
    .limit(1)
    .get();
  return row;
}
