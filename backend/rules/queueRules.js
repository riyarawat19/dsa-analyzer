import { v4 as uuid } from "uuid";

export const queueRules = [

  /* ================= EMPTY ACCESS ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /queue/.test(code) &&
        /(front\(\)|pop\(\))/.test(code) &&
        !/empty\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_EMPTY_ACCESS",
          confidence: "High",
          reason: "Queue accessed without checking if empty.",
          fix: "Check queue.empty() before front() or pop().",
          suggestedTopics: ["Queue Safety"],
          similarProblems: ["Implement Queue"],
        };
      }
      return null;
    },
  },

  /* ================= STACK vs QUEUE CONFUSION ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /queue/.test(code) &&
        /top\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_STACK_CONFUSION",
          confidence: "High",
          reason: "Queue is accessed using stack methods.",
          fix: "Use front()/back() instead of top().",
          suggestedTopics: ["Queue vs Stack"],
          similarProblems: ["Implement Stack using Queues"],
        };
      }
      return null;
    },
  },

  /* ================= BFS VISITED LOGIC ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "TLE" &&
        /(queue|bfs)/i.test(code) &&
        !/visited|vis/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_NO_VISITED",
          confidence: "High",
          reason: "BFS without visited array causes repeated traversal.",
          fix: "Use visited array to prevent revisits.",
          suggestedTopics: ["BFS"],
          similarProblems: ["Number of Islands"],
        };
      }
      return null;
    },
  },

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "TLE" &&
        /(queue|bfs)/i.test(code) &&
        /visited/.test(code) &&
        /pop\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_VISITED_MARK_LATE",
          confidence: "High",
          reason: "Nodes marked visited after pop, causing duplicates.",
          fix: "Mark visited when pushing to queue.",
          suggestedTopics: ["BFS Optimization"],
          similarProblems: ["Shortest Path in Grid"],
        };
      }
      return null;
    },
  },

  /* ================= LEVEL ORDER ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /queue/.test(code) &&
        /(level|depth)/i.test(code) &&
        !/size\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_LEVEL_ORDER_ERROR",
          confidence: "Medium",
          reason: "Level order traversal without separating levels.",
          fix: "Use queue size to process each level.",
          suggestedTopics: ["Level Order Traversal"],
          similarProblems: ["Binary Tree Level Order Traversal"],
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
        /queue/.test(code) &&
        !/clear\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_NOT_RESET",
          confidence: "Low",
          reason: "Queue not cleared between test cases.",
          fix: "Clear queue before each test case.",
          suggestedTopics: ["Multiple Test Cases"],
          similarProblems: ["Level Order Traversal"],
        };
      }
      return null;
    },
  },

  /* ================= BFS vs DFS ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /dfs/i.test(code) &&
        /(shortest|min path|distance)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_DFS_FOR_SHORTEST_PATH",
          confidence: "High",
          reason: "DFS does not guarantee shortest path.",
          fix: "Use BFS for shortest path in unweighted graphs.",
          suggestedTopics: ["BFS vs DFS"],
          similarProblems: ["Shortest Path in Binary Matrix"],
        };
      }
      return null;
    },
  },

  /* ================= QUEUE LOOP ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        /while/.test(code) &&
        /queue/.test(code) &&
        !/pop\(\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "QUEUE_INFINITE_LOOP",
          confidence: "High",
          reason: "Queue loop without popping elements.",
          fix: "Ensure queue.pop() is called inside loop.",
          suggestedTopics: ["Queue Loop Control"],
          similarProblems: ["BFS Traversal"],
        };
      }
      return null;
    },
  },

];
