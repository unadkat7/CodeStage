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
    submission.output = result.output;
    submission.executionTime = result.executionTime;
    submission.memoryUsed = result.memoryUsed;
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

module.exports = {
  createSubmission,
};