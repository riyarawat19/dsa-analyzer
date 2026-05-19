import analyzeCode from "../services/ruleEngine.js";
import Analysis from "../models/Analysis.js";
import { updateStats } from "../services/updateStats.js";
import { analyzeWithAI } from "../services/aiAnalyzer.js";

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
      return res.status(400).json({
        error: "Invalid input",
      });
    }

    // RULE ENGINE
    const raw = analyzeCode({
      code,
      language,
      errorType,
      problemType,
      constraints,
    });

    const timeComplexity =
      raw.timeComplexity ?? "Unknown";

    const spaceComplexity =
      raw.spaceComplexity ?? "Unknown";

    const findings = [];

    // PRIMARY ISSUE
    if (raw.primaryIssue) {
      findings.push({
        rule: raw.primaryIssue.matchedRule,
        reason: raw.primaryIssue.reason,
        fix: raw.primaryIssue.fix,
        confidence:
          raw.primaryIssue.confidence,
        errorType,
        severity: raw.primaryIssue.severity,
        source: "rule-engine",
      });
    }

    // SECONDARY ISSUES
    if (Array.isArray(raw.secondaryIssues)) {
      raw.secondaryIssues.forEach((issue) => {
        findings.push({
          rule: issue.matchedRule,
          reason: issue.reason,
          fix: issue.fix,
          confidence: issue.confidence,
          errorType,
          severity: issue.severity,
          source: "rule-engine",
        });
      });
    }

    // AI ANALYSIS
    let aiFindings = [];

    // OPTIONAL:
    // Only call AI if rule confidence is low
    const shouldCallAI =
      findings.length === 0 ||
      findings.some((f) => f.confidence < 80);

    if (shouldCallAI) {
      const aiResult = await analyzeWithAI({
        code,
        language,
        errorType,
        problemType,
        constraints,
        heuristicFindings: findings,
        timeComplexity,
        spaceComplexity,
      });

      aiFindings = (aiResult.findings || []).map(
        (issue) => ({
          ...issue,
          source: "ai",
        })
      );
    }

    // MERGE RESULTS
    const mergedFindings = [
      ...findings,
      ...aiFindings,
    ];

    // REMOVE DUPLICATES
    const uniqueFindings = mergedFindings.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.reason === item.reason
        )
    );

    const summary = {
      hasErrors: uniqueFindings.length > 0,

      errorTypes: [
        ...new Set(
          uniqueFindings.map((f) => f.errorType)
        ),
      ],

      score: Math.max(
        0,
        100 - uniqueFindings.length * 15
      ),
    };

    const analysisDoc = await Analysis.create({
      userId: req.user.id,
      language,
      topic,
      summary,
      findings: uniqueFindings,
      timeComplexity,
      spaceComplexity,
    });

    await updateStats(req.user.id, analysisDoc);

    return res.status(201).json({
      summary,
      findings: uniqueFindings,
      timeComplexity,
      spaceComplexity,
    });

  } catch (err) {
    console.error("ANALYSIS ERROR:", err);

    return res.status(500).json({
      message: "Analysis failed",
    });
  }
};