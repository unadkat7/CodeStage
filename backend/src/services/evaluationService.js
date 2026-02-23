const axios = require("axios");
const Problem = require("../models/problem.model.js");

const evaluateSubmission = async (submission) => {
  const problem = await Problem.findById(submission.problemId);

  if (!problem) {
    return { status: "Error", output: "Problem not found" };
  }

  let executionTime = null;
  let memoryUsed = null;

  for (let i = 0; i < problem.testCases.length; i++) {

    const result = await runCode(submission.code, testCase.input);

    if (result.error) {
      return { status: "Execution Error", output: result.error };
    }

    // If compilation/runtime/TLE etc
    if (!result.status || result.status.id !== 3) {

      let normalizedStatus = result.status?.description || "Error";

      if (normalizedStatus.includes("Runtime Error")) {
        normalizedStatus = "Runtime Error";
      } else if (normalizedStatus.includes("Time Limit")) {
        normalizedStatus = "Time Limit Exceeded";
      } else if (normalizedStatus.includes("Compilation")) {
        normalizedStatus = "Compilation Error";
      }

      return {
        status: normalizedStatus,
        output: result.stderr
          ? Buffer.from(result.stderr, "base64").toString()
          : result.compile_output
          ? Buffer.from(result.compile_output, "base64").toString()
          : "",
      };
    }

    // Capture execution stats from LAST successful test case
    executionTime = result.time;
    memoryUsed = result.memory;

    const userOutput = result.stdout
      ? Buffer.from(result.stdout, "base64").toString().trim()
      : "";

    const expectedOutput = testCase.output.trim();

    if (userOutput !== expectedOutput) {
      return {
      status: "Wrong Answer",
      output: userOutput,
      failedTestCase: i + 1
      };
    }
  }

  return {
    status: "Accepted",
    output: "All test cases passed",
    executionTime,
    memoryUsed,
  };
};

const runCode = async (sourceCode, input) => {
  try {
    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=true&wait=true",
      {
        language_id: 54,
        source_code: Buffer.from(sourceCode).toString("base64"),
        stdin: Buffer.from(input).toString("base64"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("AXIOS ERROR FULL:", error.response?.data || error.message);
    return { error: "Execution Error" };
  }
};

module.exports = {
  evaluateSubmission,
};