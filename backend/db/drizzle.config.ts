import { drizzle } from "drizzle-orm/libsql";

const db = drizzle({
  connection: { url: Deno.env.get("DB_FILE_NAME")! },
});

export { db };
