import express from "express";
import { runAnalysis } from "../controllers/analyze.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ONE route, ONE responsibility
router.post("/", authMiddleware, runAnalysis);

export default router;
