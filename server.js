import express from "express";
import train from "./training.js";
import cors from "cors";

const app = express();
// Use environment variable for port or default to 3001
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend requests with specific origins in production
app.use(
  cors({
    origin: [
      "https://tensor-finance-advisor.vercel.app",
      "https://tensorfinance-advisor.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Use the imported router
app.use("/api", train);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    apiBase: process.env.API_URL || `http://localhost:${PORT}`,
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
