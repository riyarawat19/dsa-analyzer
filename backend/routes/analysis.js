import express from "express";
import { runAnalysis } from "../controllers/analyze.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, (req,res,next)=>{
     console.log("/api/analyze ROUTE HIT");
     next();
} , runAnalysis);

export default router;
