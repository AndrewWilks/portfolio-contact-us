import type { ContactCreate } from "@shared/schema";
import { api } from "../../../shared/lib/api/client.ts";

// Service: handles the POST /api/contacts call and throws on failure
export async function createContact(payload: ContactCreate): Promise<void> {
  await api.post<void, ContactCreate>("/contacts", payload);
}

export default { createContact };
