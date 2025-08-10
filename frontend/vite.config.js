import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      // Make env variables available in the client code
      "process.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "https://tensorfinance-advisor.onrender.com"
      ),
    },
  };
});
