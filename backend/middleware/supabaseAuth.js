import jwt from "jsonwebtoken";

const supabaseAuth = (req, res, next) => {
  try {
    // Allow CORS preflight
    if (req.method === "OPTIONS") return next();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No auth header" });
    }

    const token = authHeader.replace("Bearer ", "");

    // 🔑 DO NOT VERIFY — JUST DECODE
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.sub) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // This is the Supabase user
    req.user = {
      id: decoded.sub,                 // UUID
      email: decoded.email,
      user_metadata: decoded.user_metadata || {},
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(403).json({ message: "Auth failed" });
  }
};

export default supabaseAuth;
