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

    /* ===== VALIDATIONS ===== */
    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code cannot be empty" });
    }

    const validErrorTypes = ["TLE", "WA", "RE", "Overflow"];
    if (!validErrorTypes.includes(errorType)) {
      return res.status(400).json({ error: "Invalid error type" });
    }

    /* ===== RUN RULE ENGINE ===== */
    const raw = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    /* ===== NORMALIZE OUTPUT ===== */
    const findings = [];

    // Primary Issue
    if (raw?.primaryIssue) {
      findings.push({
        rule: raw.primaryIssue.matchedRule,
        confidence: raw.primaryIssue.confidence,
        reason: raw.primaryIssue.reason,
        fix: raw.primaryIssue.fix,
        severity: raw.primaryIssue.severity,
        errorType,
        suggestedTopics: raw.primaryIssue.suggestedTopics || [],
        similarProblems: raw.primaryIssue.similarProblems || [],
      });
    }

    // Secondary Issues
    if (Array.isArray(raw?.secondaryIssues)) {
      raw.secondaryIssues.forEach((issue) => {
        findings.push({
          rule: issue.matchedRule,
          confidence: issue.confidence,
          reason: issue.reason,
          fix: issue.fix,
          severity: issue.severity,
          errorType,
          suggestedTopics: issue.suggestedTopics || [],
          similarProblems: issue.similarProblems || [],
        });
      });
    }

    /* ===== SUMMARY ===== */
    const summary = {
      hasErrors: findings.length > 0,
      errorTypes: [...new Set(findings.map((f) => f.errorType))],
      score: Math.max(0, 100 - findings.length * 10),
    };

    /* ===== SAVE ANALYSIS ===== */
    const analysisDoc = await Analysis.create({
      userId: req.user._id, // IMPORTANT: full user object se
      language,
      topic,
      summary,
      findings,
    });

    /* ===== UPDATE STATS ===== */
    await updateStats(req.user._id, analysisDoc);

    /* ===== RESPONSE ===== */
    return res.status(201).json({
      summary,
      findings,
    });

  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({
      message: "Analysis failed",
      error: err.message,
    });
  }
};
