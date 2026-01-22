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
 * Main rule engine
 */
function analyzeCode({ code, errorType, constraints }) {
  const parsedConstraints = parseConstraints(constraints);

  // ---------------- RULE 1 ----------------
  // TLE + Nested Loop + Large Constraint
  if (
    errorType === "TLE" &&
    hasNestedLoop(code) &&
    parsedConstraints.size === "large"
  ) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_NESTED_LOOP",
      confidence: "High",
      reason:
        "Nested loops lead to O(n²) time complexity which exceeds the given constraints.",
      fix:
        "Use HashMap, Prefix Sum, or Sliding Window techniques to optimize.",
      currentComplexity: "O(n²)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["HashMap", "Prefix Sum"],
      similarProblems: [
        "Subarray Sum Equals K",
        "Two Sum",
        "Longest Zero Sum Subarray",
      ],
    };
  }

  // ---------------- RULE 2 ----------------
  // TLE + Recursion (No memoization)
  if (errorType === "TLE" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_RECURSION",
      confidence: "Medium",
      reason:
        "Recursive solution recalculates overlapping subproblems causing exponential time complexity.",
      fix:
        "Add memoization or convert the solution to bottom-up Dynamic Programming.",
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

  // ---------------- RULE 3 ----------------
  // WA + Unsafe Indexing
  if (errorType === "WA" && hasUnsafeIndexing(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_INDEX_ERROR",
      confidence: "Medium",
      reason:
        "Possible off-by-one or invalid array indexing causing incorrect output.",
      fix:
        "Check boundary conditions and ensure all array accesses are valid.",
      currentComplexity: "Correct but logically flawed",
      expectedComplexity: "Same",
      suggestedTopics: ["Edge Cases", "Array Indexing"],
      similarProblems: [
        "First Missing Positive",
        "Find Peak Element",
      ],
    };
  }

  // ---------------- RULE 4 ----------------
  // WA + Missing Edge Case
  if (errorType === "WA" && hasArrayAccess(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_EDGE_CASE",
      confidence: "Low",
      reason:
        "Edge cases such as empty input or single-element arrays may not be handled.",
      fix:
        "Explicitly handle edge cases before processing the main logic.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Edge Case Handling"],
      similarProblems: [
        "Maximum Subarray",
        "Best Time to Buy and Sell Stock",
      ],
    };
  }

  // ---------------- RULE 5 ----------------
  // RE + Unsafe Indexing
  if (errorType === "RE" && hasUnsafeIndexing(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_OUT_OF_BOUNDS",
      confidence: "High",
      reason:
        "Array index out of bounds causing runtime exception.",
      fix:
        "Ensure indices remain within valid bounds.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Bounds Checking"],
      similarProblems: [
        "Rotate Array",
        "Merge Sorted Array",
      ],
    };
  }

  // ---------------- RULE 6 ----------------
  // RE + Deep Recursion
  if (errorType === "RE" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_STACK_OVERFLOW",
      confidence: "Medium",
      reason:
        "Deep recursion may cause stack overflow at runtime.",
      fix:
        "Convert recursive logic to iterative or limit recursion depth.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Recursion Optimization"],
      similarProblems: [
        "Binary Tree Inorder Traversal",
        "DFS Iterative",
      ],
    };
  }

  // ---------------- RULE 7 ----------------
  // Overflow
  if (errorType === "Overflow" && usesIntForLargeNumbers(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "OVERFLOW_INT_USAGE",
      confidence: "High",
      reason:
        "Using int for large numerical calculations leads to overflow.",
      fix:
        "Use long long or appropriate data types for large values.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Data Types", "Overflow Handling"],
      similarProblems: [
        "Factorial Trailing Zeroes",
        "Reverse Integer",
      ],
    };
  }

  // ---------------- FALLBACK ----------------
  return {
    analysisId: uuid(),
    matchedRule: "NO_RULE_MATCHED",
    confidence: "Low",
    reason:
      "The code does not match any known failure pattern in the system.",
    fix:
      "Re-evaluate constraints, edge cases, and consider optimizing time or space complexity.",
    currentComplexity: "Unknown",
    expectedComplexity: "Constraint dependent",
    suggestedTopics: ["Optimization", "Edge Cases"],
    similarProblems: [],
  };
}

export default analyzeCode;
