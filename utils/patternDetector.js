// Detects if code contains nested loops
function hasNestedLoop(code) {
  if (!code) return false;

  const forCount = (code.match(/\bfor\s*\(/g) || []).length;
  const whileCount = (code.match(/\bwhile\s*\(/g) || []).length;

  return forCount + whileCount >= 2;
}


// Detects recursion (heuristic-based)
function usesRecursion(code) {
  if (!code) return false;

  // Looks for repeated function calls
  const functionCalls = code.match(/\w+\s*\(/g) || [];
  return functionCalls.length > 5;
}

// Detects any array access like arr[i]
function hasArrayAccess(code) {
  if (!code) return false;
  return /\w+\s*\[.*?\]/.test(code);
}

// Detects unsafe indexing patterns
function hasUnsafeIndexing(code) {
  if (!code) return false;

  return (
    /\[\s*i\s*\+\s*1\s*\]/.test(code) ||
    /\[\s*i\s*-\s*1\s*\]/.test(code) ||
    /\[\s*j\s*\+\s*1\s*\]/.test(code)
  );
}

// Detects use of int for potentially large numbers (C++ / Java)
function usesIntForLargeNumbers(code) {
  if (!code) return false;

  const hasInt = /\bint\b/.test(code);
  const hasLongLong = /\blong\s+long\b/.test(code);
  const hasLong = /\blong\b/.test(code);

  return hasInt && !hasLongLong && !hasLong;
}

export {
  hasNestedLoop,
  usesRecursion,
  hasArrayAccess,
  hasUnsafeIndexing,
  usesIntForLargeNumbers,
};
