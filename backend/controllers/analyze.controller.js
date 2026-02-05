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
      topic = "general",
    } = req.body;

    if (!code || !errorType) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // 🔥 RULE ENGINE
    const raw = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    // 🔥 ALWAYS TRUST RULE ENGINE OUTPUT
    const timeComplexity = raw.timeComplexity ?? "Unknown";
    const spaceComplexity = raw.spaceComplexity ?? "Unknown";

    const findings = [];

    if (raw.primaryIssue) {
      findings.push({
        rule: raw.primaryIssue.matchedRule,
        reason: raw.primaryIssue.reason,
        fix: raw.primaryIssue.fix,
        confidence: raw.primaryIssue.confidence,
        errorType,
        severity: raw.primaryIssue.severity,
      });
    }

    if (Array.isArray(raw.secondaryIssues)) {
      raw.secondaryIssues.forEach((issue) => {
        findings.push({
          rule: issue.matchedRule,
          reason: issue.reason,
          fix: issue.fix,
          confidence: issue.confidence,
          errorType,
          severity: issue.severity,
        });
      });
    }

    const summary = {
      hasErrors: findings.length > 0,
      errorTypes: [...new Set(findings.map(f => f.errorType))],
      score: Math.max(0, 100 - findings.length * 20),
    };

    const analysisDoc = await Analysis.create({
      userId: req.user._id,
      language,
      topic,
      summary,
      findings,
      timeComplexity,
      spaceComplexity,
    });

    await updateStats(req.user._id, analysisDoc);

    return res.status(201).json({
      summary,
      findings,
      timeComplexity,
      spaceComplexity,
    });

  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ message: "Analysis failed" });
  }
};