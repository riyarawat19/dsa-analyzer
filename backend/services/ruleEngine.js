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

/* ===== MAIN RULE ENGINE ===== */

export default function ruleEngine({ code, errorType, constraints, language }) {
  const parsedConstraints = parseConstraints(constraints);

  for (const rule of ALL_RULES) {
    const result = rule.check({
      code,
      errorType,
      constraints: parsedConstraints,
      language,
    });

    if (result) {
      return {
        ...result,
        errorType,
      };
    }
  }

  /* ===== FALLBACK ===== */

  return {
    analysisId: "NO_MATCH",
    matchedRule: "NO_RULE_MATCHED",
    confidence: "Low",
    reason:
      "No known failure pattern detected. The issue may involve logic or unseen edge cases.",
    fix:
      "Re-evaluate constraints, optimize time/space complexity, and test edge cases.",
    currentComplexity: "Unknown",
    expectedComplexity: "Constraint dependent",
    suggestedTopics: ["Debugging", "Edge Cases"],
    similarProblems: [],
  };
}
