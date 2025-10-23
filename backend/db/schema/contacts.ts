import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  created_at: integer("created_at").notNull(),
});
