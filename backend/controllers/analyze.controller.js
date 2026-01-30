import analyzeCode from "../services/ruleEngine.js";
import Analysis from "../models/Analysis.js";
import { updateStats } from "../services/updateStats.js";

export const runAnalysis = async (req, res) => {
  console.log("🔥 runAnalysis HIT");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  try {
    const { code, language, errorType, problemType, constraints, topic } =
      req.body;

    // -------- Validations --------
    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code cannot be empty" });
    }

    const validErrorTypes = ["TLE", "WA", "RE", "Overflow"];
    if (!validErrorTypes.includes(errorType)) {
      return res.status(400).json({ error: "Invalid error type" });
    }

    // -------- Run Rule Engine (RAW OUTPUT) --------
    const raw = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    // -------- Normalize Findings (CRITICAL FIX) --------
    const findings = [];

    if (raw?.matchedRule) {
      findings.push({
        rule: raw.matchedRule,
        confidence: raw.confidence,
        reason: raw.reason,
        fix: raw.fix,
        severity: raw.severity,
        errorType,
        suggestedTopics: raw.suggestedTopics || [],
        similarProblems: raw.similarProblems || [],
      });
    }

    if (Array.isArray(raw?.secondaryIssues)) {
      raw.secondaryIssues.forEach((issue) => {
        findings.push({
          rule: issue.matchedRule,
          confidence: issue.confidence,
          reason: issue.reason,
          fix: issue.fix,
          severity: issue.severity,
          errorType,
        });
      });
    }

    // -------- Build Summary --------
    const summary = {
      hasErrors: findings.length > 0,
      errorTypes: [...new Set(findings.map((f) => f.errorType))],
      score: Math.max(0, 100 - findings.length * 10),
    };

    // -------- Save Analysis (STEP 1 CORE) --------
    const analysisDoc = await Analysis.create({
      userId: req.user.userId,
      language,
      topic,
      summary,
      findings,
    });

    console.log("✅ ANALYSIS SAVED:", analysisDoc._id);

    // -------- Update Stats --------
    await updateStats(req.user.userId, analysisDoc);

    // -------- Respond --------
    return res.status(201).json({
      summary,
      findings,
    });
  } catch (err) {
    console.error("ANALYSIS ERROR STACK:", err);
    return res.status(500).json({
      message: "Analysis failed",
      error: err.message,
    });
  }
};
