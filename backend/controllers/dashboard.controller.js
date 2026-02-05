import mongoose from "mongoose";
import Analysis from "../models/Analysis.js";

export const getDashboardStats = async (req, res) => {
  console.log("Dashboard Hit");

  try {
    const userId = req.user._id;

    /* =======================
       BASIC DASHBOARD STATS
    ======================= */

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
      .select("language summary.score summary.errorTypes createdAt");

    /* =======================
       HEATMAP + STREAK LOGIC
    ======================= */

    // Last 365 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);

    // Group analyses by day
    const dailyActivity = await Analysis.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map for quick lookup
    const activityMap = {};
    dailyActivity.forEach((d) => {
      activityMap[d._id] = d.count;
    });

    // Fill all 365 days
    const heatmap = [];
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (364 - i));
      const key = d.toISOString().slice(0, 10);

      heatmap.push({
        date: key,
        count: activityMap[key] || 0,
      });
    }

    /* =======================
       STREAK CALCULATION
    ======================= */

    let longestStreak = 0;
    let tempStreak = 0;

    // Longest streak
    for (const day of heatmap) {
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (from today backwards)
    let currentStreak = 0;
    for (let i = heatmap.length - 1; i >= 0; i--) {
      if (heatmap[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    /* =======================
       FINAL RESPONSE
    ======================= */

    return res.json({
      user: req.user,
      totalAnalyses,
      errorBreakdown,
      weakTopics,
      recentAnalyses,

      // 🔥 Heatmap & streak
      heatmap,
      streak: {
        current: currentStreak,
        longest: longestStreak,
      },
    });

  } catch (err) {
    console.error("❌ DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
