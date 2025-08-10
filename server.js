import express from "express";
import train from "./training.js";
import cors from "cors";

const app = express();
// Use environment variable for port or default to 3001
const PORT = process.env.PORT || 3001;

// List of allowed origins
const allowedOrigins = [
  "https://tensor-finance-advisor.vercel.app",
  "https://tensorfinance-advisor.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

// Set up CORS middleware with more permissive settings for deployment
app.use(
  cors({
    origin: "*", // Allow all origins temporarily to debug
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Set to false to simplify CORS
  })
);

// Additional middleware to ensure CORS headers are present
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }
  next();
});

app.use(express.json());

// Use the imported router
app.use("/api", train);

// Health check endpoint
app.get("/health", (req, res) => {
  // Set CORS headers explicitly for health endpoint
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    apiBase: process.env.API_URL || `http://localhost:${PORT}`,
    corsAllowedOrigins: allowedOrigins,
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the TensorFlow Training API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/train`);
});
