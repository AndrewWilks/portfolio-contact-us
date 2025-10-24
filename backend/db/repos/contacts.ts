import { desc, eq } from "drizzle-orm";
import { db } from "@db";
import { type ContactInsert, contacts, type ContactSelect } from "@db/schema";

// Export typed aliases for repository consumers
export type ContactInsertRow = ContactInsert;
export type ContactRow = ContactSelect;

/**
 * Creates a new contact record in the database.
 *
 * @param payload - The contact data excluding `id` and `created_at` fields.
 * @returns An object containing the newly created contact's details, including generated `id` and `created_at` timestamp.
 *
 * @remarks
 * - The `id` is generated using `crypto.randomUUID()`.
 * - The `created_at` timestamp is set to the current time in milliseconds.
 * - Optional fields `phone` and `message` are set to `null` if not provided.
 * - The `verified` field is coerced to a boolean value.
 * - This function performs an asynchronous database insert operation.
 */
export async function createContact({
  payload,
}: {
  payload: Omit<ContactInsertRow, "id" | "createdAt">;
}): Promise<ContactRow> {
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  await db.insert(contacts).values({
    id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    verified: !!payload.verified,
    createdAt,
  });

  return {
    id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    verified: !!payload.verified,
    createdAt: createdAt,
  } as const;
}

/**
 * Retrieves a list of contacts from the database, ordered by creation date in descending order.
 *
 * @returns {Promise<Array<Contact>>} A promise that resolves to an array of contact records.
 */
export async function listContacts(): Promise<ContactRow[]> {
  const rows = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt));
  return rows as ContactRow[];
}

/**
 * Retrieves a contact record from the database by its unique identifier.
 *
 * @param {Object} params - The parameters for retrieving the contact.
 * @param {string} params.id - The unique identifier of the contact to retrieve.
 * @returns {Promise<Contact | undefined>} A promise that resolves to the contact record if found, or undefined otherwise.
 */
export async function getContactById({
  id,
}: {
  id: string;
}): Promise<ContactRow | undefined> {
  const row = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .orderBy(desc(contacts.createdAt))
    .limit(1)
    .get();
  return row;
}

/**
 * Marks a contact as verified in the database.
 *
 * @param {Object} params - The parameters for verifying a contact.
 * @param {string} params.id - The unique identifier of the contact to verify.
 * @returns {Promise<Contact>} The updated contact record after verification.
 */
export async function verifyContact({
  id,
}: {
  id: string;
}): Promise<ContactRow | undefined> {
  const result = await db
    .update(contacts)
    .set({ verified: true })
    .where(eq(contacts.id, id))
    .returning();
  return result[0];
}

/**
 * Marks a contact as unverified in the database.
 *
 * @param {Object} params - The parameters for unverifying a contact.
 * @param {string} params.id - The unique identifier of the contact to unverify.
 * @returns {Promise<ContactRow|undefined>} The updated contact record after unverification.
 */
export async function unverifyContact({
  id,
}: {
  id: string;
}): Promise<ContactRow | undefined> {
  const result = await db
    .update(contacts)
    .set({ verified: false })
    .where(eq(contacts.id, id))
    .returning();
  return result[0];
}

/**
 * Deletes a contact from the database by its unique identifier.
 *
 * @param id - The unique identifier of the contact to delete.
 * @returns The deleted contact record, or `undefined` if no contact was found with the given id.
 */
export async function deleteContact({
  id,
}: {
  id: string;
}): Promise<ContactRow | undefined> {
  const result = await db
    .delete(contacts)
    .where(eq(contacts.id, id))
    .returning();
  return result[0];
}
