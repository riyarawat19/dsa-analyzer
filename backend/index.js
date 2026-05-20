import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import analysisRoute from "./routes/analysis.js";
import dashboardRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/user.routes.js";


const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: process.env.NODE_ENV === "development"
      ? "http://localhost:5173" 
      : "https://dsa-analyzer-silk.vercel.app", 
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
      res.send("Backend running ");
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
