const Submission = require("../models/submission.model.js");
const { evaluateSubmission } = require("../services/evaluationService");
const submissionQueue = require("../queues/submission.queue");

const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const submission = await Submission.create({
      userId: req.user._id,
      problemId,
      code,
      language,
      status: "Pending",
    });

    // Push job to queue
    await submissionQueue.add("evaluate-submission", 
      {submissionId: submission._id},
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
      
    );

    return res.status(201).json({
      message: "Submission queued successfully",
      submissionId: submission._id,
      status: "Pending",
    });

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

    const submissions = await Submission.find({
        problemId,
        userId: req.user._id,
      })
  .sort({ createdAt: -1 })
  .select("-code -__v");

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