/**
 * Heuristic-based Static Time Complexity Estimator
 * NOTE: Does NOT execute code
 */

export function estimateComplexity(code) {
  // Normalize
  code = code.replace(/\s+/g, " ");

  const loopCount = countLoops(code);
  const recursion = hasRecursion(code);

  /* ===================== EXPONENTIAL ===================== */

  if (isExponentialRecursion(code)) {
    return "O(2ⁿ)";
  }

  if (isBacktracking(code)) {
    return "O(2ⁿ)";
  }

  /* ===================== DP ===================== */

  if (recursion && hasMemoization(code)) {
    return "O(n)";
  }

  if (hasDPTable(code)) {
    const dims = countDPDimensions(code);
    if (dims === 1) return "O(n)";
    if (dims === 2) return "O(n²)";
    if (dims >= 3) return `O(n^${dims})`;
  }

  /* ===================== GRAPH ===================== */

  if (isGraphTraversal(code)) {
    return "O(V + E)";
  }

  /* ===================== SORT ===================== */

  if (hasSort(code)) {
    if (loopCount >= 1) return "O(n log n)";
    return "O(n log n)";
  }

  /* ===================== BINARY SEARCH / LOG ===================== */

  if (isLogarithmicLoop(code)) {
    return "O(log n)";
  }

  /* ===================== LOOP-BASED ===================== */

  if (!recursion && loopCount === 0) return "O(1)";
  if (loopCount === 1) return "O(n)";
  if (loopCount === 2) return "O(n²)";
  if (loopCount >= 3) return `O(n^${loopCount})`;

  /* ===================== RECURSION LINEAR ===================== */

  if (recursion) return "O(n)";

  return "Unknown";
}

/* ========================================================= */
/* ===================== HELPERS ============================ */
/* ========================================================= */

function countLoops(code) {
  const forLoops = (code.match(/for\s*\(/g) || []).length;
  const whileLoops = (code.match(/while\s*\(/g) || []).length;
  return forLoops + whileLoops;
}

function hasRecursion(code) {
  const fnMatch = code.match(/(\w+)\s*\(.*\)\s*{/);
  if (!fnMatch) return false;
  const fnName = fnMatch[1];
  const calls = code.match(new RegExp(`${fnName}\\s*\\(`, "g")) || [];
  return calls.length > 1;
}

/* ===================== EXPONENTIAL ===================== */

function isExponentialRecursion(code) {
  const fnMatch = code.match(/(\w+)\s*\(.*\)\s*{/);
  if (!fnMatch) return false;

  const fnName = fnMatch[1];
  const calls =
    code.match(new RegExp(`${fnName}\\s*\\(`, "g")) || [];

  return (
    calls.length > 2 &&
    !hasMemoization(code)
  );
}

function isBacktracking(code) {
  return (
    hasRecursion(code) &&
    /take|skip|choose|exclude|include|pick|backtrack/i.test(code)
  );
}

/* ===================== DP ===================== */

function hasMemoization(code) {
  return /dp|memo|cache|unordered_map|map/.test(code);
}

function hasDPTable(code) {
  return /\bdp\[\s*\w+\s*\]/.test(code);
}

function countDPDimensions(code) {
  const matches = code.match(/\bdp\s*\[/g) || [];
  return matches.length;
}

/* ===================== GRAPH ===================== */

function isGraphTraversal(code) {
  return (
    /(dfs|bfs)/i.test(code) &&
    /adj|graph|edges/.test(code)
  );
}

/* ===================== SORT ===================== */

function hasSort(code) {
  return /sort\(|sorted\(|Arrays\.sort|Collections\.sort|priority_queue/.test(code);
}

/* ===================== LOG ===================== */

function isLogarithmicLoop(code) {
  return (
    /i\s*=\s*i\s*[*\/]\s*2/.test(code) ||
    /low\s*<=\s*high/.test(code) ||
    /mid\s*=/.test(code)
  );
}
