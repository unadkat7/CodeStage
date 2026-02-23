const express = require("express");
const router = express.Router();
const { createSubmission } = require("../controllers/submission.controller.js");

router.post("/", createSubmission);

module.exports = router;