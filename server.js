import express from "express";
import train from "./training.js";
import cors from "cors";

const app = express();
// Use environment variable for port or default to 3001
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend requests with specific origins in production
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://tensorfinance-advisor.vercel.app", process.env.FRONTEND_URL]
        : "http://localhost:5174", // Default Vite dev server port
    credentials: true,
  })
);
app.use(express.json());

// Use the imported router
app.use("/api", train);

app.get("/", (req, res) => {
  res.send("Welcome to the TensorFlow Training API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
