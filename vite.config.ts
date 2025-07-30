import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // This changes output from 'dist' to 'build'
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    historyApiFallback: true,
  },
});
