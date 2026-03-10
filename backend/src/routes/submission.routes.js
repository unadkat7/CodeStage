const express = require("express");
const router = express.Router();
const { createSubmission,getSubmissionHistory,getSubmissionById } = require("../controllers/submission.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.post("/", authMiddleware, createSubmission);
router.get("/history/:problemId", authMiddleware, getSubmissionHistory);
router.get("/:submissionId", authMiddleware, getSubmissionById);
module.exports = router;