import { drizzle } from "drizzle-orm/libsql";
import { config } from "@config/backend";

const db = drizzle({
  connection: { url: config.DB_FILE_NAME },
});

export { db };
