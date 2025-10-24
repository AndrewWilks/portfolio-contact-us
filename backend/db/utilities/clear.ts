import { db } from "@db";
import { contacts } from "@db/schema";

export async function clearContacts() {
  await db.delete(contacts);
}
