import Analysis from "../models/Analysis.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Total analyses
    const totalAnalyses = await Analysis.countDocuments({ userId });

    // Error breakdown
    const errorBreakdown = await Analysis.aggregate([
      { $match: { userId } },
      { $unwind: "$summary.errorTypes" },
      {
        $group: {
          _id: "$summary.errorTypes",
          count: { $sum: 1 },
        },
      },
    ]);

    // Weak topics
    const weakTopics = await Analysis.aggregate([
      { $match: { userId } },
      { $unwind: "$findings" },
      { $unwind: "$findings.suggestedTopics" },
      {
        $group: {
          _id: "$findings.suggestedTopics",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent analyses
    const recentAnalyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("language topic summary.score summary.errorTypes createdAt");

    return res.json({
      user:req.user,
      totalAnalyses,
      errorBreakdown,
      weakTopics,
      recentAnalyses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
