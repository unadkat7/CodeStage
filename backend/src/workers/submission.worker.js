const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const mongoose = require("mongoose");
require("dotenv").config();

const Submission = require("../models/submission.model");
const { evaluateSubmission } = require("../services/evaluationService");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Worker MongoDB Connected"))
.catch(err => console.error(err));

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

const worker = new Worker(
  "submission-queue",
  async (job) => {
    console.log("Processing job:", job.name);

    const { submissionId } = job.data;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      console.log("Submission not found");
      return;
    }

    const result = await evaluateSubmission(submission);

    submission.status = result.status;
    submission.executionTime = result.executionTime;
    submission.memoryUsed = result.memoryUsed;
    submission.failedTestCase = result.failedTestCase || null;
    submission.output = result.message || result.output || null;

    await submission.save();
    const io = getIO();

    io.emit("submission-result", {
      submissionId: submission._id,
      status: submission.status,
      executionTime: submission.executionTime,
      memoryUsed: submission.memoryUsed
    });

    console.log("Submission evaluated:", submissionId);
  },
  { connection,
    concurrency: 5
   }
);

console.log("Submission worker running...");