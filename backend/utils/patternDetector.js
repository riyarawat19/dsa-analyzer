// Detects real nested loops
function hasNestedLoop(code) {
  if (!code) return false;

  const normalized = code.replace(/\s+/g, " ");

  return /for\s*\(.*?\).*for\s*\(/.test(normalized) ||
         /while\s*\(.*?\).*while\s*\(/.test(normalized);
}


// Detects actual recursion (function calling itself)
function usesRecursion(code) {
  if (!code) return false;

  const match = code.match(/\b(\w+)\s*\([^)]*\)\s*{/);
  if (!match) return false;

  const funcName = match[1];
  const callRegex = new RegExp(`\\b${funcName}\\s*\\(`, "g");

  return (code.match(callRegex) || []).length > 1;
}

// Detects any array access
function hasArrayAccess(code) {
  if (!code) return false;
  return /\w+\s*\[[^\]]+\]/.test(code);
}

// Detects unsafe indexing like arr[i+1], arr[i-k]
function hasUnsafeIndexing(code) {
  if (!code) return false;
  return /\[\s*\w+\s*[\+\-]\s*\w+\s*\]/.test(code);
}

// Detects possible integer overflow
function usesIntForLargeNumbers(code) {
  if (!code) return false;

  const hasInt = /\bint\b/.test(code);
  const riskyMath = /[\*\+]=|\*\s*\w+/;
  const hasLong = /\blong\b/.test(code);

  return hasInt && riskyMath.test(code) && !hasLong;
}

export {
  hasNestedLoop,
  usesRecursion,
  hasArrayAccess,
  hasUnsafeIndexing,
  usesIntForLargeNumbers,
};
