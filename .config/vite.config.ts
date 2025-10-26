import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { config as backend } from "@config/backend";
import { config as frontend } from "@config/frontend";
import path from "node:path";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Compute absolute paths for the route generator to avoid cwd/root timing issues
  const rootAbs = path.resolve(
    fileURLToPath(new URL(".", import.meta.url)),
    "../frontend",
  );
  const routesAbs = path.resolve(rootAbs, "pages");
  const routeTreeAbs = path.resolve(rootAbs, "routeTree.gen.ts");
  const outputDir = path.resolve(
    fileURLToPath(new URL(".", import.meta.url)),
    "../dist/frontend",
  );

  return {
    server: {
      port: frontend.FRONTEND_PORT,
      proxy: {
        "/api": {
          target: `http://localhost:${backend.BACKEND_PORT}/`,
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
        },
      },
    },
    plugins: [
      // Generate typed routes using absolute paths for consistency
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        // Use absolute paths to ensure the generator can find the pages folder before Vite root resolves
        routesDirectory: routesAbs,
        generatedRouteTree: routeTreeAbs,
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
      }),
      // Keep Deno plugin in dev; disable for build to avoid resolver issues
      ...(command === "build" ? [] : [deno()]),
      react(),
      tailwindcss(),
    ],
    css: {
      postcss: "../.config/postcss.config.js",
    },
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
    publicDir: "../frontend/public",
    root: "frontend",
    build: {
      outDir: outputDir,
    },
    resolve: {
      alias: {
        "@ui": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../frontend/shared/ui",
        ),
        "@blocks": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../frontend/shared/blocks",
        ),
        "@features": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../frontend/features",
        ),
        "@hooks": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../frontend/hooks",
        ),
        "@pages": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../frontend/pages",
        ),
        "@contexts": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../frontend/contexts",
        ),
        "@shared/schema": path.resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "../shared/schema/index.ts",
        ),
      },
    },
  };
});
