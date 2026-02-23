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

    // Evaluate submission
    const result = await evaluateSubmission(submission);

    submission.status = result.status;
    submission.output = result.output;
    await submission.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Error creating submission" });
  }
};

module.exports = {
  createSubmission,
};