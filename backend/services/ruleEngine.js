import {
  hasNestedLoop,
  usesRecursion,
  hasArrayAccess,
  hasUnsafeIndexing,
  usesIntForLargeNumbers,
} from "../utils/patternDetector.js";

import { parseConstraints } from "../utils/constraintParser.js";
import { v4 as uuid } from "uuid";

/**
 * Main Rule Engine
 */
function ruleEngine({ code, errorType, constraints }) {
  const parsedConstraints = parseConstraints(constraints);

  /* ===================== TLE RULES ===================== */

  // RULE 1: TLE + Nested Loop + Large Constraints
  if (
    errorType === "TLE" &&
    hasNestedLoop(code) &&
    ["large", "very_large"].includes(parsedConstraints.size)
  ) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_NESTED_LOOP",
      confidence: "High",
      reason:
        "Nested loops cause O(n²) time complexity, which exceeds the given constraints.",
      fix:
        "Optimize using HashMap, Prefix Sum, Two Pointers, or Sliding Window.",
      currentComplexity: "O(n²)",
      expectedComplexity: "O(n) or O(n log n)",
      suggestedTopics: ["HashMap", "Prefix Sum", "Sliding Window"],
      similarProblems: [
        "Subarray Sum Equals K",
        "Two Sum",
        "Longest Zero Sum Subarray",
      ],
    };
  }

  // RULE 2: TLE + Recursion
  if (errorType === "TLE" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_RECURSION",
      confidence: "Medium",
      reason: "Recursive solution recomputes overlapping subproblems.",
      fix: "Use memoization or bottom-up Dynamic Programming.",
      currentComplexity: "Exponential",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Dynamic Programming", "Memoization"],
      similarProblems: [
        "Climbing Stairs",
        "House Robber",
        "Fibonacci DP",
      ],
    };
  }

  // RULE 3: TLE + Sorting inside Loop
  if (errorType === "TLE" && hasNestedLoop(code) && code.includes("sort")) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_SORT_IN_LOOP",
      confidence: "High",
      reason: "Sorting inside a loop increases time complexity significantly.",
      fix: "Move sorting outside the loop or use an optimized data structure.",
      currentComplexity: "O(n² log n)",
      expectedComplexity: "O(n log n)",
      suggestedTopics: ["Sorting", "Optimization"],
      similarProblems: ["Merge Intervals", "K Closest Points"],
    };
  }

  // RULE 4: TLE + Slow IO
  if (errorType === "TLE" && code.includes("cin") && !code.includes("sync_with_stdio")) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_SLOW_IO",
      confidence: "Medium",
      reason: "Slow input/output operations detected.",
      fix: "Use fast I/O techniques.",
      currentComplexity: "O(n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Fast I/O"],
      similarProblems: ["Fast Input Output"],
    };
  }

  /* ===================== WA RULES ===================== */

  // RULE 5: WA + Unsafe Indexing
  if (errorType === "WA" && hasUnsafeIndexing(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_INDEX_ERROR",
      confidence: "Medium",
      reason: "Incorrect index calculations may lead to wrong answers.",
      fix: "Validate boundary conditions and index arithmetic.",
      currentComplexity: "Correct but logically flawed",
      expectedComplexity: "Same",
      suggestedTopics: ["Edge Cases", "Index Handling"],
      similarProblems: [
        "First Missing Positive",
        "Find Peak Element",
      ],
    };
  }

  // RULE 6: WA + Missing Braces
  if (errorType === "WA" && /if\s*\(.*\)\s*[^\s{]/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_MISSING_BRACES",
      confidence: "Medium",
      reason: "Missing braces may alter control flow unexpectedly.",
      fix: "Always use curly braces for conditionals.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Control Flow"],
      similarProblems: ["Valid Parentheses"],
    };
  }

  // RULE 7: WA + Integer Division
  if (errorType === "WA" && /\/\s*\w+/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_INTEGER_DIVISION",
      confidence: "Low",
      reason: "Integer division may truncate expected values.",
      fix: "Use floating-point division or cast operands.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Data Types"],
      similarProblems: ["Average Salary"],
    };
  }

  // RULE 8: WA + Missing Edge Case
  if (errorType === "WA" && !code.includes("if") && hasArrayAccess(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_EDGE_CASE_MISSING",
      confidence: "Low",
      reason: "Edge cases like empty or single-element input may not be handled.",
      fix: "Add explicit checks for edge cases.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Edge Case Handling"],
      similarProblems: ["Maximum Subarray"],
    };
  }

  /* ===================== RE RULES ===================== */

  // RULE 9: RE + Unsafe Indexing
  if (errorType === "RE" && hasUnsafeIndexing(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_OUT_OF_BOUNDS",
      confidence: "High",
      reason: "Array index out of bounds caused runtime error.",
      fix: "Ensure indices stay within valid bounds.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Bounds Checking"],
      similarProblems: ["Rotate Array"],
    };
  }

  // RULE 10: RE + Stack Overflow
  if (errorType === "RE" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_STACK_OVERFLOW",
      confidence: "High",
      reason: "Deep or infinite recursion caused stack overflow.",
      fix: "Convert recursion to iterative or limit recursion depth.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Recursion"],
      similarProblems: ["Flood Fill"],
    };
  }

  // RULE 11: RE + Division by Zero
  if (errorType === "RE" && /\/\s*0/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_DIVISION_BY_ZERO",
      confidence: "High",
      reason: "Division by zero detected.",
      fix: "Add denominator check before division.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Math Safety"],
      similarProblems: ["Evaluate Expression"],
    };
  }

  /* ===================== OVERFLOW / MEMORY ===================== */

  // RULE 12: Overflow
  if (errorType === "Overflow" && usesIntForLargeNumbers(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "OVERFLOW_INT_USAGE",
      confidence: "High",
      reason: "Integer overflow due to large arithmetic operations.",
      fix: "Use long / long long.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Overflow Prevention"],
      similarProblems: ["Reverse Integer"],
    };
  }

  // RULE 13: MLE + Large 2D Array
  if (errorType === "MLE" && /\[\s*n\s*\]\s*\[\s*n\s*\]/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "MLE_LARGE_2D_ARRAY",
      confidence: "High",
      reason: "Large 2D array consumes excessive memory.",
      fix: "Optimize space or use rolling arrays.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Space Optimization"],
      similarProblems: ["DP Grid Problems"],
    };
  }

  /* ===================== FALLBACK ===================== */

  return {
    analysisId: uuid(),
    matchedRule: "NO_RULE_MATCHED",
    confidence: "Low",
    reason:
      "No known failure pattern matched. The issue may involve logic, constraints, or edge cases.",
    fix: "Re-evaluate constraints and optimize time or space complexity.",
    currentComplexity: "Unknown",
    expectedComplexity: "Constraint dependent",
    suggestedTopics: ["Optimization", "Edge Cases"],
    similarProblems: [],
  };
}
  /* ===================== MORE TLE RULES ===================== */

  // RULE 14: TLE + Map inside loop
  if (errorType === "TLE" && hasNestedLoop(code) && /map|unordered_map/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_MAP_IN_LOOP",
      confidence: "High",
      reason: "Map operations inside loops add logarithmic overhead.",
      fix: "Use arrays or reduce nested operations.",
      currentComplexity: "O(n² log n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Hashing", "Optimization"],
      similarProblems: ["Frequency Count", "Group Anagrams"],
    };
  }

  // RULE 15: TLE + Prefix sum recomputed repeatedly
  if (errorType === "TLE" && hasNestedLoop(code) && /sum\s*\+=/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_REPEATED_SUM",
      confidence: "Medium",
      reason: "Repeated summation inside loops causes redundant computation.",
      fix: "Precompute prefix sums.",
      currentComplexity: "O(n²)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Prefix Sum"],
      similarProblems: ["Range Sum Query"],
    };
  }

  /* ===================== MORE WA RULES ===================== */

  // RULE 16: WA + Floating point comparison
  if (errorType === "WA" && /(float|double)/.test(code) && /==/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_FLOAT_COMPARISON",
      confidence: "Medium",
      reason: "Direct comparison of floating point values is unreliable.",
      fix: "Use epsilon-based comparison.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Floating Point Precision"],
      similarProblems: ["Sqrt(x)", "Pow(x, n)"],
    };
  }

  // RULE 17: WA + Comma operator misuse
  if (errorType === "WA" && /if\s*\(.*,.+\)/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_COMMA_OPERATOR",
      confidence: "Medium",
      reason: "Comma operator evaluates only the last expression.",
      fix: "Use logical operators like && or ||.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Operators"],
      similarProblems: ["Valid Conditions"],
    };
  }

  // RULE 18: WA + Wrong loop boundary
  if (errorType === "WA" && /<=\s*n/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_LOOP_BOUNDARY",
      confidence: "Medium",
      reason: "Loop may execute one extra iteration.",
      fix: "Use strict < condition.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Loop Boundaries"],
      similarProblems: ["Array Traversal"],
    };
  }

  /* ===================== MORE RE RULES ===================== */

  // RULE 19: RE + Empty container access
  if (errorType === "RE" && /vector<.*>\s+\w+;/.test(code) && /\[\s*0\s*\]/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_EMPTY_CONTAINER_ACCESS",
      confidence: "High",
      reason: "Accessing elements from an empty container.",
      fix: "Check container size before access.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Defensive Programming"],
      similarProblems: ["Min Stack"],
    };
  }

  // RULE 20: RE + Null pointer dereference
  if (errorType === "RE" && /(NULL|nullptr)/.test(code) && /\*/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_NULL_POINTER",
      confidence: "High",
      reason: "Dereferencing a null pointer causes runtime crash.",
      fix: "Ensure pointer is initialized.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Pointers"],
      similarProblems: ["Linked List Basics"],
    };
  }

  /* ===================== LANGUAGE-SPECIFIC ===================== */

  // RULE 21: Python recursion depth
  if (errorType === "RE" && language === "python" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "PYTHON_RECURSION_LIMIT",
      confidence: "High",
      reason: "Python recursion depth exceeded.",
      fix: "Convert recursion to iterative approach.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Recursion"],
      similarProblems: ["DFS Traversal"],
    };
  }

  // RULE 22: Java Scanner slow IO
  if (errorType === "TLE" && language === "java" && code.includes("Scanner")) {
    return {
      analysisId: uuid(),
      matchedRule: "JAVA_SLOW_IO",
      confidence: "Medium",
      reason: "Scanner is slow for large input.",
      fix: "Use BufferedReader instead.",
      currentComplexity: "O(n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Fast IO"],
      similarProblems: ["Fast Input Output"],
    };
  }

  // RULE 23: C++ cin without fast IO
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
      reason: "cin without fast IO can cause TLE.",
      fix: "Enable fast IO using ios::sync_with_stdio(false).",
      currentComplexity: "O(n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Fast IO"],
      similarProblems: ["Large Input Handling"],
    };
  }
    /* ===================== MORE TLE RULES ===================== */

  // RULE 14: TLE + Map inside loop
  if (errorType === "TLE" && hasNestedLoop(code) && /map|unordered_map/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_MAP_IN_LOOP",
      confidence: "High",
      reason: "Map operations inside loops add logarithmic overhead.",
      fix: "Use arrays or reduce nested operations.",
      currentComplexity: "O(n² log n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Hashing", "Optimization"],
      similarProblems: ["Frequency Count", "Group Anagrams"],
    };
  }

  // RULE 15: TLE + Prefix sum recomputed repeatedly
  if (errorType === "TLE" && hasNestedLoop(code) && /sum\s*\+=/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "TLE_REPEATED_SUM",
      confidence: "Medium",
      reason: "Repeated summation inside loops causes redundant computation.",
      fix: "Precompute prefix sums.",
      currentComplexity: "O(n²)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Prefix Sum"],
      similarProblems: ["Range Sum Query"],
    };
  }

  /* ===================== MORE WA RULES ===================== */

  // RULE 16: WA + Floating point comparison
  if (errorType === "WA" && /(float|double)/.test(code) && /==/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_FLOAT_COMPARISON",
      confidence: "Medium",
      reason: "Direct comparison of floating point values is unreliable.",
      fix: "Use epsilon-based comparison.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Floating Point Precision"],
      similarProblems: ["Sqrt(x)", "Pow(x, n)"],
    };
  }

  // RULE 17: WA + Comma operator misuse
  if (errorType === "WA" && /if\s*\(.*,.+\)/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_COMMA_OPERATOR",
      confidence: "Medium",
      reason: "Comma operator evaluates only the last expression.",
      fix: "Use logical operators like && or ||.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Operators"],
      similarProblems: ["Valid Conditions"],
    };
  }

  // RULE 18: WA + Wrong loop boundary
  if (errorType === "WA" && /<=\s*n/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "WA_LOOP_BOUNDARY",
      confidence: "Medium",
      reason: "Loop may execute one extra iteration.",
      fix: "Use strict < condition.",
      currentComplexity: "Correct",
      expectedComplexity: "Correct",
      suggestedTopics: ["Loop Boundaries"],
      similarProblems: ["Array Traversal"],
    };
  }

  /* ===================== MORE RE RULES ===================== */

  // RULE 19: RE + Empty container access
  if (errorType === "RE" && /vector<.*>\s+\w+;/.test(code) && /\[\s*0\s*\]/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_EMPTY_CONTAINER_ACCESS",
      confidence: "High",
      reason: "Accessing elements from an empty container.",
      fix: "Check container size before access.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Defensive Programming"],
      similarProblems: ["Min Stack"],
    };
  }

  // RULE 20: RE + Null pointer dereference
  if (errorType === "RE" && /(NULL|nullptr)/.test(code) && /\*/.test(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "RE_NULL_POINTER",
      confidence: "High",
      reason: "Dereferencing a null pointer causes runtime crash.",
      fix: "Ensure pointer is initialized.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Pointers"],
      similarProblems: ["Linked List Basics"],
    };
  }

  /* ===================== LANGUAGE-SPECIFIC ===================== */

  // RULE 21: Python recursion depth
  if (errorType === "RE" && language === "python" && usesRecursion(code)) {
    return {
      analysisId: uuid(),
      matchedRule: "PYTHON_RECURSION_LIMIT",
      confidence: "High",
      reason: "Python recursion depth exceeded.",
      fix: "Convert recursion to iterative approach.",
      currentComplexity: "N/A",
      expectedComplexity: "N/A",
      suggestedTopics: ["Recursion"],
      similarProblems: ["DFS Traversal"],
    };
  }

  // RULE 22: Java Scanner slow IO
  if (errorType === "TLE" && language === "java" && code.includes("Scanner")) {
    return {
      analysisId: uuid(),
      matchedRule: "JAVA_SLOW_IO",
      confidence: "Medium",
      reason: "Scanner is slow for large input.",
      fix: "Use BufferedReader instead.",
      currentComplexity: "O(n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Fast IO"],
      similarProblems: ["Fast Input Output"],
    };
  }

  // RULE 23: C++ cin without fast IO
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
      reason: "cin without fast IO can cause TLE.",
      fix: "Enable fast IO using ios::sync_with_stdio(false).",
      currentComplexity: "O(n)",
      expectedComplexity: "O(n)",
      suggestedTopics: ["Fast IO"],
      similarProblems: ["Large Input Handling"],
    };
  }
