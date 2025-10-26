import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { config as backend } from "@config/backend";
import { config as frontend } from "@config/frontend";

// https://vite.dev/config/
export default defineConfig({
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
    // Resolve Deno import map specifiers first
    deno(),
    // Generate typed routes relative to Vite root
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "pages",
      generatedRouteTree: "routeTree.gen.ts",
      routeFileIgnorePrefix: "-",
      quoteStyle: "single",
    }),
    // React plugin after Deno + router
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
});
