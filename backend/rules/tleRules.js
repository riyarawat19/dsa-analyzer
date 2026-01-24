import { v4 as uuid } from "uuid";
import { hasNestedLoop, usesRecursion } from "../utils/patternDetector.js";

export const tleRules = [

  {
    priority: 100,
    check: ({ code, errorType, constraints }) => {
      if (
        errorType === "TLE" &&
        hasNestedLoop(code) &&
        ["large", "very_large"].includes(constraints?.size)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TLE_NESTED_LOOP",
          confidence: "High",
          reason: "Nested loops exceed time limit.",
          fix: "Use hashing, prefix sum, two pointers.",
        };
      }
      return null;
    },
  },

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (errorType === "TLE" && usesRecursion(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "TLE_RECURSION",
          confidence: "Medium",
          reason: "Recursive calls recompute subproblems.",
          fix: "Use memoization or iterative DP.",
        };
      }
      return null;
    },
  },

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (errorType === "TLE" && hasNestedLoop(code) && /sort/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "TLE_SORT_IN_LOOP",
          confidence: "High",
          reason: "Sorting inside loop causes heavy overhead.",
          fix: "Move sorting outside the loop.",
        };
      }
      return null;
    },
  },

  {
    priority: 85,
    check: ({ code, errorType, language }) => {
      if (errorType === "TLE" && language === "java" && code.includes("Scanner")) {
        return {
          analysisId: uuid(),
          matchedRule: "JAVA_SLOW_IO",
          confidence: "Medium",
          reason: "Scanner is slow for large input.",
          fix: "Use BufferedReader.",
        };
      }
      return null;
    },
  },

  {
    priority: 80,
    check: ({ code, errorType, language }) => {
      if (
        errorType === "TLE" &&
        language === "cpp" &&
        code.includes("cin") &&
        !code.includes("sync_with_stdio")
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "CPP_SLOW_IO",
          confidence: "Medium",
          reason: "cin without fast IO causes TLE.",
          fix: "Enable fast IO.",
        };
      }
      return null;
    },
  },
];
