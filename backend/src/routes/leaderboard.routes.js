const express = require("express");
const router = express.Router();
const { getLeaderboard, getDailyLeaderboard } = require("../controllers/leaderboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getLeaderboard);
router.get("/daily", authMiddleware, getDailyLeaderboard);

module.exports = router;
