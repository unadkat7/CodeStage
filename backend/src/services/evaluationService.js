const axios = require("axios");
const Problem = require("../models/problem.model.js");

// 🔁 Retry wrapper for Judge0
async function callJudge0WithRetry(config, retries = 3) {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Judge0 Error:", error.response?.data || error.message);

    if (retries > 0) {
      console.log(`Retrying Judge0... (${3 - retries + 1})`);
      await new Promise(res => setTimeout(res, 1000));
      return callJudge0WithRetry(config, retries - 1);
    }

    throw error;
  }
}

// ✅ Normalize function (GLOBAL - correct placement)
const normalize = (str) => {
  return str
    .trim()
    .replace(/\r/g, "")
    .split(/\s+/)   // split on any whitespace
    .join(" ");     // normalize to single space
};

const evaluateSubmission = async (submission) => {
  try {
    const problem = await Problem.findById(submission.problemId);

    if (!problem) {
      return { status: "Error", output: "Problem not found" };
    }

    let executionTime = null;
    let memoryUsed = null;

    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      const result = await runCode(submission.code, testCase.input);

      if (result.error) {
        return { status: "Execution Error", output: result.error };
      }

      // ❌ Compilation / Runtime / TLE
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

      // ✅ Capture stats
      executionTime = result.time;
      memoryUsed = result.memory;

      // ✅ Normalize outputs
      const userOutput = result.stdout
        ? normalize(Buffer.from(result.stdout, "base64").toString())
        : "";

      const expectedOutput = normalize(testCase.output);

      // ❌ Wrong Answer check
      if (userOutput !== expectedOutput) {
        if (testCase.isHidden) {
          return {
            status: "Wrong Answer",
            message: "Failed on hidden test case",
            failedTestCase: i + 1,
          };
        }

        return {
          status: "Wrong Answer",
          message: "Failed on sample test case",
          failedTestCase: i + 1,
          yourOutput: userOutput,
          expectedOutput: expectedOutput,
        };
      }
    }

    // ✅ All test cases passed
    return {
      status: "Accepted",
      output: "All test cases passed",
      executionTime,
      memoryUsed,
    };

  } catch (err) {
    console.error("Evaluation Error:", err.message);

    return {
      status: "Error",
      message: "Judge0 timeout / API failed. Please try again.",
      executionTime: null,
      memoryUsed: null,
      failedTestCase: null,
    };
  }
};

const runCode = async (sourceCode, input) => {
  try {
    const data = await callJudge0WithRetry({
      method: "POST",
      url: "https://ce.judge0.com/submissions?base64_encoded=true&wait=true",
      data: {
        language_id: 54, // C++
        source_code: Buffer.from(sourceCode).toString("base64"),
        stdin: Buffer.from(input).toString("base64"),
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error("Final Judge0 Failure:", error.message);
    return { error: "Execution Error" };
  }
};

module.exports = {
  evaluateSubmission,
};