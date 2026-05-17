import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { resolve } from "node:path";

export default defineConfig({
  site: "https://example.com",
  integrations: [react(), icon(), sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.API_URL ?? "http://localhost:5001",
          changeOrigin: true,
        },
      },
    },
  },
});
