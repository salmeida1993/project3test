import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5174,
    proxy: {
      "/auth": { target: "http://localhost:3000", changeOrigin: false },
      "/users": { target: "http://localhost:3000", changeOrigin: false },
      "/api":  { target: "http://localhost:3000", changeOrigin: false },
    },
  },
});
