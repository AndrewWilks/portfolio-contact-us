import { z } from "zod";

const configSchema = z.object({
  DB_FILE_NAME: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  BACKEND_PORT: z.coerce.number().default(8000),
});

type Config = z.infer<typeof configSchema>;

let cachedConfig: Config | null = null;

function loadConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const nodeEnv = Deno.env.get("NODE_ENV") || "development";

  const config = {
    DB_FILE_NAME: Deno.env.get("DB_FILE_NAME"),
    NODE_ENV: nodeEnv,
    BACKEND_PORT: Deno.env.get("BACKEND_PORT"),
  };

  try {
    cachedConfig = configSchema.parse(config);
  } catch (error) {
    throw error;
  }
  return cachedConfig;
}

// Export a getter that loads config lazily
export const config: Config = new Proxy({} as Config, {
  get(_target, prop) {
    const realConfig = loadConfig();
    return realConfig[prop as keyof Config];
  },
});
