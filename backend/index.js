import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import analysisRoute from "./routes/analysis.js";
import dashboardRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ===== CORS ===== */
app.use(
  cors({
    origin: [
      "https://dsa-analyzer-silk.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ===== START SERVER ===== */
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    app.use("/api/analysis", analysisRoute);
    app.use("/api/dashboard", dashboardRoutes);
    app.use("/api/user", userRoutes);

    app.get("/", (req, res) => {
      res.send("Backend running ✅");
    });

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
