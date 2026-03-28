/**
 * SubmissionPanel — Displays the result of the latest submission.
 *
 * Props:
 *   submission  — latest submission object (or null when not yet submitted)
 *   isPolling   — boolean, true while waiting for result (submit)
 *   isRunning   — boolean, true while waiting for result (run)
 */
function SubmissionPanel({ submission, isPolling, isRunning }) {
  // ── Not yet submitted ──────────────────────────────────────────────────────
  if (!submission) {
    return (
      <div
        className="fade-in"
        style={{
          border: "1px dashed var(--color-border)",
          borderRadius: "10px",
          padding: "40px 24px",
          textAlign: "center",
          color: "var(--color-text-muted)",
        }}
      >
        <svg
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ margin: "0 auto 12px", opacity: 0.4 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p style={{ fontSize: "14px", fontWeight: "500" }}>No submission yet</p>
        <p style={{ fontSize: "12px", marginTop: "4px" }}>
          Write your solution and click Submit
        </p>
      </div>
    );
  }

  // ── Polling / Pending / Running ───────────────────────────────────────────
  if (isPolling || isRunning || submission.status === "Pending") {
    return (
      <div
        className="fade-in"
        style={{
          border: "1px solid rgba(210, 153, 34, 0.3)",
          borderRadius: "10px",
          padding: "28px 24px",
          background: "rgba(210, 153, 34, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div className="spinner" />
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "15px",
                color: "var(--color-yellow)",
              }}
            >
              {isRunning ? "Running Code…" : "Evaluating…"}
            </div>
            <div
              style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}
            >
              Your code is being judged. Please wait.
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div
          style={{
            height: "3px",
            borderRadius: "2px",
            background: "rgba(210, 153, 34, 0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "40%",
              background: "var(--color-yellow)",
              borderRadius: "2px",
              animation: "progress 1.5s ease-in-out infinite alternate",
            }}
          />
        </div>
        <style>{`
          @keyframes progress {
            from { width: 10%; margin-left: 0; }
            to { width: 60%; margin-left: 30%; }
          }
        `}</style>
      </div>
    );
  }

  // ── Determine status theme ─────────────────────────────────────────────────
  const status = submission.status;
  const isAccepted = status === "Accepted";
  const isWrong = status === "Wrong Answer";
  const isCompileError = status === "Compilation Error";
  const isRuntimeError = status === "Runtime Error";
  const isTLE = status === "Time Limit Exceeded";

  const statusTheme = isAccepted
    ? {
        border: "rgba(63, 185, 80, 0.3)",
        bg: "rgba(63, 185, 80, 0.05)",
        color: "var(--color-green)",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      }
    : {
        border: "rgba(248, 81, 73, 0.3)",
        bg: "rgba(248, 81, 73, 0.05)",
        color: "var(--color-red)",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };

  return (
    <div
      className="fade-in"
      style={{
        border: `1px solid ${statusTheme.border}`,
        borderRadius: "10px",
        background: statusTheme.bg,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${statusTheme.border}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ color: statusTheme.color }}>{statusTheme.icon}</span>
        <div>
          <div
            style={{
              fontWeight: "700",
              fontSize: "16px",
              color: statusTheme.color,
            }}
          >
            {status}
          </div>
          {submission._id && (
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
              ID: {submission._id}
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "1px",
          background: statusTheme.border,
        }}
      >
        {submission.executionTime && (
          <StatCell
            label="Runtime"
            value={submission.executionTime}
            icon="⏱"
          />
        )}
        {submission.memoryUsed !== undefined && submission.memoryUsed !== null && (
          <StatCell
            label="Memory"
            value={`${submission.memoryUsed} KB`}
            icon="💾"
          />
        )}
        {submission.language && (
          <StatCell
            label="Language"
            value={submission.language.toUpperCase()}
            icon="🔤"
          />
        )}
        {submission.failedTestCase !== undefined &&
          submission.failedTestCase !== null && (
            <StatCell
              label="Failed on"
              value={`Test #${submission.failedTestCase}`}
              icon="❌"
            />
          )}
      </div>

      {/* Output / Error */}
      {submission.output && (
        <div style={{ padding: "16px 20px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--color-text-muted)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {isCompileError
              ? "Compiler Output"
              : isRuntimeError
              ? "Runtime Output"
              : "Output"}
          </div>
          <pre
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              padding: "12px 16px",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              color: isAccepted ? "var(--color-green)" : "var(--color-red)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              maxHeight: "200px",
              overflowY: "auto",
              margin: 0,
            }}
          >
            {submission.output}
          </pre>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, value, icon }) {
  return (
    <div
      style={{
        background: "var(--color-bg-primary)",
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "var(--color-text-muted)",
          marginBottom: "4px",
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--color-text-primary)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default SubmissionPanel;
