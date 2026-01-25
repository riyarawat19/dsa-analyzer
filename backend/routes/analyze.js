import express from "express";
import analyzeCode from "../services/ruleEngine.js";

const router = express.Router();


router.post("/", (req, res, next) => {
  try {
    const {
      code,
      language,
      errorType,
      problemType,
      constraints,
    } = req.body;

    // -------- Request-level validations --------
    if (!code || code.trim() === "") {
      return res.status(400).json({
        error: "Code cannot be empty",
      });
    }

    if (!errorType) {
      return res.status(400).json({
        error: "Error type is required",
      });
    }

    const validErrorTypes = ["TLE", "WA", "RE", "Overflow"];
    if (!validErrorTypes.includes(errorType)) {
      return res.status(400).json({
        error: "Invalid error type",
      });
    }

    // -------- Call Rule Engine --------
    const analysis = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    return res.status(200).json(analysis);
  } catch (err) {
    // Forward unexpected errors to global error handler
    next(err);
  }
});

export default router;
