const Submission = require("../models/submission.model");

/**
 * GET /api/leaderboard
 * Returns the top 10 users with the most unique problems solved (Accepted).
 */
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: "Accepted" } },
      {
        $group: {
          _id: { userId: "$userId", problemId: "$problemId" },
        },
      },
      {
        $group: {
          _id: "$_id.userId",
          solvedCount: { $sum: 1 },
        },
      },
      { $sort: { solvedCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          profilePicture: "$user.profilePicture",
          solvedCount: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

/**
 * GET /api/leaderboard/daily
 * Returns the top 10 users with the most unique problems solved today.
 */
const getDailyLeaderboard = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const leaderboard = await Submission.aggregate([
      {
        $match: {
          status: "Accepted",
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: { userId: "$userId", problemId: "$problemId" },
        },
      },
      {
        $group: {
          _id: "$_id.userId",
          solvedCount: { $sum: 1 },
        },
      },
      { $sort: { solvedCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          profilePicture: "$user.profilePicture",
          solvedCount: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error("Daily leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch daily leaderboard" });
  }
};

module.exports = { getLeaderboard, getDailyLeaderboard };
