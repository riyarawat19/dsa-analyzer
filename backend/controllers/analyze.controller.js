import analyzeCode from "../services/ruleEngine.js";
import Analysis from "../models/Analysis.js";
import { updateStats } from "../services/updateStats.js";
import mongoose from "mongoose";

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

    // 🔥 RAW RULE ENGINE OUTPUT (OBJECT)
    const raw = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    // 🔥 NORMALIZE INTO FINDINGS ARRAY
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

    // 🔥 SUMMARY
    const summary = {
      hasErrors: findings.length > 0,
      errorTypes: [...new Set(findings.map(f => f.errorType))],
      score: Math.max(0, 100 - findings.length * 20),
    };

    // 🔥 SAVE (IMPORTANT: ObjectId)
    const analysisDoc = await Analysis.create({
      userId: new mongoose.Types.ObjectId(req.user.userId),
      language,
      topic,
      summary,
      findings,
    });

    await updateStats(req.user.userId, analysisDoc);

    console.log("✅ ANALYSIS SAVED WITH FINDINGS:", findings.length);

    return res.status(201).json({
      analysis: analysisDoc,
    });

  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    return res.status(500).json({ message: "Analysis failed" });
  }
};
