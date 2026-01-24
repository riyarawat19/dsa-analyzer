/**
 * Static Space Complexity Estimator
 * Heuristic-based, no execution
 */

export function estimateSpaceComplexity(code) {
  code = code.replace(/\s+/g, " ");

  /* ===================== CONSTANT ===================== */

  if (!hasExtraSpace(code) && !usesRecursion(code)) {
    return "O(1)";
  }

  /* ===================== RECURSION STACK ===================== */

  if (usesRecursion(code) && !hasDPTable(code)) {
    return "O(n) (recursion stack)";
  }

  /* ===================== DP TABLE ===================== */

  if (hasDPTable(code)) {
    const dims = countDPDimensions(code);
    if (dims === 1) return "O(n)";
    if (dims === 2) return "O(n²)";
    if (dims >= 3) return `O(n^${dims})`;
  }

  /* ===================== GRAPH ===================== */

  if (isGraphTraversal(code)) {
    return "O(V)";
  }

  /* ===================== HEAP / MAP ===================== */

  if (usesHeap(code) || usesHash(code)) {
    return "O(n)";
  }

  /* ===================== ARRAY ===================== */

  if (usesArray(code)) {
    return "O(n)";
  }

  /* ===================== BACKTRACKING ===================== */

  if (isBacktracking(code)) {
    return "O(n) (call stack)";
  }

  return "Unknown";
}

/* =================================================== */
/* =================== HELPERS ======================= */
/* =================================================== */

function hasExtraSpace(code) {
  return /vector|array|map|unordered_map|set|dp\[|heap|queue|stack/i.test(code);
}

function usesRecursion(code) {
  const fnMatch = code.match(/(\w+)\s*\(.*\)\s*{/);
  if (!fnMatch) return false;
  const fnName = fnMatch[1];
  const calls = code.match(new RegExp(`${fnName}\\s*\\(`, "g")) || [];
  return calls.length > 1;
}

function hasDPTable(code) {
  return /\bdp\[\s*\w+\s*\]/.test(code);
}

function countDPDimensions(code) {
  const matches = code.match(/\bdp\s*\[/g) || [];
  return matches.length;
}

function isGraphTraversal(code) {
  return /(dfs|bfs)/i.test(code) && /adj|graph|edges/.test(code);
}

function usesHeap(code) {
  return /priority_queue|heap/i.test(code);
}

function usesHash(code) {
  return /map|unordered_map|hash/i.test(code);
}

function usesArray(code) {
  return /\[\s*\w+\s*\]/.test(code);
}

function isBacktracking(code) {
  return /backtrack|choose|include|exclude|pick/i.test(code);
}
