/**
 * SubmissionPanel — Terminal-style result display with Brutalist design.
 * Sharp edges, high contrast, pure black/accent colors.
 */
function SubmissionPanel({ submission, isPolling, isRunning }) {

  // ── Not yet submitted ──────────────────────────────────────────
  if (!submission) {
    return (
      <div
        style={{
          border: "1px dashed var(--border)",
          padding: "32px 20px",
          textAlign: "center",
          color: "var(--text-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
        }}
      >
        <div style={{ color: "var(--text-muted)", fontWeight: "700" }}>// NO_OUTPUT_RECORDED</div>
        <div style={{ marginTop: "4px", opacity: 0.5 }}>awaiting run or submit command...</div>
      </div>
    );
  }

  // ── Polling / Running / Pending ────────────────────────────────
  if (isPolling || isRunning || submission.status === "Pending") {
    return (
      <div
        style={{
          border: "1px solid var(--accent)",
          background: "var(--accent-muted)",
          padding: "16px 20px",
          borderLeft: "4px solid var(--accent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="spinner" />
          <div>
            <div style={{ fontWeight: "800", fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              {isRunning ? "EXEC_IN_PROGRESS" : "JUDGING_IN_PROGRESS"}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-dim)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
              // EVALUATING_SYSTEM_RESPONSE...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result display ────────────────────────────────────────────
  const status = submission.status;
  const isAccepted = status === "Accepted";
  const isCompileError = status === "Compilation Error";
  const isRuntimeError = status === "Runtime Error";

  const theme = isAccepted
    ? { border: "var(--green)", color: "var(--green)", bg: "var(--success-muted)" }
    : { border: "var(--red)", color: "var(--red)", bg: "var(--error-muted)" };

  return (
    <div
      style={{
        border: `1px solid var(--border)`,
        background: "#000",
        overflow: "hidden",
        borderLeft: `4px solid ${theme.border}`,
      }}
    >
      {/* ── Status header ── */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid var(--border)`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: theme.bg,
        }}
      >
        <div style={{ fontWeight: "900", fontSize: "14px", color: theme.color, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
          [{status}]
        </div>
        {submission._id && (
          <div style={{ fontSize: "9px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", opacity: 0.6 }}>
            ID: {submission._id}
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      {(submission.executionTime || submission.memoryUsed !== undefined || submission.language) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0",
            background: "var(--border)",
            borderBottom: `1px solid var(--border)`,
          }}
        >
          {submission.executionTime && (
            <StatCell label="RUNTIME" value={submission.executionTime} />
          )}
          {submission.memoryUsed !== undefined && submission.memoryUsed !== null && (
            <StatCell label="MEMORY" value={`${submission.memoryUsed} KB`} />
          )}
          {submission.language && (
            <StatCell label="LANG" value={submission.language.toUpperCase()} />
          )}
          {submission.failedTestCase !== undefined && submission.failedTestCase !== null && (
            <StatCell label="FAILED_ON" value={`#${submission.failedTestCase}`} color="var(--red)" />
          )}
        </div>
      )}

      {/* ── Output / Error ── */}
      {submission.output && (
        <div style={{ padding: "12px 16px" }}>
          <div
            style={{
              fontSize: "9px",
              fontWeight: "800",
              color: "var(--text-muted)",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            {">_ "}{isCompileError ? "COMPILER_LOG" : isRuntimeError ? "RUNTIME_LOG" : "STDOUT"}
          </div>
          <pre
            style={{
              background: "#050505",
              border: "1px solid var(--border)",
              padding: "12px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              color: isAccepted ? "var(--green)" : "var(--red)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              maxHeight: "220px",
              overflowY: "auto",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {submission.output}
          </pre>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, value, color = "var(--text)" }) {
  return (
    <div style={{ background: "#000", padding: "8px 16px", flex: "1 1 auto", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: "9px", color: "var(--text-dim)", marginBottom: "2px", fontWeight: "700" }}>
        {label}
      </div>
      <div style={{ fontSize: "12px", fontWeight: "800", color: color, fontFamily: "var(--font-mono)" }}>
        {value}
      </div>
    </div>
  );
}

export default SubmissionPanel;
