import { useNavigate } from "react-router-dom";

function ProblemCard({ problem }) {
  const navigate = useNavigate();

  return (
    <div
      className="border p-4 cursor-pointer"
      onClick={() => navigate(`/problems/${problem._id}`)}
    >
      <h2 className="font-bold">{problem.title}</h2>
      <p>Difficulty: {problem.difficulty}</p>
    </div>
  );
}

export default ProblemCard;
