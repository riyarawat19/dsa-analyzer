import { v4 as uuid } from "uuid";
import {
  hasUnsafeIndexing,
  usesRecursion,
} from "../utils/patternDetector.js";

export const reRules = [

  /* ================= ARRAY / STRING ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (errorType === "RE" && hasUnsafeIndexing(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_INDEX_OUT_OF_BOUNDS",
          confidence: "High",
          reason: "Accessing array or string with invalid index.",
          fix: "Ensure index stays within valid bounds.",
          suggestedTopics: ["Index Safety"],
          similarProblems: ["Rotate Array"],
        };
      }
      return null;
    },
  },

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (errorType === "RE" && /\/\s*0/.test(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_DIVISION_BY_ZERO",
          confidence: "High",
          reason: "Division by zero causes runtime crash.",
          fix: "Check denominator before division.",
          suggestedTopics: ["Math Safety"],
          similarProblems: ["Evaluate Expression"],
        };
      }
      return null;
    },
  },

  /* ================= RECURSION ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (errorType === "RE" && usesRecursion(code)) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_STACK_OVERFLOW",
          confidence: "High",
          reason: "Deep or infinite recursion caused stack overflow.",
          fix: "Convert recursion to iterative approach or add base case.",
          suggestedTopics: ["Recursion"],
          similarProblems: ["DFS Traversal"],
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
        usesRecursion(code) &&
        !/return/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_RECURSION_NO_RETURN",
          confidence: "High",
          reason: "Recursive function missing return statement.",
          fix: "Ensure recursion returns value properly.",
          suggestedTopics: ["Recursion Control"],
          similarProblems: ["Tree Traversal"],
        };
      }
      return null;
    },
  },

  /* ================= STACK ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /stack/.test(code) &&
        /pop\(\)/.test(code) &&
        !/empty\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_STACK_EMPTY_POP",
          confidence: "High",
          reason: "Stack pop without checking empty state.",
          fix: "Check stack.empty() before pop.",
          suggestedTopics: ["Stack Safety"],
          similarProblems: ["Min Stack"],
        };
      }
      return null;
    },
  },

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /pop\(\)\s*;\s*.*top\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_STACK_TOP_AFTER_POP",
          confidence: "High",
          reason: "Accessing stack top after popping last element.",
          fix: "Check stack empty after pop.",
          suggestedTopics: ["Stack Safety"],
          similarProblems: ["Min Stack"],
        };
      }
      return null;
    },
  },

  /* ================= QUEUE ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /queue/.test(code) &&
        /(front\(\)|pop\(\))/.test(code) &&
        !/empty\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_QUEUE_EMPTY_ACCESS",
          confidence: "High",
          reason: "Queue accessed while empty.",
          fix: "Check queue.empty() before access.",
          suggestedTopics: ["Queue Safety"],
          similarProblems: ["Implement Queue"],
        };
      }
      return null;
    },
  },

  /* ================= POINTERS ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /(NULL|nullptr)/.test(code) &&
        /\*/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_NULL_POINTER_DEREFERENCE",
          confidence: "High",
          reason: "Dereferencing a null pointer.",
          fix: "Ensure pointer is initialized before use.",
          suggestedTopics: ["Pointers"],
          similarProblems: ["Linked List Basics"],
        };
      }
      return null;
    },
  },

  /* ================= CONTAINERS ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /vector<.*>\s+\w+;/.test(code) &&
        /\[\s*0\s*\]/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "RE_EMPTY_CONTAINER_ACCESS",
          confidence: "High",
          reason: "Accessing element from empty container.",
          fix: "Check container size before access.",
          suggestedTopics: ["Defensive Programming"],
          similarProblems: ["Min Stack"],
        };
      }
      return null;
    },
  },

  /* ================= LANGUAGE-SPECIFIC ================= */

  {
    priority: 95,
    check: ({ code, errorType, language }) => {
      if (
        errorType === "RE" &&
        language === "python" &&
        usesRecursion(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "PYTHON_RECURSION_LIMIT",
          confidence: "High",
          reason: "Python recursion depth exceeded.",
          fix: "Convert recursion to iterative solution.",
          suggestedTopics: ["Python Recursion"],
          similarProblems: ["DFS Traversal"],
        };
      }
      return null;
    },
  },

];
