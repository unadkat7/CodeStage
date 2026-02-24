const Submission = require("../models/submission.model.js");
const { evaluateSubmission } = require("../services/evaluationService");

const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const submission = await Submission.create({
      problemId,
      code,
      language,
      status: "Pending",
    });

    const result = await evaluateSubmission(submission);

    submission.status = result.status;
    submission.executionTime = result.executionTime;
    submission.memoryUsed = result.memoryUsed;
    submission.failedTestCase = result.failedTestCase || null;

    // Store message OR output safely
    submission.output = result.message || result.output || null;
    await submission.save();

    return res.status(201).json(result);

  } catch (error) {
    console.error("Submission Controller Error:", error);
    return res.status(500).json({
      message: "Error creating submission",
      error: error.message
    });
  }
};

// Get submission history for a problem
const getSubmissionHistory = async (req, res) => {
  try {
    const { problemId } = req.params;

    const submissions = await Submission.find({ problemId })
      .sort({ createdAt: -1 });

    return res.status(200).json(submissions);

  } catch (error) {
    console.error("History Fetch Error:", error);
    return res.status(500).json({
      message: "Error fetching submission history",
      error: error.message,
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissionHistory,
};