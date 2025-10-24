# Data Model

## contacts

- id — text, primary key (uuid)
- first_name — text, not null
- last_name — text, not null
- email — text, not null
- phone — text, null
- message — text, null
- verified — integer (boolean mode), not null, default false
- created_at — integer (ms since epoch), not null

### Notes

- Use Drizzle ORM for schema and queries
- Columns are defined in snake_case in the DB layer (persistence shape). The
  shared Zod schemas live in `shared/schema` and currently use camelCase for
  DTOs. For Sprint 1 we keep the repo and tests working with the DB snake_case
  shape.
- Use libSQL driver for local development and Turso option later
- Keep repository functions small: `createContact`, `listContacts`,
  `getContactById`, `verifyContact`, `deleteContact`

### Exported types

- `ContactInsert` — Drizzle-inferred insert shape (exported from
  `backend/db/schema/contacts.ts` as `ContactInsert`)
- `ContactSelect` — Drizzle-inferred select shape (exported as `ContactSelect`)

These help typing repo methods and tests. Mapping between persistence
(snake_case) and API DTOs (camelCase) can be done in handlers if/when needed.

### Example Drizzle schema, TypeScript

```ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
```
