import express from "express";
import supabaseAuth from "../middleware/supabaseAuth.js";

const router = express.Router();

/**
 * GET /api/user/me
 * Returns logged-in Supabase user
 */
router.get("/me", supabaseAuth, (req, res) => {
  const user = req.user;

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || null,
      avatar: user.user_metadata?.avatar_url || null,
      createdAt: user.created_at,
    },
  });
});

export default router;
