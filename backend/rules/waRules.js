import { v4 as uuid } from "uuid";
import {
  hasUnsafeIndexing,
  hasArrayAccess,
  usesRecursion,
} from "../utils/patternDetector.js";

export const waRules = [

  /* ================= ARRAY ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && hasUnsafeIndexing(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "WA_INDEX_ERROR",
          confidence: "High",
          reason: "Array index out of bounds or off-by-one error.",
          fix: "Validate index boundaries carefully.",
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
          matchedRule: "WA_LOOP_BOUNDARY",
          confidence: "High",
          reason: "Loop iterates one extra time.",
          fix: "Use < n instead of <= n.",
          suggestedTopics: ["Loop Boundaries"],
          similarProblems: ["Binary Search"],
        };
      }
      return null;
    },
  },

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && hasArrayAccess(code) && !/n\s*==\s*0/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "WA_EMPTY_ARRAY",
          confidence: "Medium",
          reason: "Empty array edge case not handled.",
          fix: "Add explicit check for n == 0.",
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
      if (errorType === "WA" && /int\s+(max|min)\s*=\s*0/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "WA_WRONG_INITIALIZATION",
          confidence: "High",
          reason: "Incorrect initialization when negative values exist.",
          fix: "Initialize with first element or extreme value.",
          suggestedTopics: ["Initialization"],
          similarProblems: ["Kadane Algorithm"],
        };
      }
      return null;
    },
  },

  /* ================= STRING ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && /string/.test(code) && /==\s*\".\?\"/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "WA_CHAR_STRING_COMPARE",
          confidence: "High",
          reason: "Character compared with string literal.",
          fix: "Use single quotes for characters.",
          suggestedTopics: ["Strings"],
          similarProblems: ["Valid Anagram"],
        };
      }
      return null;
    },
  },

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /string/.test(code) &&
        !/tolower|toupper/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "WA_CASE_SENSITIVITY",
          confidence: "Low",
          reason: "Case sensitivity not handled properly.",
          fix: "Normalize string case.",
          suggestedTopics: ["String Normalization"],
          similarProblems: ["Valid Palindrome"],
        };
      }
      return null;
    },
  },

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && /substr|substring/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "WA_SUBSTRING_BOUNDARY",
          confidence: "Medium",
          reason: "Incorrect substring boundaries.",
          fix: "Verify substring indices.",
          suggestedTopics: ["Substring"],
          similarProblems: ["Longest Palindromic Substring"],
        };
      }
      return null;
    },
  },

  /* ================= DP ================= */

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
          reason: "DP base case not initialized.",
          fix: "Initialize dp[0] or dp[1].",
          suggestedTopics: ["Dynamic Programming"],
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
          matchedRule: "DP_MISSING_BASE_CASE",
          confidence: "High",
          reason: "Recursive DP missing base case.",
          fix: "Define proper base cases.",
          suggestedTopics: ["DP Base Case"],
          similarProblems: ["Fibonacci"],
        };
      }
      return null;
    },
  },

  /* ================= GREEDY ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /greedy|pick|max|min/.test(code) &&
        /(knapsack|subset|partition)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_WRONG_APPROACH",
          confidence: "High",
          reason: "Greedy used where DP is required.",
          fix: "Use DP solution.",
          suggestedTopics: ["Greedy vs DP"],
          similarProblems: ["0/1 Knapsack"],
        };
      }
      return null;
    },
  },

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && /sort/.test(code) && !/if.*==/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_MISSING_TIE_BREAKER",
          confidence: "Low",
          reason: "Tie-breaker missing in greedy sorting.",
          fix: "Add secondary comparison.",
          suggestedTopics: ["Sorting"],
          similarProblems: ["Meeting Rooms"],
        };
      }
      return null;
    },
  },

  /* ================= HASHING ================= */

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /map|unordered_map/.test(code) &&
        /\+\+|--/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HASH_WRONG_FREQUENCY",
          confidence: "Medium",
          reason: "Incorrect frequency update logic.",
          fix: "Verify increment/decrement logic.",
          suggestedTopics: ["Hashing"],
          similarProblems: ["Valid Anagram"],
        };
      }
      return null;
    },
  },

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /unordered_map/.test(code) &&
        /(sorted|increasing)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HASH_WRONG_MAP_TYPE",
          confidence: "Low",
          reason: "unordered_map used where order matters.",
          fix: "Use map or sort keys.",
          suggestedTopics: ["Map vs Unordered Map"],
          similarProblems: ["Sort Characters by Frequency"],
        };
      }
      return null;
    },
  },

  /* ================= STACK ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (errorType === "WA" && /stack/.test(code) && /(>=|<=)/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_WRONG_POP_CONDITION",
          confidence: "Medium",
          reason: "Incorrect pop condition in monotonic stack.",
          fix: "Recheck comparison logic.",
          suggestedTopics: ["Monotonic Stack"],
          similarProblems: ["Next Greater Element"],
        };
      }
      return null;
    },
  },

  {
    priority: 75,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /while\s*\(t--\)/.test(code) &&
        /stack/.test(code) &&
        !/clear/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_NOT_RESET",
          confidence: "Low",
          reason: "Stack not cleared between test cases.",
          fix: "Clear stack per test case.",
          suggestedTopics: ["Multiple Test Cases"],
          similarProblems: ["Largest Rectangle Histogram"],
        };
      }
      return null;
    },
  },
];
