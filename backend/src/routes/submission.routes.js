const express = require("express");
const router = express.Router();
const { createSubmission,getSubmissionHistory } = require("../controllers/submission.controller.js");

router.post("/", createSubmission);
router.get("/history/:problemId", getSubmissionHistory);
module.exports = router;