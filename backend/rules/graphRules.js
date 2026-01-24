import { v4 as uuid } from "uuid";

export const graphRules = [

  /* ================= VISITED MISSING ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "TLE" &&
        /(graph|adj)/i.test(code) &&
        /(dfs|bfs)/i.test(code) &&
        !/visited|vis/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_NO_VISITED",
          confidence: "High",
          reason: "Graph traversal without visited array causes infinite revisits.",
          fix: "Maintain a visited array and mark nodes.",
          suggestedTopics: ["DFS", "BFS"],
          similarProblems: ["Number of Islands"],
        };
      }
      return null;
    },
  },

  /* ================= VISITED MARK LATE ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "TLE" &&
        /(queue|stack)/.test(code) &&
        /visited/.test(code) &&
        /pop/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_VISITED_MARK_LATE",
          confidence: "High",
          reason: "Visited marked after pop allows duplicates.",
          fix: "Mark visited when pushing into queue/stack.",
          suggestedTopics: ["BFS Optimization"],
          similarProblems: ["Shortest Path in Grid"],
        };
      }
      return null;
    },
  },

  /* ================= SHORTEST PATH ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /dfs/i.test(code) &&
        /(shortest|min path|distance)/i.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_DFS_FOR_SHORTEST_PATH",
          confidence: "High",
          reason: "DFS does not guarantee shortest path.",
          fix: "Use BFS for unweighted graphs.",
          suggestedTopics: ["BFS"],
          similarProblems: ["Shortest Path in Binary Matrix"],
        };
      }
      return null;
    },
  },

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /dijkstra/i.test(code) &&
        !/priority_queue/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_DIJKSTRA_NO_PQ",
          confidence: "High",
          reason: "Dijkstra without priority queue is incorrect.",
          fix: "Use min-heap (priority queue).",
          suggestedTopics: ["Dijkstra"],
          similarProblems: ["Network Delay Time"],
        };
      }
      return null;
    },
  },

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /dijkstra/i.test(code) &&
        /-/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_NEGATIVE_WEIGHT_DIJKSTRA",
          confidence: "High",
          reason: "Dijkstra does not work with negative weights.",
          fix: "Use Bellman-Ford algorithm.",
          suggestedTopics: ["Bellman-Ford"],
          similarProblems: ["Cheapest Flights Within K Stops"],
        };
      }
      return null;
    },
  },

  /* ================= CYCLE DETECTION ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /undirected/i.test(code) &&
        /dfs/i.test(code) &&
        !/parent/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_CYCLE_PARENT_MISSING",
          confidence: "Medium",
          reason: "Undirected cycle detection missing parent tracking.",
          fix: "Track parent in DFS.",
          suggestedTopics: ["Cycle Detection"],
          similarProblems: ["Detect Cycle in Undirected Graph"],
        };
      }
      return null;
    },
  },

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /directed/i.test(code) &&
        /dfs/i.test(code) &&
        !/recStack|pathVis/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_DIRECTED_CYCLE_WRONG",
          confidence: "High",
          reason: "Directed cycle detection needs recursion stack.",
          fix: "Maintain recursion stack or path visited.",
          suggestedTopics: ["Directed Graphs"],
          similarProblems: ["Course Schedule"],
        };
      }
      return null;
    },
  },

  /* ================= DAG ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /dag/i.test(code) &&
        !/topo|topological/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_DAG_NO_TOPO",
          confidence: "Medium",
          reason: "DAG problems require topological ordering.",
          fix: "Use topological sort.",
          suggestedTopics: ["Topological Sort"],
          similarProblems: ["Longest Path in DAG"],
        };
      }
      return null;
    },
  },

  /* ================= DP ON GRAPH ================= */

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
          matchedRule: "GRAPH_DP_BASE_MISSING",
          confidence: "Medium",
          reason: "Graph DP missing start node initialization.",
          fix: "Initialize dp[start].",
          suggestedTopics: ["Graph DP"],
          similarProblems: ["Longest Path in DAG"],
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
        /adj/.test(code) &&
        !/clear/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "GRAPH_ADJ_NOT_RESET",
          confidence: "Low",
          reason: "Adjacency list not reset between test cases.",
          fix: "Clear adjacency list before each test case.",
          suggestedTopics: ["Multiple Test Cases"],
          similarProblems: ["Graph Construction"],
        };
      }
      return null;
    },
  },

];
