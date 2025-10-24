export {
  createContact,
  deleteContact,
  getContactById,
  listContacts,
  verifyContact,
  type ContactRow,
  type ContactInsertRow,
} from "./contacts.ts";

// Keep the repos layer focused on persistence shapes (snake_case).
// Mapping to/from API DTOs (camelCase) can be handled at the handler layer
// if/when needed. For simplicity in Sprint 1 we don't expose mappers here.
