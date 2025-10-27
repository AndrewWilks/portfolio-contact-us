import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z
    .enum(
      ["development", "production"],
      "Invalid NODE_ENV value in environment variables"
    )
    .default("development"),
  FRONTEND_PORT: z.coerce
    .number("Invalid FRONTEND_PORT value in environment variables")
    .default(3000),
});

type Config = z.infer<typeof configSchema>;

let cachedConfig: Config | null = null;

export function loadConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const config = {
    NODE_ENV: Deno.env.get("NODE_ENV") || "development",
    FRONTEND_PORT: Deno.env.get("FRONTEND_PORT") || 5173,
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
