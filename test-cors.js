// test-cors.js
// Simple script to test CORS configuration

import fetch from "node-fetch";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Default URLs
const DEFAULT_BACKEND_URL = "https://tensorfinance-advisor.onrender.com";
const DEFAULT_FRONTEND_URL = "https://tensor-finance-advisor.vercel.app";

// Test data
const testData = {
  income: 5000,
};

async function testCORS() {
  try {
    // Get URLs from user or use defaults
    rl.question(
      `Enter backend URL (default: ${DEFAULT_BACKEND_URL}): `,
      async (backendUrl) => {
        backendUrl = backendUrl || DEFAULT_BACKEND_URL;

        rl.question(
          `Enter frontend origin (default: ${DEFAULT_FRONTEND_URL}): `,
          async (origin) => {
            origin = origin || DEFAULT_FRONTEND_URL;

            console.log("\n--- CORS Test ---");
            console.log(`Testing backend: ${backendUrl}`);
            console.log(`Simulating request from: ${origin}`);

            // Test health endpoint
            try {
              console.log("\nTesting health endpoint...");
              const healthResponse = await fetch(`${backendUrl}/health`, {
                method: "GET",
                headers: {
                  Origin: origin,
                },
              });

              console.log(`Health status: ${healthResponse.status}`);
              if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                console.log("Health response:", healthData);
              }
            } catch (error) {
              console.error("Health endpoint error:", error.message);
            }

            // Test API endpoint
            try {
              console.log("\nTesting API endpoint...");
              const apiResponse = await fetch(`${backendUrl}/api/train`, {
                method: "POST",
                headers: {
                  Origin: origin,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(testData),
              });

              console.log(`API status: ${apiResponse.status}`);
              if (apiResponse.ok) {
                const apiData = await apiResponse.json();
                console.log("API response received successfully");
                console.log(
                  "Prediction data available:",
                  Object.keys(apiData).join(", ")
                );
              } else {
                const errorText = await apiResponse.text();
                console.error("API error response:", errorText);
              }
            } catch (error) {
              console.error("API endpoint error:", error.message);
            }

            rl.close();
          }
        );
      }
    );
  } catch (error) {
    console.error("Test failed:", error);
    rl.close();
  }
}

// Run the test
testCORS();
