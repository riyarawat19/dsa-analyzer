import { v4 as uuid } from "uuid";
import { usesRecursion } from "../utils/patternDetector.js";

export const dpRules = [

  /* ================= BASE CASE ERRORS ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /\bdp\[\s*i\s*\]/.test(code) &&
        !/dp\[\s*0\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_BASE_NOT_INITIALIZED",
          confidence: "High",
          reason: "DP base case dp[0] not initialized.",
          fix: "Initialize dp[0] before transitions.",
          suggestedTopics: ["DP Base Case"],
          similarProblems: ["Climbing Stairs"],
        };
      }
      return null;
    },
  },

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        usesRecursion(code) &&
        !/n\s*==\s*0|n\s*<=\s*1/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_MISSING_RECURSIVE_BASE",
          confidence: "High",
          reason: "Recursive DP missing base case.",
          fix: "Handle n == 0 and n == 1 explicitly.",
          suggestedTopics: ["DP Base Case"],
          similarProblems: ["Fibonacci"],
        };
      }
      return null;
    },
  },

  /* ================= STATE DEFINITION ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /\bdp\[\s*i\s*\]\[\s*j\s*\]/.test(code) &&
        !/dp\[\s*0\s*\]\[\s*\w+\s*\]|dp\[\s*\w+\s*\]\[\s*0\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_2D_BASE_MISSING",
          confidence: "High",
          reason: "2D DP missing first row or column initialization.",
          fix: "Initialize dp[0][j] and dp[i][0].",
          suggestedTopics: ["2D DP"],
          similarProblems: ["LCS", "Edit Distance"],
        };
      }
      return null;
    },
  },

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /\bdp\[\s*l\s*\]\[\s*r\s*\]/.test(code) &&
        !/l\s*==\s*r/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_INTERVAL_BASE_MISSING",
          confidence: "Medium",
          reason: "Interval DP missing base case for l == r.",
          fix: "Handle single-length interval explicitly.",
          suggestedTopics: ["Interval DP"],
          similarProblems: ["Matrix Chain Multiplication"],
        };
      }
      return null;
    },
  },

  /* ================= TRANSITION ERRORS ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /\bdp\[\s*i\s*\]\s*=/.test(code) &&
        !/\bdp\[\s*i\s*-\s*1\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_WRONG_TRANSITION",
          confidence: "High",
          reason: "DP transition does not use previous state.",
          fix: "Verify recurrence relation.",
          suggestedTopics: ["DP Transition"],
          similarProblems: ["House Robber"],
        };
      }
      return null;
    },
  },

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /\bmin\(|\bmax\(/.test(code) &&
        !/\bdp\[\s*i\s*-\s*1\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_GREEDY_LIKE_TRANSITION",
          confidence: "Medium",
          reason: "DP transition behaves like greedy.",
          fix: "Ensure all states are considered.",
          suggestedTopics: ["DP vs Greedy"],
          similarProblems: ["Burst Balloons"],
        };
      }
      return null;
    },
  },

  /* ================= COUNTING DP ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /coin|ways|count/.test(code) &&
        /\bdp\[\s*i\s*\]/.test(code) &&
        !/dp\[\s*0\s*\]\s*=\s*1/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_COUNT_BASE_MISSING",
          confidence: "High",
          reason: "Counting DP missing dp[0] = 1.",
          fix: "Initialize dp[0] = 1.",
          suggestedTopics: ["Counting DP"],
          similarProblems: ["Coin Change"],
        };
      }
      return null;
    },
  },

  /* ================= SUBSET / BOOLEAN DP ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /subset|partition|knapsack/i.test(code) &&
        /\bdp\[\s*i\s*\]/.test(code) &&
        !/dp\[\s*0\s*\]\s*=\s*true/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_BOOLEAN_BASE_MISSING",
          confidence: "High",
          reason: "Boolean DP missing dp[0] = true.",
          fix: "Initialize dp[0] = true.",
          suggestedTopics: ["Subset DP"],
          similarProblems: ["Partition Equal Subset Sum"],
        };
      }
      return null;
    },
  },

  /* ================= TREE DP ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /tree|node|left|right/.test(code) &&
        usesRecursion(code) &&
        !/if\s*\(\s*root\s*==\s*null\s*\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_TREE_BASE_MISSING",
          confidence: "High",
          reason: "Tree DP missing null node base case.",
          fix: "Add base case for null node.",
          suggestedTopics: ["Tree DP"],
          similarProblems: ["Binary Tree Maximum Path Sum"],
        };
      }
      return null;
    },
  },

  /* ================= GRAPH DP ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /graph|adj/.test(code) &&
        /\bdp\[\s*u\s*\]/.test(code) &&
        !/dp\[\s*start\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_GRAPH_BASE_MISSING",
          confidence: "Medium",
          reason: "Graph DP missing starting node initialization.",
          fix: "Initialize dp[start].",
          suggestedTopics: ["Graph DP"],
          similarProblems: ["Longest Path in DAG"],
        };
      }
      return null;
    },
  },

  /* ================= OPTIMIZATION ================= */

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "TLE" &&
        usesRecursion(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "DP_NO_MEMOIZATION",
          confidence: "Medium",
          reason: "DP recursion without memoization.",
          fix: "Use memoization or bottom-up DP.",
          suggestedTopics: ["Memoization"],
          similarProblems: ["Fibonacci"],
        };
      }
      return null;
    },
  },

];
