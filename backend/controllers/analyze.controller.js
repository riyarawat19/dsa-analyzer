import analyzeCode from "../services/ruleEngine.js";
import Analysis from "../models/Analysis.js";
import { updateStats } from "../services/updateStats.js";
import { estimateComplexity } from "../utils/complexityEstimator.js";

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

    /* ===================== VALIDATION ===================== */
    if (!code || !errorType) {
      return res.status(400).json({ error: "Invalid input" });
    }

    /* ===================== RULE ENGINE ===================== */
    const raw = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    /* ===================== COMPLEXITY ESTIMATION ===================== */
    const complexity = estimateComplexity(code);

    /* ===================== NORMALIZE FINDINGS ===================== */
    const findings = [];

    if (raw?.matchedRule) {
      findings.push({
        rule: raw.matchedRule,
        reason: raw.reason,
        fix: raw.fix,
        confidence: raw.confidence,
        errorType,
        severity: raw.severity || "Medium",
        suggestedTopics: raw.suggestedTopics || [],
        similarProblems: raw.similarProblems || [],
      });
    }

    if (Array.isArray(raw?.secondaryIssues)) {
      raw.secondaryIssues.forEach((issue) => {
        findings.push({
          rule: issue.matchedRule,
          reason: issue.reason,
          fix: issue.fix,
          confidence: issue.confidence,
          errorType,
          severity: issue.severity || "Low",
          suggestedTopics: issue.suggestedTopics || [],
          similarProblems: issue.similarProblems || [],
        });
      });
    }

    /* ===================== SUMMARY ===================== */
    const summary = {
      hasErrors: findings.length > 0,
      errorTypes: [...new Set(findings.map((f) => f.errorType))],
      score: Math.max(0, 100 - findings.length * 20),
    };

    /* ===================== SAVE TO DB ===================== */
    const analysisDoc = await Analysis.create({
      userId: req.user._id, // ✅ CORRECT ObjectId
      language,
      topic,
      summary,
      findings,

      // ✅ FROM COMPLEXITY ESTIMATOR (NOT RULE ENGINE)
      timeComplexity: complexity.timeComplexity || "Unknown",
      spaceComplexity: complexity.spaceComplexity || "Unknown",
    });

    /* ===================== UPDATE DASHBOARD STATS ===================== */
    await updateStats(req.user._id, analysisDoc);

    console.log("✅ ANALYSIS SAVED:", analysisDoc._id);

    /* ===================== RESPONSE ===================== */
    return res.status(201).json({
      summary,
      findings,
      timeComplexity: complexity.timeComplexity || "Unknown",
      spaceComplexity: complexity.spaceComplexity || "Unknown",
    });

  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ message: "Analysis failed" });
  }
};