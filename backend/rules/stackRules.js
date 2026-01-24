import { v4 as uuid } from "uuid";
import { usesRecursion } from "../utils/patternDetector.js";

export const stackRules = [

  /* ================= EMPTY ACCESS ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /stack/.test(code) &&
        /(pop\(\)|top\(\))/.test(code) &&
        !/empty\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_EMPTY_ACCESS",
          confidence: "High",
          reason: "Stack accessed without checking empty state.",
          fix: "Check stack.empty() before pop() or top().",
          suggestedTopics: ["Stack Safety"],
          similarProblems: ["Min Stack"],
        };
      }
      return null;
    },
  },

  /* ================= POP AFTER POP ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /pop\(\)\s*;.*top\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_TOP_AFTER_POP",
          confidence: "High",
          reason: "Accessing top after popping last element.",
          fix: "Check empty state after pop().",
          suggestedTopics: ["Stack Safety"],
          similarProblems: ["Min Stack"],
        };
      }
      return null;
    },
  },

  /* ================= UNBALANCED OPS ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /stack/.test(code) &&
        /pop\(\)/.test(code) &&
        !/push\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_UNBALANCED_OPERATIONS",
          confidence: "Medium",
          reason: "Stack pop operations not balanced with push.",
          fix: "Ensure every pop has a corresponding push.",
          suggestedTopics: ["Stack Operations"],
          similarProblems: ["Remove K Digits"],
        };
      }
      return null;
    },
  },

  /* ================= MONOTONIC STACK ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /stack/.test(code) &&
        /(>=|<=)/.test(code) &&
        /while/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_WRONG_POP_CONDITION",
          confidence: "High",
          reason: "Incorrect comparison in monotonic stack pop condition.",
          fix: "Re-evaluate >= / <= condition based on problem.",
          suggestedTopics: ["Monotonic Stack"],
          similarProblems: ["Next Greater Element"],
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
        /stack/.test(code) &&
        /monotonic|next greater|prev greater/i.test(code) &&
        !/while/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_MONOTONIC_LOOP_MISSING",
          confidence: "Medium",
          reason: "Monotonic stack requires while-loop popping.",
          fix: "Use while-loop to pop invalid elements.",
          suggestedTopics: ["Monotonic Stack"],
          similarProblems: ["Daily Temperatures"],
        };
      }
      return null;
    },
  },

  /* ================= MULTIPLE TEST CASES ================= */

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /while\s*\(t--\)/.test(code) &&
        /stack/.test(code) &&
        !/clear\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_NOT_RESET",
          confidence: "Low",
          reason: "Stack not cleared between test cases.",
          fix: "Clear or reinitialize stack for each test case.",
          suggestedTopics: ["Multiple Test Cases"],
          similarProblems: ["Largest Rectangle Histogram"],
        };
      }
      return null;
    },
  },

  /* ================= INITIALIZATION ================= */

  {
    priority: 75,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /stack/.test(code) &&
        !/push\(/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_NOT_INITIALIZED",
          confidence: "Low",
          reason: "Stack used without pushing initial elements.",
          fix: "Push initial values before stack operations.",
          suggestedTopics: ["Initialization"],
          similarProblems: ["Daily Temperatures"],
        };
      }
      return null;
    },
  },

  /* ================= RECURSION + STACK ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        usesRecursion(code) &&
        !/return/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_RECURSION_NO_BASE",
          confidence: "High",
          reason: "Recursive stack logic lacks terminating return.",
          fix: "Add proper base case and return.",
          suggestedTopics: ["Recursion"],
          similarProblems: ["Reverse Stack"],
        };
      }
      return null;
    },
  },

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        usesRecursion(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "STACK_OVERFLOW",
          confidence: "High",
          reason: "Deep recursion causes stack overflow.",
          fix: "Convert recursion to iterative approach.",
          suggestedTopics: ["Recursion"],
          similarProblems: ["DFS Traversal"],
        };
      }
      return null;
    },
  },

];
