import { v4 as uuid } from "uuid";
import { usesRecursion } from "../utils/patternDetector.js";

export const treeRules = [

  /* ================= BASE CASE ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "RE" &&
        usesRecursion(code) &&
        /tree|node|left|right/.test(code) &&
        !/if\s*\(\s*root\s*==\s*null\s*\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_MISSING_NULL_BASE",
          confidence: "High",
          reason: "Recursive tree traversal missing base case for null node.",
          fix: "Add `if (root == null) return ...`",
          suggestedTopics: ["Tree Recursion"],
          similarProblems: ["Binary Tree Traversal"],
        };
      }
      return null;
    },
  },

  /* ================= ROOT NOT COUNTED ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /left|right/.test(code) &&
        !/root->val|node->val/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_ROOT_VALUE_IGNORED",
          confidence: "Medium",
          reason: "Root value not included in computation.",
          fix: "Include root->val or node->val in calculation.",
          suggestedTopics: ["Tree Aggregation"],
          similarProblems: ["Path Sum"],
        };
      }
      return null;
    },
  },

  /* ================= WRONG TRAVERSAL ================= */

  {
    priority: 95,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(preorder|postorder|inorder)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_WRONG_TRAVERSAL_ORDER",
          confidence: "Medium",
          reason: "Incorrect traversal order used.",
          fix: "Verify required traversal order.",
          suggestedTopics: ["Tree Traversals"],
          similarProblems: ["Validate BST"],
        };
      }
      return null;
    },
  },

  /* ================= BFS / DFS CONFUSION ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /queue/.test(code) &&
        /dfs|recursive/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_WRONG_TRAVERSAL_METHOD",
          confidence: "Medium",
          reason: "DFS/BFS confusion in tree traversal.",
          fix: "Choose BFS or DFS as per problem requirement.",
          suggestedTopics: ["DFS vs BFS"],
          similarProblems: ["Lowest Common Ancestor"],
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
          matchedRule: "TREE_LEVEL_ORDER_ERROR",
          confidence: "Medium",
          reason: "Levels not separated in level order traversal.",
          fix: "Use queue size to separate levels.",
          suggestedTopics: ["Level Order Traversal"],
          similarProblems: ["Binary Tree Level Order Traversal"],
        };
      }
      return null;
    },
  },

  /* ================= HEIGHT / DEPTH ================= */

  {
    priority: 90,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /(height|depth)/.test(code) &&
        !/\+\s*1/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_HEIGHT_DEPTH_ERROR",
          confidence: "Medium",
          reason: "Height/depth calculation missing +1 for current node.",
          fix: "Add +1 for current node.",
          suggestedTopics: ["Tree Height"],
          similarProblems: ["Diameter of Binary Tree"],
        };
      }
      return null;
    },
  },

  /* ================= LEAF HANDLING ================= */

  {
    priority: 85,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /leaf/.test(code) &&
        !/left\s*==\s*null\s*&&\s*right\s*==\s*null/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_LEAF_CONDITION_WRONG",
          confidence: "Low",
          reason: "Incorrect leaf node condition.",
          fix: "Check both left and right child are null.",
          suggestedTopics: ["Leaf Nodes"],
          similarProblems: ["Sum of Left Leaves"],
        };
      }
      return null;
    },
  },

  /* ================= MULTIPLE TEST CASE ================= */

  {
    priority: 80,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /while\s*\(t--\)/.test(code) &&
        /tree|node/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_NOT_RESET",
          confidence: "Low",
          reason: "Tree data not reset between test cases.",
          fix: "Rebuild tree for each test case.",
          suggestedTopics: ["Multiple Test Cases"],
          similarProblems: ["Binary Tree Construction"],
        };
      }
      return null;
    },
  },

  /* ================= NULL ROOT ================= */

  {
    priority: 100,
    check: ({ code, errorType }) => {
      if (
        errorType === "WA" &&
        /tree|node/.test(code) &&
        !/if\s*\(\s*root\s*==\s*null\s*\)/.test(code)
      ) {
        return {
          analysisId: uuid(),
          matchedRule: "TREE_NULL_ROOT_NOT_HANDLED",
          confidence: "High",
          reason: "Null root edge case not handled.",
          fix: "Add check for null root.",
          suggestedTopics: ["Edge Cases"],
          similarProblems: ["Same Tree"],
        };
      }
      return null;
    },
  },

];
