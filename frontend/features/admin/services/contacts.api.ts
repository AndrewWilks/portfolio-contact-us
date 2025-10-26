import { api } from "../../../shared/lib/api/client.ts";
import type { Contact, ContactCreate } from "@shared/schema";

export async function listContacts(): Promise<Contact[]> {
  const res = await api.get<{ data: Contact[] }>("/contacts");
  return res.data;
}

export async function verifyContact(id: string): Promise<Contact> {
  const res = await api.patch<{ data: Contact }>(`/contacts/${id}/verify`);
  return res.data;
}

export async function unverifyContact(id: string): Promise<Contact> {
  const res = await api.patch<{ data: Contact }>(`/contacts/${id}/unverify`);
  return res.data;
}

export async function updateContact(
  id: string,
  payload: ContactCreate,
): Promise<Contact> {
  const res = await api.patch<{ data: Contact }>(`/contacts/${id}`, payload);
  return res.data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.del<void>(`/contacts/${id}`);
}

export default {
  listContacts,
  verifyContact,
  unverifyContact,
  updateContact,
  deleteContact,
};
