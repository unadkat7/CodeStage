const axios = require("axios");
const Problem = require("../models/problem.model.js");

const evaluateSubmission = async (submission) => {
  const problem = await Problem.findById(submission.problemId);

  if (!problem) {
    return { status: "Error", output: "Problem not found" };
  }


  for (let testCase of problem.testCases) {
    const result = await runCode(submission.code, testCase.input);

    if (result.trim() !== testCase.output.trim()) {
      return { status: "Wrong Answer", output: result };
    }
  }

  return { status: "Accepted", output: "All test cases passed" };
};

const runCode = async (sourceCode, input) => {
  try {
    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        language_id: 54,
        source_code: sourceCode,
        stdin: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.stdout || response.data.stderr || "";
  } catch (error) {
    console.error(error.message);
    return "Execution Error";
  }
};
module.exports = {
  evaluateSubmission,
};