// deploy.js
// Script to check and set environment variables for deployment

import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we're in a production build
const isProduction = process.env.NODE_ENV === "production";

console.log(`Running in ${isProduction ? "production" : "development"} mode`);

// Load the appropriate .env file
const envFile = isProduction ? ".env.production" : ".env.development";
const envPath = path.resolve(__dirname, envFile);

console.log(`Loading environment from: ${envPath}`);

// Check if the env file exists
if (fs.existsSync(envPath)) {
  console.log(`${envFile} found, loading environment variables`);
  const envConfig = dotenv.parse(fs.readFileSync(envPath));

  // Set environment variables
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }

  console.log("Environment variables loaded:");
  console.log(`VITE_API_URL: ${process.env.VITE_API_URL}`);
} else {
  console.warn(`${envFile} not found, using default environment variables`);

  // Set default API URL if not found
  if (!process.env.VITE_API_URL) {
    process.env.VITE_API_URL = isProduction
      ? "https://tensorfinance-advisor.onrender.com"
      : "http://localhost:3001";

    console.log(`Set default VITE_API_URL: ${process.env.VITE_API_URL}`);
  }
}

console.log("Deployment configuration complete");
