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
export default defineConfig(({ command }) => ({
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
    // Disable Deno plugin during production build to avoid resolver crash
    ...(command === "build" ? [] : [deno()]),
    // Generate typed routes relative to Vite root
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./frontend/pages",
      generatedRouteTree: "./frontend/routeTree.gen.ts",
      routeFileIgnorePrefix: "-",
      quoteStyle: "single",
    }),
    // React plugin after Deno + router
    react(),
    tailwindcss(),
  ].filter(Boolean),
  css: {
    postcss: "../.config/postcss.config.js",
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  publicDir: "../frontend/public",
  root: "frontend",
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
}));
