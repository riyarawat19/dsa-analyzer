import express from "express";
import supabaseAuth from "../middleware/supabaseAuth.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", supabaseAuth, getDashboardStats);

export default router;
