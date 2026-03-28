import { useNavigate } from "react-router-dom";

/**
 * Difficulty badge — colored chip for easy/medium/hard.
 */
function DifficultyBadge({ difficulty }) {
  const map = {
    easy: "badge-easy",
    medium: "badge-medium",
    hard: "badge-hard",
  };
  return (
    <span className={map[difficulty?.toLowerCase()] || "badge-easy"}>
      {difficulty}
    </span>
  );
}

/**
 * ProblemCard — row item inside the problem list table.
 * Props: problem { _id, title, difficulty }, index (row number)
 */
function ProblemCard({ problem, index }) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/problems/${problem._id}`);

  return (
    <tr
      onClick={handleClick}
      style={{
        cursor: "pointer",
        transition: "background 0.15s ease",
        borderBottom: "1px solid var(--color-border-muted)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(88, 166, 255, 0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Index */}
      <td
        style={{
          padding: "16px 20px",
          color: "var(--color-text-muted)",
          fontSize: "13px",
          fontWeight: "500",
          width: "60px",
        }}
      >
        {index + 1}
      </td>

      {/* Title */}
      <td style={{ padding: "16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {problem.isSolved && (
            <div
              title="Solved"
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(63, 185, 80, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-green)",
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {!problem.isSolved && (
             <div
               title="Unsolved"
               style={{
                 width: "18px",
                 height: "18px",
                 borderRadius: "50%",
                 border: "1.5px solid var(--color-border)",
                 flexShrink: 0,
               }}
             />
          )}
          <span
            style={{
              fontWeight: "500",
              fontSize: "14px",
              color: "var(--color-text-primary)",
              transition: "color 0.15s",
            }}
          >
            {problem.title}
          </span>
        </div>
      </td>

      {/* Difficulty */}
      <td style={{ padding: "16px 12px" }}>
        <DifficultyBadge difficulty={problem.difficulty} />
      </td>

      {/* Arrow */}
      <td
        style={{
          padding: "16px 20px",
          textAlign: "right",
          color: "var(--color-text-muted)",
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ display: "inline-block" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </td>
    </tr>
  );
}

export { DifficultyBadge };
export default ProblemCard;
