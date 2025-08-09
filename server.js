import express from "express";
import train from "./training.js";
import cors from "cors";

const app = express();
const PORT = 3001;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Use the imported router
app.use("/api", train);

app.get("/", (req, res) => {
  res.send("Welcome to the TensorFlow Training API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
