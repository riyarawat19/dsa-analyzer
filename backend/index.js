import express from "express";
import cors from "cors";

import analyzeRoute from "./routes/analyze.js";
import authRoutes from "./routes/auth.routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// ✅ CORS FIRST (this already handles OPTIONS)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

console.log("MONGO_URI:", process.env.MONGODB_URI ? "loaded" : "missing");

app.use("/auth", authRoutes);
app.use("/api/analyze", analyzeRoute);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
