import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Landing page bundle: built separately so the public page never loads workspace code.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "../app/static/landing-app",
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/landing/main.tsx"),
      formats: ["es"], fileName: () => "landing.js", cssFileName: "landing",
    },
    sourcemap: false,
  },
});
