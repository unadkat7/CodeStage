const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Error", "Pending"],
    default: "Pending",
  },
  output: String,
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);