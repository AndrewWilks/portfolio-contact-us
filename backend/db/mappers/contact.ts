import type { ContactSelect, ContactInsert } from "@db/schema";
import type { ContactCreate, Contact as ContactDto } from "@shared/schema";

/**
 * Map a DB row (snake_case) to the public DTO (camelCase) defined by shared Zod schema.
 *
 * This keeps persistence shapes separate from API shapes and makes it easy to
 * validate and serialize consistently.
 */
export function dbRowToDto(row: ContactSelect): ContactDto {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message ?? undefined,
    verified: !!row.verified,
    createdAt: row.created_at,
  };
}

/**
 * Map a shared DTO (ContactCreate) to a DB insert shape.
 * Does not include `id` or `created_at`.
 */
export function dtoToDbInsert(
  payload: ContactCreate
): Omit<ContactInsert, "id" | "created_at"> {
  return {
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    // Default verified to false for new inserts (repo can override)
    verified: false,
  } as Omit<ContactInsert, "id" | "created_at">;
}

export default {
  dbRowToDto,
  dtoToDbInsert,
};
