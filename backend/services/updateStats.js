import Stats from "../models/Stats.js";

export async function updateStats(userId, analysisDoc) {
  const update = {
    $inc: { totalAnalyses: 1 },
    $set: { lastUpdated: new Date() },
  };

  // 1) Error types (from summary)
  if (analysisDoc?.summary?.errorTypes?.length) {
    for (const type of analysisDoc.summary.errorTypes) {
      update.$inc[`errorTypes.${type}`] =
        (update.$inc[`errorTypes.${type}`] || 0) + 1;
    }
  }

  // 2) Topic weakness
  if (analysisDoc.topic) {
    update.$inc[`topics.${analysisDoc.topic}`] =
      (update.$inc[`topics.${analysisDoc.topic}`] || 0) + 1;
  }

  // 3) Common mistakes (from findings)
  if (Array.isArray(analysisDoc.findings)) {
    for (const f of analysisDoc.findings) {
      if (!f.rule) continue;
      update.$inc[`commonMistakes.${f.rule}`] =
        (update.$inc[`commonMistakes.${f.rule}`] || 0) + 1;
    }
  }

  await Stats.findOneAndUpdate(
    { userId },
    update,
    { upsert: true, new: true }
  );
}
