/**
 * Parses constraint strings into structured form
 * Supports:
 *  - n <= 1e5
 *  - n <= 10^5
 *  - n < 100000
 *  - n,m <= 10^5
 *  - array length / string length cases
 */

function parseConstraints(constraints) {
  if (!constraints || constraints.trim() === "") {
    return {
      size: "unknown",
      values: {},
    };
  }

  const normalized = constraints.toLowerCase().replace(/\s/g, "");

  const values = {};

  // Match patterns like n<=1e5, m<=10^5
  const expMatches = normalized.matchAll(/([a-z]+)<=?(1e\d+|10\^\d+)/g);
  for (const match of expMatches) {
    const variable = match[1];
    const value =
      match[2].includes("10^")
        ? Math.pow(10, parseInt(match[2].split("^")[1]))
        : Math.pow(10, parseInt(match[2].replace("1e", "")));

    values[variable] = value;
  }

  // Match numeric constraints like n<=100000
  const numMatches = normalized.matchAll(/([a-z]+)<=?(\d+)/g);
  for (const match of numMatches) {
    values[match[1]] = parseInt(match[2], 10);
  }

  // Decide overall size
  let maxValue = 0;
  Object.values(values).forEach((v) => {
    if (v > maxValue) maxValue = v;
  });

  let size = "unknown";
  if (maxValue >= 1e6) size = "very_large";
  else if (maxValue >= 1e5) size = "large";
  else if (maxValue >= 1e4) size = "medium";
  else if (maxValue > 0) size = "small";

  return {
    size,
    values,
  };
}

export { parseConstraints };
