# Data Model

## contacts

- id, text, primary key, uuid
- first_name, text, not null
- last_name, text, not null
- email, text, not null, indexed
- phone, text, null
- message, text, null
- verified, integer as boolean, not null, default 0
- created_at, integer, not null

Notes on naming and types:

- Database columns use snake_case (e.g. `first_name`, `created_at`).
- TypeScript/JS layer will use camelCase fields (`firstName`, `createdAt`).
- `created_at` should be stored as epoch milliseconds (number) to match the API `Contact.createdAt` value.
- `verified` is stored as integer 0/1 in the DB but represented as a boolean in API types.

### Notes

- Use Drizzle ORM for schema and queries
- Use libSQL driver for local development and Turso option later
- Keep repository functions small, list, create, verify, remove

### Example Drizzle schema, TypeScript

```ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
});
```
