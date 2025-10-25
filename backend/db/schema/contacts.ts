import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
  id: text().primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().notNull(),
  phone: text(),
  message: text(),
  verified: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer().notNull(),
});

// Drizzle inferred types for the contacts table
// - ContactInsert: shape accepted by insert operations ($inferInsert)
// - ContactSelect: shape returned by select queries ($inferSelect)
export type ContactInsert = typeof contacts.$inferInsert;
export type ContactSelect = typeof contacts.$inferSelect;

export default contacts;
