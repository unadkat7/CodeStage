import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import CodeEditor from "../components/CodeEditor";
import SubmissionPanel from "../components/SubmissionPanel";

function ProblemDetails() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Failed to fetch problem");
      }
    };

    fetchProblem();
  }, [id]);

  const startPolling = (submissionId) => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/submissions/${submissionId}`);

        const data = res.data;

        console.log("Polling result:", data);

        if (data.status !== "Pending") {
          clearInterval(interval);

          setSubmission(data); // update UI

          console.log("Final Result:", data);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post("/submissions", {
        problemId: id,
        code,
        language,
      });
      setSubmission({
        status: res.data.status,
        _id: res.data.submissionId,
      });

      console.log("Submission created:", res.data);

      const submissionId = res.data.submissionId;

      //Start polling for results
      startPolling(submissionId);
    } catch (err) {
      console.error("Submission failed");
    }
  };

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      {/* LEFT SIDE — PROBLEM */}
      <div className="w-1/2 p-6">
        <h1 className="text-2xl font-bold">{problem.title}</h1>

        <p className="mt-2">Difficulty: {problem.difficulty}</p>

        <div className="mt-6">
          <h2 className="font-semibold">Description</h2>
          <p>{problem.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">Sample Input</h2>
          <pre className="bg-gray-100 p-3">{problem.sampleInput}</pre>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">Sample Output</h2>
          <pre className="bg-gray-100 p-3">{problem.sampleOutput}</pre>
        </div>
      </div>

      {/* RIGHT SIDE — EDITOR */}
      <div className="w-1/2 p-6">
        <CodeEditor code={code} setCode={setCode} />

        <div className="mt-4 flex gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Submit
          </button>

          <SubmissionPanel submission={submission} />
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;
