import { useEffect, useState } from "react";
import API from "../services/api";
import ProblemCard from "../components/ProblemCard";

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get("/problems");
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problems");
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Problems</h1>

      <div className="flex flex-col gap-4">
        {problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} />
        ))}
      </div>
    </div>
  );
}

export default Problems;
