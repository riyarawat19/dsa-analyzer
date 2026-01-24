import { v4 as uuid } from "uuid";

export const heapRules = [

  /* ================= HEAP TYPE ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(priority_queue)/.test(code) &&
        /(min|max|smallest|largest)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_WRONG_TYPE",
          confidence: "High",
          reason: "Incorrect heap type used (min-heap vs max-heap).",
          fix: "Use correct heap type as per problem requirement.",
          suggestedTopics: ["Min Heap vs Max Heap"],
          similarProblems: ["Merge K Sorted Lists"],
        };
      }
      return null;
    },
  },

  /* ================= COMPARATOR ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(priority_queue)/.test(code) &&
        /compare|cmp|lambda/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_WRONG_COMPARATOR",
          confidence: "Medium",
          reason: "Incorrect comparator logic in heap.",
          fix: "Verify comparator ordering logic.",
          suggestedTopics: ["Custom Comparator"],
          similarProblems: ["K Closest Points"],
        };
      }
      return null;
    },
  },

  /* ================= POP ORDER ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(priority_queue|heap)/.test(code) &&
        /pop/.test(code) &&
        /(min|max)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_POP_ORDER_CONFUSION",
          confidence: "Medium",
          reason: "Incorrect assumption about heap pop order.",
          fix: "Remember heap guarantees only top element.",
          suggestedTopics: ["Heap Properties"],
          similarProblems: ["Last Stone Weight"],
        };
      }
      return null;
    },
  },

  /* ================= RESET ================= */

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /while\s*\(t--\)/.test(code) &&
        /(priority_queue|heap)/.test(code) &&
        !/clear/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_NOT_RESET",
          confidence: "Low",
          reason: "Heap not cleared between test cases.",
          fix: "Reinitialize heap per test case.",
          suggestedTopics: ["Multiple Test Cases"],
          similarProblems: ["Kth Largest Element"],
        };
      }
      return null;
    },
  },

  /* ================= WRONG PUSH ================= */

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(priority_queue|heap)/.test(code) &&
        /push\(\s*i\s*\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_WRONG_PUSH_VALUE",
          confidence: "Medium",
          reason: "Incorrect value pushed into heap.",
          fix: "Verify correct value is pushed.",
          suggestedTopics: ["Heap Logic"],
          similarProblems: ["Find K Closest Elements"],
        };
      }
      return null;
    },
  },

  /* ================= SLIDING WINDOW ================= */

  {
    priority: 75,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(priority_queue|heap)/.test(code) &&
        /(sliding window)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_INSTEAD_OF_DEQUE",
          confidence: "Low",
          reason: "Heap is inefficient for sliding window problems.",
          fix: "Use deque for optimal sliding window solution.",
          suggestedTopics: ["Sliding Window"],
          similarProblems: ["Sliding Window Maximum"],
        };
      }
      return null;
    },
  },

  /* ================= EMPTY ACCESS ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /(priority_queue|heap)/.test(code) &&
        /(top\(\)|pop\(\))/.test(code) &&
        !/empty\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "HEAP_EMPTY_ACCESS",
          confidence: "High",
          reason: "Heap accessed while empty.",
          fix: "Check empty() before pop() or top().",
          suggestedTopics: ["Heap Safety"],
          similarProblems: ["Min Stack"],
        };
      }
      return null;
    },
  },

];
