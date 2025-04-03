import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/weather": {
        target: "https://api.openweathermap.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, "/data/2.5/weather"),
      },
    },
  },
});
