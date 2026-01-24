import express from "express";
import cors from "cors";

import analyzeRoute from "./routes/analyze.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// ✅ CORS FIRST (this already handles OPTIONS)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ JSON
app.use(express.json());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/analyze", analyzeRoute);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
