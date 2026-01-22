import {
  hasNestedLoop,
  usesRecursion,
  hasArrayAccess,
  hasUnsafeIndexing,
  usesIntForLargeNumbers,
} from "../utils/patternDetector.js";

import { parseConstraints } from "../utils/constraintParser.js";
import { v4 as uuid } from "uuid";

/**
 * Main Rule Engine
 */
function ruleEngine({ code, errorType, constraints }) {
  const parsedConstraints = parseConstraints(constraints);

  // RULE 1: TLE + Nested Loop + Large Constraints
  if (
    errorType === "TLE" &&
    hasNestedLoop(code) &&
    ["large", "very_large"].includes(parsedConstraints.size)
  ) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_NESTED_LOOP",
      confidence: "High",
      reason:
        "Nested loops cause O(n²) time complexity, which exceeds the given constraints.",
      fix:
        "Optimize using HashMap, Prefix Sum, Two Pointers, or Sliding Window.",
      currentComplexity: "O(n²)",
      expectedComplexity: "O(n) or O(n log n)",
      suggestedTopics: ["HashMap", "Prefix Sum", "Sliding Window"],
      similarProblems: [
        "Subarray Sum Equals K",
        "Two Sum",
        "Longest Zero Sum Subarray",
      ],
    };
  }

  // RULE 2: TLE + Recursion
  if (errorType === "TLE" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_RECURSION",
      confidence: "Medium",
      reason:
        "Recursive solution recomputes overlapping subproblems.",
      fix:
        "Use memoization or convert to bottom-up Dynamic Programming.",
      currentComplexity: "Exponential",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Dynamic Programming", "Memoization"],
      similarProblems: [
        "Climbing Stairs",
        "House Robber",
        "Fibonacci DP",
      ],
    };
  }

  // RULE 3: WA + Unsafe Indexing
  if (errorType === "WA" && hasUnsafeIndexing(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_INDEX_ERROR",
      confidence: "Medium",
      reason:
        "Incorrect index calculations may lead to wrong answers.",
      fix:
        "Validate boundary conditions and index arithmetic.",
      currentComplexity: "Correct but logically flawed",
      expectedComplexity: "Same",
      suggestedTopics: ["Edge Cases", "Index Handling"],
      similarProblems: [
        "First Missing Positive",
        "Find Peak Element",
      ],
    };
  }

  // RULE 4: RE + Unsafe Indexing
  if (errorType === "RE" && hasUnsafeIndexing(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_OUT_OF_BOUNDS",
      confidence: "High",
      reason:
        "Array index out of bounds caused runtime error.",
      fix:
        "Ensure indices stay within valid bounds.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Bounds Checking"],
      similarProblems: [
        "Rotate Array",
        "Merge Sorted Array",
      ],
    };
  }

  // RULE 5: Overflow
  if (errorType === "Overflow" && usesIntForLargeNumbers(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "OVERFLOW_INT_USAGE",
      confidence: "High",
      reason:
        "Integer overflow due to large arithmetic operations using int.",
      fix:
        "Use long / long long for large calculations.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Data Types", "Overflow Prevention"],
      similarProblems: [
        "Factorial Trailing Zeroes",
        "Reverse Integer",
      ],
    };
  }

  // FALLBACK
  return {
    analysisId: uuid(),
    matchedRule: "NO_RULE_MATCHED",
    confidence: "Low",
    reason:
      "No known failure pattern matched. The issue may involve logic, constraints, or edge cases.",
    fix:
      "Re-evaluate constraints and optimize time or space complexity.",
    currentComplexity: "Unknown",
    expectedComplexity: "Constraint dependent",
    suggestedTopics: ["Optimization", "Edge Cases"],
    similarProblems: [],
  };
}

export default ruleEngine;
