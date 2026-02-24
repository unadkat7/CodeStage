const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const {
  getAllProblems,
  getProblemById,
  createProblem,
  getProblemStats,
} = require("../controllers/problem.controller.js");



router.get("/", authMiddleware, getAllProblems);
router.get("/:id/stats", getProblemStats);
router.get("/:id", getProblemById);



router.post("/", createProblem);

module.exports = router;