import { v4 as uuid } from "uuid";

export const greedyRules = [

  /* ================= WRONG APPROACH ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(knapsack|subset|partition|coin|decode)/i.test(code) &&
        !/dp|memo|tabulation/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_INSTEAD_OF_DP",
          confidence: "High",
          reason: "Greedy approach used where DP is required.",
          fix: "Reformulate using Dynamic Programming.",
          suggestedTopics: ["Greedy vs DP"],
          similarProblems: ["0/1 Knapsack", "Decode Ways"],
        };
      }
      return null;
    },
  },

  /* ================= LOCAL OPTIMUM TRAP ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(max|min)\s*\(/.test(code) &&
        !/backtrack|dp/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_LOCAL_OPTIMUM_TRAP",
          confidence: "High",
          reason: "Local greedy choice does not lead to global optimum.",
          fix: "Use DP or prove greedy correctness.",
          suggestedTopics: ["Greedy Proof"],
          similarProblems: ["Burst Balloons"],
        };
      }
      return null;
    },
  },

  /* ================= SORTING GREEDY ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /sort/.test(code) &&
        !/if.*==/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_MISSING_TIE_BREAKER",
          confidence: "Medium",
          reason: "Sorting greedy logic missing tie-breaker.",
          fix: "Add secondary sort condition.",
          suggestedTopics: ["Sorting"],
          similarProblems: ["Meeting Rooms"],
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
        /sort/.test(code) &&
        !/n\s*==\s*0|n\s*==\s*1/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_EDGE_CASE_MISSING",
          confidence: "Low",
          reason: "Greedy fails for small edge cases.",
          fix: "Handle n == 0 and n == 1 explicitly.",
          suggestedTopics: ["Edge Cases"],
          similarProblems: ["Jump Game"],
        };
      }
      return null;
    },
  },

  /* ================= COMPARATOR ERRORS ================= */

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(>=|<=)/.test(code) &&
        /sort|priority_queue/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_WRONG_COMPARATOR",
          confidence: "Medium",
          reason: "Incorrect comparator used in greedy selection.",
          fix: "Re-evaluate comparator logic.",
          suggestedTopics: ["Comparators"],
          similarProblems: ["Merge Intervals"],
        };
      }
      return null;
    },
  },

  /* ================= NON-MONOTONIC ================= */

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /greedy/.test(code) &&
        /backtrack|revert/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_NON_MONOTONIC",
          confidence: "Medium",
          reason: "Greedy applied to non-monotonic problem.",
          fix: "Use DP or backtracking.",
          suggestedTopics: ["Greedy vs Backtracking"],
          similarProblems: ["Word Break"],
        };
      }
      return null;
    },
  },

  /* ================= OVERFLOW ================= */

  {
    priority: 75,
    check: ({ code, errorType }) => {
      if (
        errorType === "Overflow" &&
        /(sum|profit)\s*\+=/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_OVERFLOW",
          confidence: "Medium",
          reason: "Greedy accumulation may overflow integer.",
          fix: "Use long long or modulo.",
          suggestedTopics: ["Overflow Prevention"],
          similarProblems: ["Maximum Profit"],
        };
      }
      return null;
    },
  },

  /* ================= INFINITE LOOP ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /while/.test(code) &&
        !/i\+\+|i--|j\+\+|j--/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GREEDY_INFINITE_LOOP",
          confidence: "High",
          reason: "Greedy loop does not converge.",
          fix: "Ensure loop variables move toward termination.",
          suggestedTopics: ["Loop Control"],
          similarProblems: ["Gas Station"],
        };
      }
      return null;
    },
  },

];
