import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { submissionsAPI } from "../services/api";

/**
 * Submission — dedicated page for viewing a single submission result.
 * Route: /submission/:submissionId
 */
function Submission() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await submissionsAPI.getById(submissionId);
        setSubmission(res.data);
      } catch (err) {
        setError("Submission not found or you don't have permission to view it.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [submissionId]);

  const statusColor = (s) => {
    if (s === "Accepted") return "var(--color-green)";
    if (s === "Pending") return "var(--color-yellow)";
    return "var(--color-red)";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      <Navbar />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
          style={{ marginBottom: "24px", padding: "8px 16px", fontSize: "13px" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            background: "linear-gradient(135deg, #e6edf3, #8b949e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Submission Details
        </h1>

        {loading ? (
          <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
            <div className="skeleton" style={{ height: "100px", borderRadius: "12px" }} />
            <div className="skeleton" style={{ height: "60px", borderRadius: "12px" }} />
          </div>
        ) : error ? (
          <div
            style={{
              background: "rgba(248, 81, 73, 0.08)",
              border: "1px solid rgba(248, 81, 73, 0.3)",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              color: "var(--color-red)",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        ) : (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Status card */}
            <div
              style={{
                background: "var(--color-bg-secondary)",
                border: `1px solid ${statusColor(submission.status)}40`,
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${statusColor(submission.status)}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                  }}
                >
                  {submission.status === "Accepted" ? "✅" : "❌"}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: statusColor(submission.status),
                    }}
                  >
                    {submission.status}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                    {new Date(submission.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px",
                }}
              >
                <InfoCell label="Language" value={submission.language?.toUpperCase()} />
                {submission.executionTime && (
                  <InfoCell label="Runtime" value={submission.executionTime} />
                )}
                {submission.memoryUsed != null && (
                  <InfoCell label="Memory" value={`${submission.memoryUsed} KB`} />
                )}
                {submission.failedTestCase != null && (
                  <InfoCell label="Failed Test" value={`#${submission.failedTestCase}`} />
                )}
              </div>
            </div>

            {/* Output card */}
            {submission.output && (
              <div
                style={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "var(--color-bg-tertiary)",
                    padding: "12px 20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  Output / Error Log
                </div>
                <pre
                  style={{
                    padding: "16px 20px",
                    fontSize: "13px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: submission.status === "Accepted" ? "var(--color-green)" : "var(--color-red)",
                    margin: 0,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {submission.output}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        borderRadius: "8px",
        padding: "12px 16px",
        border: "1px solid var(--color-border)",
      }}
    >
      <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "4px", fontWeight: "600" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "var(--color-text-primary)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default Submission;
