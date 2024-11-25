import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //     "@common": path.resolve(__dirname, "../common/src"),
  //   },
  // },
});
