export {
  createContact,
  deleteContact,
  getContactById,
  listContacts,
  verifyContact,
  type ContactRow,
  type ContactInsertRow,
} from "./contacts.ts";

export { dbRowToDto, dtoToDbInsert } from "../mappers/contact.ts";
export type { Contact as ContactDto, ContactCreate } from "@shared/schema";
