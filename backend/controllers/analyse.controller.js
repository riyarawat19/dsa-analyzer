import analyzeCode from "../services/ruleEngine.js";
import Analysis from "../models/Analysis.js";
import { updateStats } from "../services/updateStats.js";

export const runAnalysis = async (req, res) => {
  try {
    const {
      code,
      language,
      errorType,
      problemType,
      constraints,
      topic,
    } = req.body;

    // -------- Validations --------
    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code cannot be empty" });
    }

    const validErrorTypes = ["TLE", "WA", "RE", "Overflow"];
    if (!validErrorTypes.includes(errorType)) {
      return res.status(400).json({ error: "Invalid error type" });
    }

    // -------- Run Rule Engine --------
    const findings = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    // -------- Build summary --------
    const errorTypes = [...new Set(findings.map(f => f.errorType))];

    const summary = {
      hasErrors: findings.length > 0,
      errorTypes,
      score: Math.max(0, 100 - findings.length * 10),
    };

    // -------- Save analysis --------
    const analysisDoc = await Analysis.create({
      userId: req.user.userId,
      language,
      topic,
      summary,
      findings,
    });

    // -------- Update stats --------
    await updateStats(req.user.userId, analysisDoc);

    // -------- Respond --------
    return res.status(201).json({
      message: "Analysis completed",
      analysis: analysisDoc,
    });

  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ message: "Analysis failed" });
  }
};
