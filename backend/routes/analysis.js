import express from "express";
import { runAnalysis } from "../controllers/analyze.controller.js";
import supabaseAuth from "../middleware/supabaseAuth.js";

const router = express.Router();

router.post("/", supabaseAuth , (req,res,next)=>{
     console.log("/api/analyze ROUTE HIT");
     next();
} , runAnalysis);

export default router;
