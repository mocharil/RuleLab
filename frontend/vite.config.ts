import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  define: { "process.env.NODE_ENV": JSON.stringify(mode === "test" ? "test" : "production") },
  build: {
    outDir: "../app/static/framework",
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/entry.tsx"),
      formats: ["es"], fileName: () => "framework.js", cssFileName: "framework",
    },
    sourcemap: false,
  },
}));