if (
  errorType === "WA" &&
  /dp\[\s*i\s*\]/.test(code) &&
  !/dp\[\s*0\s*\]/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_BASE_NOT_INITIALIZED",
    confidence: "High",
    reason:
      "DP table is used without initializing base values.",
    fix:
      "Initialize base cases such as dp[0] and dp[1] before transitions.",
    suggestedTopics: ["Dynamic Programming", "Initialization"],
  };
}
if (
  errorType === "WA" &&
  usesRecursion(code) &&
  /n\s*==\s*1/.test(code) &&
  !/n\s*==\s*0/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_INCOMPLETE_BASE_CASE",
    confidence: "Medium",
    reason:
      "Base case handles n == 1 but misses n == 0, causing failures for edge cases.",
    fix:
      "Add handling for n == 0 in the base case.",
    suggestedTopics: ["Edge Cases", "Dynamic Programming"],
  };
}
if (
  errorType === "WA" &&
  usesRecursion(code) &&
  !/n\s*==\s*0/.test(code) &&
  !/n\s*<=\s*1/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_MISSING_BASE_CASE",
    confidence: "High",
    reason:
      "Recursive DP solution lacks a proper base case, causing incorrect results for small inputs.",
    fix:
      "Define base cases such as n == 0 and n == 1 explicitly.",
    currentComplexity: "Correct but logically flawed",
    expectedComplexity: "Correct",
    suggestedTopics: ["Dynamic Programming", "Base Cases"],
    similarProblems: ["Fibonacci", "Climbing Stairs"],
  };
}
if (
  errorType === "WA" &&
  /string/.test(code) &&
  /\bdp\[\s*i\s*\]\[\s*j\s*\]/.test(code) &&
  !/dp\[\s*0\s*\]\[\s*\w+\s*\]/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_STRING_MISSING_BASE",
    confidence: "High",
    reason:
      "String DP requires initialization of first row or column.",
    fix:
      "Initialize dp[0][j] and dp[i][0] appropriately.",
    suggestedTopics: ["String DP"],
    similarProblems: ["LCS", "Edit Distance"],
  };
}
if (
  errorType === "WA" &&
  /\bdp\[\s*i\s*\]/.test(code) &&
  !/dp\[\s*0\s*\]\s*=\s*true/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_SUBSET_MISSING_BASE",
    confidence: "High",
    reason:
      "Subset DP missing base case dp[0] = true.",
    fix:
      "Initialize dp[0] = true to represent empty subset.",
    suggestedTopics: ["Subset DP"],
    similarProblems: ["Partition Equal Subset Sum"],
  };
}
if (
  errorType === "WA" &&
  /coin|ways/.test(code) &&
  /\bdp\[\s*i\s*\]/.test(code) &&
  !/dp\[\s*0\s*\]\s*=\s*1/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_COUNT_MISSING_BASE",
    confidence: "High",
    reason:
      "Counting DP requires dp[0] = 1 to represent one valid way.",
    fix:
      "Initialize dp[0] = 1.",
    suggestedTopics: ["Counting DP"],
    similarProblems: ["Coin Change", "Dice Combinations"],
  };
}
if (
  errorType === "WA" &&
  /\bdp\[\s*l\s*\]\[\s*r\s*\]/.test(code) &&
  !/l\s*==\s*r/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_INTERVAL_MISSING_BASE",
    confidence: "Medium",
    reason:
      "Interval DP missing base case for single-length intervals.",
    fix:
      "Handle cases where l == r explicitly.",
    suggestedTopics: ["Interval DP"],
    similarProblems: ["Matrix Chain Multiplication"],
  };
}
if (
  errorType === "WA" &&
  /tree|node|left|right/.test(code) &&
  usesRecursion(code) &&
  !/if\s*\(\s*root\s*==\s*null\s*\)/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_TREE_MISSING_BASE",
    confidence: "High",
    reason:
      "Tree DP missing base case for null or leaf nodes.",
    fix:
      "Add base case handling for null nodes.",
    suggestedTopics: ["Tree DP"],
    similarProblems: ["Binary Tree Maximum Path Sum"],
  };
}
if (
  errorType === "WA" &&
  /graph|adj/.test(code) &&
  /\bdp\[\s*u\s*\]/.test(code) &&
  !/dp\[\s*start\s*\]/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_GRAPH_MISSING_BASE",
    confidence: "Medium",
    reason:
      "Graph DP missing base initialization for starting node.",
    fix:
      "Initialize dp[start] before traversal.",
    suggestedTopics: ["Graph DP"],
    similarProblems: ["Longest Path in DAG"],
  };
}
if (
  errorType === "WA" &&
  /graph|adj/.test(code) &&
  /\bdp\[\s*u\s*\]/.test(code) &&
  !/dp\[\s*start\s*\]/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "DP_GRAPH_MISSING_BASE",
    confidence: "Medium",
    reason:
      "Graph DP missing base initialization for starting node.",
    fix:
      "Initialize dp[start] before traversal.",
    suggestedTopics: ["Graph DP"],
    similarProblems: ["Longest Path in DAG"],
  };
}
if (
  errorType === "WA" &&
  /pop\(\)/.test(code) &&
  !/push\(\)/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_UNBALANCED_OPERATIONS",
    confidence: "Medium",
    reason:
      "Stack pop operations are not balanced with push operations.",
    fix:
      "Ensure every pop has a corresponding push.",
    currentComplexity: "Correct",
    expectedComplexity: "Correct",
    suggestedTopics: ["Stack Operations"],
    similarProblems: ["Remove K Digits"],
  };
}
if (
  errorType === "RE" &&
  usesRecursion(code) &&
  /stack/.test(code) &&
  !/return/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_RECURSION_NO_BASE",
    confidence: "High",
    reason:
      "Recursive stack usage lacks a proper base condition.",
    fix:
      "Add a terminating base condition.",
    suggestedTopics: ["Recursion", "Stack"],
    similarProblems: ["Reverse Stack"],
  };
}
if (
  errorType === "RE" &&
  usesRecursion(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_OVERFLOW",
    confidence: "High",
    reason:
      "Deep recursion causes stack overflow.",
    fix:
      "Convert recursion to iterative solution.",
    suggestedTopics: ["Stack", "Recursion"],
    similarProblems: ["DFS Traversal"],
  };
}
if (
  errorType === "WA" &&
  /stack/.test(code) &&
  /(>=|<=)/.test(code) &&
  /while/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_WRONG_POP_ORDER",
    confidence: "Medium",
    reason:
      "Incorrect comparison while popping elements from stack.",
    fix:
      "Recheck monotonic stack conditions.",
    suggestedTopics: ["Monotonic Stack"],
    similarProblems: ["Next Greater Element"],
  };
}
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
    reason:
      "Stack not cleared between test cases.",
    fix:
      "Clear or reinitialize stack inside test loop.",
    suggestedTopics: ["Multiple Test Cases"],
    similarProblems: ["Largest Rectangle Histogram"],
  };
}
if (
  errorType === "WA" &&
  /stack/.test(code) &&
  !/push/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_NOT_INITIALIZED",
    confidence: "Low",
    reason:
      "Stack used without proper initialization.",
    fix:
      "Push initial values before stack operations.",
    suggestedTopics: ["Initialization"],
    similarProblems: ["Daily Temperatures"],
  };
}
if (
  errorType === "RE" &&
  /pop\(\)\s*;\s*.*top\(\)/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_TOP_AFTER_POP",
    confidence: "High",
    reason:
      "Accessing stack top immediately after pop may cause empty stack access.",
    fix:
      "Check if stack is empty after pop.",
    suggestedTopics: ["Stack Safety"],
    similarProblems: ["Min Stack"],
  };
}
if (
  errorType === "RE" &&
  /pop\(\)\s*;\s*.*top\(\)/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "STACK_TOP_AFTER_POP",
    confidence: "High",
    reason:
      "Accessing stack top immediately after pop may cause empty stack access.",
    fix:
      "Check if stack is empty after pop.",
    suggestedTopics: ["Stack Safety"],
    similarProblems: ["Min Stack"],
  };
}
if (
  errorType === "WA" &&
  /greedy|pick|max|min/.test(code) &&
  /dp|memo/.test(code) === false &&
  /(subset|knapsack|partition|coin)/i.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_INSTEAD_OF_DP",
    confidence: "High",
    reason:
      "Greedy approach is applied to a problem that requires dynamic programming.",
    fix:
      "Reformulate the solution using DP to explore all states.",
    suggestedTopics: ["Dynamic Programming"],
    similarProblems: ["0/1 Knapsack", "Partition Equal Subset Sum"],
  };
}
if (
  errorType === "WA" &&
  /sort/.test(code) &&
  !/if.*==/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_MISSING_TIE_BREAKER",
    confidence: "Low",
    reason:
      "Greedy sorting lacks tie-breaker for equal values.",
    fix:
      "Add secondary condition to handle ties correctly.",
    suggestedTopics: ["Sorting", "Greedy"],
    similarProblems: ["Meeting Rooms", "Interval Scheduling"],
  };
}
if (
  errorType === "WA" &&
  /sort/.test(code) &&
  !/if\s*\(n\s*==\s*0|n\s*==\s*1/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_EDGE_CASE_MISSING",
    confidence: "Low",
    reason:
      "Greedy solution may fail for small or boundary inputs.",
    fix:
      "Add explicit handling for edge cases.",
    suggestedTopics: ["Edge Case Handling"],
    similarProblems: ["Jump Game", "Gas Station"],
  };
}
if (
  errorType === "WA" &&
  /(max|min)\s*\(/.test(code) &&
  !/backtrack|dp/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_LOCAL_OPTIMUM_TRAP",
    confidence: "Medium",
    reason:
      "Local optimal choices may not lead to global optimum.",
    fix:
      "Prove greedy correctness or switch to DP.",
    suggestedTopics: ["Greedy vs DP"],
    similarProblems: ["Burst Balloons", "Stock Buy Sell"],
  };
}
if (
  errorType === "WA" &&
  /sort|pick|choose/.test(code) &&
  !/proof|correct|why/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_UNJUSTIFIED",
    confidence: "Low",
    reason:
      "Greedy choice made without validating correctness.",
    fix:
      "Provide proof or test greedy logic against counterexamples.",
    suggestedTopics: ["Greedy Proof"],
    similarProblems: ["Fractional Knapsack"],
  };
}
if (
  errorType === "WA" &&
  /greedy/.test(code) &&
  /backtrack|revert/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_NON_MONOTONIC",
    confidence: "Medium",
    reason:
      "Greedy algorithm applied to non-monotonic problem.",
    fix:
      "Use DP or backtracking approach.",
    suggestedTopics: ["Backtracking", "DP"],
    similarProblems: ["Word Break", "Decode Ways"],
  };
}
if (
  errorType === "WA" &&
  /sort/.test(code) &&
  /(>=|<=)/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_WRONG_COMPARISON",
    confidence: "Low",
    reason:
      "Incorrect comparison operator in greedy selection.",
    fix:
      "Re-evaluate comparison logic.",
    suggestedTopics: ["Comparators"],
    similarProblems: ["Interval Merge"],
  };
}
if (
  errorType === "Overflow" &&
  /(sum|profit)\s*\+=/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_OVERFLOW",
    confidence: "Medium",
    reason:
      "Greedy accumulation may cause integer overflow.",
    fix:
      "Use long long and modulo if required.",
    suggestedTopics: ["Overflow Prevention"],
    similarProblems: ["Maximum Profit"],
  };
}
if (
  errorType === "RE" &&
  /while/.test(code) &&
  !/i\+\+|i--/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "GREEDY_INFINITE_LOOP",
    confidence: "High",
    reason:
      "Greedy loop does not converge, causing infinite loop.",
    fix:
      "Ensure loop condition progresses towards termination.",
    suggestedTopics: ["Loop Control"],
    similarProblems: ["Gas Station"],
  };
}
if (
  errorType === "RE" &&
  /map|unordered_map|hash/.test(code) &&
  /\[\s*\w+\s*\]/.test(code) &&
  !/find|count/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_ACCESS_WITHOUT_CHECK",
    confidence: "High",
    reason:
      "Hash map accessed without checking key existence.",
    fix:
      "Check key existence using find() or count() before access.",
    currentComplexity: "N/A",
    expectedComplexity: "N/A",
    suggestedTopics: ["HashMap Safety"],
    similarProblems: ["Two Sum"],
  };
}
if (
  errorType === "WA" &&
  /map|unordered_map/.test(code) &&
  /i\s*\]/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_WRONG_KEY",
    confidence: "Medium",
    reason:
      "Incorrect key used for hashing, leading to wrong mapping.",
    fix:
      "Verify correct key selection for hash map.",
    suggestedTopics: ["Hashing"],
    similarProblems: ["Group Anagrams"],
  };
}
if (
  errorType === "WA" &&
  /while\s*\(t--\)/.test(code) &&
  /map|unordered_map/.test(code) &&
  !/clear/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_NOT_RESET",
    confidence: "Low",
    reason:
      "Hash map not cleared between test cases.",
    fix:
      "Clear or reinitialize hash map inside test loop.",
    suggestedTopics: ["Multiple Test Cases"],
    similarProblems: ["Frequency Count"],
  };
}
if (
  errorType === "WA" &&
  /map|unordered_map/.test(code) &&
  /\+\+|--/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_WRONG_FREQUENCY",
    confidence: "Medium",
    reason:
      "Frequency count may be incorrect.",
    fix:
      "Verify increment/decrement logic carefully.",
    suggestedTopics: ["Frequency Hashing"],
    similarProblems: ["Valid Anagram"],
  };
}
if (
  errorType === "WA" &&
  /map|unordered_map/.test(code) &&
  /\+\+|--/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_WRONG_FREQUENCY",
    confidence: "Medium",
    reason:
      "Frequency count may be incorrect.",
    fix:
      "Verify increment/decrement logic carefully.",
    suggestedTopics: ["Frequency Hashing"],
    similarProblems: ["Valid Anagram"],
  };
}
if (
  errorType === "WA" &&
  /unordered_map/.test(code) &&
  /(sorted|increasing|decreasing)/i.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_WRONG_MAP_TYPE",
    confidence: "Low",
    reason:
      "unordered_map used where ordered traversal is required.",
    fix:
      "Use map or sort keys explicitly.",
    suggestedTopics: ["Map vs Unordered Map"],
    similarProblems: ["Sort Characters by Frequency"],
  };
}
if (
  errorType === "TLE" &&
  hasNestedLoop(code) &&
  /map|unordered_map/.test(code)
) {
  return {
    analysisId: uuid(),
    matchedRule: "HASH_IN_NESTED_LOOP",
    confidence: "High",
    reason:
      "Hash operations inside nested loops increase time complexity.",
    fix:
      "Reduce nested operations or precompute hash values.",
    currentComplexity: "O(n²)",
    expectedComplexity: "O(n)",
    suggestedTopics: ["Hash Optimization"],
    similarProblems: ["Subarray Sum Equals K"],
  };
}
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
    reason:
      "Queue accessed without checking if it is empty.",
    fix:
      "Check queue.empty() before accessing front or pop.",
    suggestedTopics: ["Queue Safety"],
    similarProblems: ["Implement Queue"],
  };
}



export default ruleEngine;
