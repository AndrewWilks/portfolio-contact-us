import type { PlaywrightTestConfig } from "@playwright/test";

// Base URL can be overridden via env var to match local/CI port (Deno-native)
const denoEnv = (globalThis as any).Deno?.env;
const port = denoEnv?.get("FRONTEND_PORT") ?? "3000";
const baseURL =
  denoEnv?.get("PLAYWRIGHT_BASE_URL") ?? `http://localhost:${port}`;

const config: PlaywrightTestConfig = {
  // Config file lives under .config/, so point to tests one level up
  testDir: "../frontend/__tests__",
  timeout: 30_000,
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  // For convenience, try to boot both API and UI via the dev task.
  // If you prefer to run servers manually, set reuseExistingServer to true and start them beforehand.
  webServer: {
    command: "deno task dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
};

export default config;
