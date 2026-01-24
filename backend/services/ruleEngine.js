import { parseConstraints } from "../utils/constraintParser.js";

/* ===== IMPORT ALL RULE SETS ===== */

import { tleRules } from "../rules/tleRules.js";
import { waRules } from "../rules/waRules.js";
import { reRules } from "../rules/reRules.js";
import { dpRules } from "../rules/dpRules.js";
import { greedyRules } from "../rules/greedyRules.js";
import { stackRules } from "../rules/stackRules.js";
import { queueRules } from "../rules/queueRules.js";
import { treeRules } from "../rules/treeRules.js";
import { graphRules } from "../rules/graphRules.js";
import { arrayRules } from "../rules/arrayRules.js";
import { heapRules } from "../rules/heapRules.js";

import { estimateComplexity } from "../utils/complexityEstimator.js";
import { estimateSpaceComplexity } from "../utils/spaceComplexityEstimator.js";

/* ===== MERGE ALL RULES ===== */

const ALL_RULES = [
  ...tleRules,
  ...waRules,
  ...reRules,
  ...dpRules,
  ...greedyRules,
  ...stackRules,
  ...queueRules,
  ...treeRules,
  ...graphRules,
  ...arrayRules,
  ...heapRules,
];

/* ===== SORT BY PRIORITY (HIGH → LOW) ===== */

ALL_RULES.sort((a, b) => b.priority - a.priority);

/* ===== SEVERITY HELPER ===== */

function getSeverity(errorType) {
  if (errorType === "RE") return "Critical";
  if (errorType === "TLE") return "High";
  if (errorType === "WA") return "Medium";
  return "Low";
}

/* ===== MAIN RULE ENGINE ===== */

export default function ruleEngine({ code, errorType, constraints, language }) {
  const parsedConstraints = parseConstraints(constraints);

  const timeComplexity = estimateComplexity(code);
  const spaceComplexity = estimateSpaceComplexity(code);

  const matchedIssues = [];

  /* ===== COLLECT ALL MATCHING RULES ===== */

  for (const rule of ALL_RULES) {
    const result = rule.check({
      code,
      errorType,
      constraints: parsedConstraints,
      language,
    });

    if (result) {
      matchedIssues.push({
        priority: rule.priority,
        ...result,
      });
    }
  }

  /* ===== HANDLE MULTIPLE ISSUES ===== */

  if (matchedIssues.length > 0) {
    // Remove duplicate rules
    const uniqueMap = new Map();
    for (const issue of matchedIssues) {
      if (!uniqueMap.has(issue.matchedRule)) {
        uniqueMap.set(issue.matchedRule, issue);
      }
    }

    const uniqueIssues = Array.from(uniqueMap.values());
    uniqueIssues.sort((a, b) => b.priority - a.priority);

    const [primaryIssue, ...secondaryIssues] = uniqueIssues;

    return {
      errorType,

      primaryIssue: {
        ...primaryIssue,
        severity: getSeverity(errorType),
      },

      secondaryIssues: secondaryIssues.slice(0, 3).map(issue => ({
        matchedRule: issue.matchedRule,
        reason: issue.reason,
        fix: issue.fix,
        confidence: issue.confidence,
        severity: getSeverity(errorType),
      })),

      currentComplexity: timeComplexity,
      spaceComplexity: spaceComplexity,
    };
  }

  /* ===== FALLBACK ===== */

  return {
    errorType,
    matchedRule: "NO_RULE_MATCHED",
    confidence: "Low",
    severity: "Low",
    reason:
      "No known failure pattern detected. The issue may involve logic or unseen edge cases.",
    fix:
      "Re-evaluate constraints, optimize time/space complexity, and test edge cases.",
    currentComplexity: timeComplexity,
    spaceComplexity: spaceComplexity,
    expectedComplexity: "Constraint dependent",
    suggestedTopics: ["Debugging", "Edge Cases"],
    similarProblems: [],
  };
}
