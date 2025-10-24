import { defineConfig } from "drizzle-kit";
import { config } from "./backend.config.ts";

export default defineConfig({
  out: "./.drizzle",
  schema: "./backend/db/db.schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: config.DB_FILE_NAME,
  },
});
