import { v4 as uuid } from "uuid";
import { hasArrayAccess, hasUnsafeIndexing } from "../utils/patternDetector.js";

export const arrayRules = [

  /* ================= INDEX & BOUNDS ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (errorType === "RE" && hasArrayAccess(code) && hasUnsafeIndexing(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_INDEX_OUT_OF_BOUNDS",
          confidence: "High",
          reason: "Array accessed using invalid index.",
          fix: "Ensure index stays within bounds.",
          suggestedTopics: ["Array Indexing"],
          similarProblems: ["Rotate Array"],
        };
      }
      return null;
    },
  },

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && /<=\s*n/.test(code) && hasArrayAccess(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_OFF_BY_ONE",
          confidence: "High",
          reason: "Loop runs one extra iteration.",
          fix: "Use < n instead of <= n.",
          suggestedTopics: ["Loop Boundaries"],
          similarProblems: ["Binary Search"],
        };
      }
      return null;
    },
  },

  /* ================= EDGE CASES ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && hasArrayAccess(code) && !/n\s*==\s*0/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_EMPTY_NOT_HANDLED",
          confidence: "Medium",
          reason: "Empty array edge case not handled.",
          fix: "Check n == 0 before processing.",
          suggestedTopics: ["Edge Cases"],
          similarProblems: ["Maximum Subarray"],
        };
      }
      return null;
    },
  },

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && hasArrayAccess(code) && !/n\s*==\s*1/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_SINGLE_ELEMENT_MISSED",
          confidence: "Low",
          reason: "Single element array case not handled.",
          fix: "Handle n == 1 explicitly.",
          suggestedTopics: ["Edge Cases"],
          similarProblems: ["Best Time to Buy and Sell Stock"],
        };
      }
      return null;
    },
  },

  /* ================= INITIALIZATION ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && /int\s+(max|min)\s*=\s*0/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_WRONG_INITIALIZATION",
          confidence: "High",
          reason: "Wrong initialization when array has negatives.",
          fix: "Initialize with first element or INT_MIN/INT_MAX.",
          suggestedTopics: ["Initialization"],
          similarProblems: ["Kadane Algorithm"],
        };
      }
      return null;
    },
  },

  /* ================= PREFIX / ACCUMULATION ================= */

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(prefix|sum)/.test(code) &&
        /while\s*\(t--\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_PREFIX_NOT_RESET",
          confidence: "Low",
          reason: "Prefix sum not reset between test cases.",
          fix: "Reinitialize prefix sum per test case.",
          suggestedTopics: ["Prefix Sum"],
          similarProblems: ["Subarray Sum Equals K"],
        };
      }
      return null;
    },
  },

  /* ================= IN-PLACE MODIFICATION ================= */

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        hasArrayAccess(code) &&
        /=\s*\w+/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_VALUE_OVERWRITE",
          confidence: "Low",
          reason: "Array values overwritten unintentionally.",
          fix: "Preserve original values if needed.",
          suggestedTopics: ["In-place Algorithms"],
          similarProblems: ["Set Matrix Zeroes"],
        };
      }
      return null;
    },
  },

  /* ================= MEMORY ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "MLE" &&
        hasArrayAccess(code) &&
        /\[\s*1000000\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "ARRAY_MEMORY_OVERUSE",
          confidence: "High",
          reason: "Array size too large for memory limit.",
          fix: "Use dynamic allocation or optimize space.",
          suggestedTopics: ["Space Optimization"],
          similarProblems: ["DP Problems"],
        };
      }
      return null;
    },
  },

];
