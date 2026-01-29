import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import analyzeRoute from "./routes/analyze.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();

/* ===== CORS (NO OPTIONS NEEDED) ===== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use("/auth", authRoutes);
app.use("/api/analyze", analyzeRoute);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
