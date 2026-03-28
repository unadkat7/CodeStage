import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { problemsAPI, submissionsAPI } from "../services/api";
import CodeEditor, { LANGUAGES, STARTER_CODE } from "../components/CodeEditor";
import SubmissionPanel from "../components/SubmissionPanel";
import Navbar from "../components/Navbar";
import { DifficultyBadge } from "../components/ProblemCard";

/**
 * Polling interval in milliseconds
 */
const POLL_INTERVAL = 2000;

/**
 * ProblemDetails — full split-panel problem page.
 * Left: problem description, sample I/O, visible test cases, submission history.
 * Right: Monaco editor, language selector, submit button, result panel.
 */
function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data
  const [problem, setProblem] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  // Editor
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(STARTER_CODE[LANGUAGES[0].id]);

  // Submission
  const [submission, setSubmission] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description"); // description | testcases | history
  const [activePanel, setActivePanel] = useState("result"); // result (right bottom tab)

  // Resizing state
  const [leftWidth, setLeftWidth] = useState(45); // percentage
  const [topHeight, setTopHeight] = useState(65); // percentage
  const [isResizingH, setIsResizingH] = useState(false);
  const [isResizingV, setIsResizingV] = useState(false);

  // Refs for polling and containers
  const pollRef = useRef(null);
  const containerRef = useRef(null);
  const rightPanelRef = useRef(null);

  // ── Fetch problem data ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [probRes, statsRes, histRes] = await Promise.allSettled([
          problemsAPI.getById(id),
          problemsAPI.getStats(id),
          submissionsAPI.getHistory(id),
        ]);

        if (probRes.status === "fulfilled") setProblem(probRes.value.data);
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        if (histRes.status === "fulfilled") setHistory(histRes.value.data);
      } catch (_) {
        // Handled via null checks below
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    return () => {
      // Cleanup polling on unmount / route change
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [id]);

  // ── Language change → reset to starter code ────────────────────────────────
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang] || "");
  };

  // ── Polling logic ──────────────────────────────────────────────────────────
  const startPolling = useCallback((submissionId) => {
    setIsPolling(true);

    pollRef.current = setInterval(async () => {
      try {
        const res = await submissionsAPI.getById(submissionId);
        const data = res.data;

        if (data.status !== "Pending") {
          clearInterval(pollRef.current);
          setIsPolling(false);
          setSubmission(data);

          // Refresh history + stats after result arrives
          const [histRes, statsRes] = await Promise.allSettled([
            submissionsAPI.getHistory(id),
            problemsAPI.getStats(id),
          ]);
          if (histRes.status === "fulfilled") setHistory(histRes.value.data);
          if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        }
      } catch {
        clearInterval(pollRef.current);
        setIsPolling(false);
      }
    }, POLL_INTERVAL);
  }, [id]);

  // ── Submit code ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!code.trim()) {
      setSubmitError("Please write some code before submitting.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    setSubmission(null);
    setActivePanel("result");

    try {
      const res = await submissionsAPI.create({
        problemId: id,
        code,
        language,
      });

      // Immediately show "Pending" state
      setSubmission({ status: "Pending", _id: res.data.submissionId });
      startPolling(res.data.submissionId);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  // ── Resizing Logic ─────────────────────────────────────────────────────────
  const startResizingH = useCallback(() => setIsResizingH(true), []);
  const startResizingV = useCallback(() => setIsResizingV(true), []);
  const stopResizing = useCallback(() => {
    setIsResizingH(false);
    setIsResizingV(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizingH && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
    }
    if (isResizingV && rightPanelRef.current) {
      const rightRect = rightPanelRef.current.getBoundingClientRect();
      const newHeight = ((e.clientY - rightRect.top) / rightRect.height) * 100;
      if (newHeight > 20 && newHeight < 85) setTopHeight(newHeight);
    }
  }, [isResizingH, isResizingV]);

  useEffect(() => {
    if (isResizingH || isResizingV) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizingH, isResizingV, resize, stopResizing]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
        <Navbar />
        <FullPageSkeleton />
      </div>
    );
  }

  // ── Problem not found ────────────────────────────────────────────────────────
  if (!problem) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "16px",
          }}
        >
          <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--color-text-primary)" }}>Problem not found</h2>
          <button className="btn-secondary" onClick={() => navigate("/problems")}>← Back to Problems</button>
        </div>
      </div>
    );
  }

  // ── Main layout ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          height: "calc(100vh - 61px)",
          position: "relative",
          userSelect: (isResizingH || isResizingV) ? "none" : "auto",
        }}
      >
        {/* ── LEFT PANEL: Problem ───────────────────────────────────────────── */}
        <div
          style={{
            width: `${leftWidth}%`,
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "var(--color-bg-primary)",
          }}
        >
          {/* Problem header */}
          <div
            style={{
              padding: "20px 24px 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                  margin: 0,
                  flex: 1,
                  lineHeight: "1.4",
                }}
              >
                {problem.title}
              </h1>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>

            {/* Stats row */}
            {stats && (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                }}
              >
                <StatChip
                  label="Submissions"
                  value={stats.totalSubmissions}
                  icon="📨"
                />
                <StatChip
                  label="Accepted"
                  value={stats.acceptedSubmissions}
                  color="var(--color-green)"
                  icon="✅"
                />
                <StatChip
                  label="Acceptance"
                  value={stats.acceptanceRate}
                  color="var(--color-blue)"
                  icon="📊"
                />
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0" }}>
              {["description", "testcases", "history"].map((tab) => (
                <TabButton
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "description" ? "Description" : tab === "testcases" ? "Test Cases" : `History (${history.length})`}
                </TabButton>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
            {activeTab === "description" && (
              <DescriptionTab problem={problem} />
            )}
            {activeTab === "testcases" && (
              <TestCasesTab testCases={problem.testCases} />
            )}
            {activeTab === "history" && (
              <HistoryTab history={history} />
            )}
          </div>
        </div>

        {/* Horizontal Resizer (Vertical bar) */}
        <div
          onMouseDown={startResizingH}
          style={{
            width: "4px",
            cursor: "col-resize",
            background: isResizingH ? "var(--color-blue)" : "transparent",
            transition: "background 0.2s",
            zIndex: 10,
            borderLeft: "1px solid var(--color-border)",
          }}
          onMouseEnter={(e) => { if (!isResizingH) e.target.style.background = "rgba(88, 166, 255, 0.3)"; }}
          onMouseLeave={(e) => { if (!isResizingH) e.target.style.background = "transparent"; }}
        />

        {/* ── RIGHT PANEL: Editor & Results ─────────────────────────────────── */}
        <div
          ref={rightPanelRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
            background: "var(--color-bg-primary)",
          }}
        >
          {/* Editor toolbar */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "var(--color-bg-secondary)",
              flexWrap: "wrap",
            }}
          >
            {/* Language selector */}
            <select
              id="language-selector"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                padding: "7px 12px",
                borderRadius: "7px",
                fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: "500",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                paddingRight: "28px",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b949e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "14px",
                minWidth: "140px",
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Reset code */}
            <button
              id="reset-code-btn"
              onClick={() => setCode(STARTER_CODE[language] || "")}
              className="btn-secondary"
              style={{ padding: "7px 14px", fontSize: "13px" }}
              title="Reset to starter code"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            {/* Submit button */}
            <button
              id="submit-code-btn"
              onClick={handleSubmit}
              disabled={submitting || isPolling}
              className="btn-primary"
              style={{ padding: "7px 20px", fontSize: "13px" }}
            >
              {submitting || isPolling ? (
                <>
                  <div className="spinner" style={{ width: "14px", height: "14px" }} />
                  {submitting ? "Submitting…" : "Judging…"}
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Submit
                </>
              )}
            </button>
          </div>

          {/* Monaco Editor */}
          <div style={{ height: `${topHeight}%`, minHeight: "150px", display: "flex", flexDirection: "column", padding: "0 20px 10px" }}>
            <CodeEditor code={code} setCode={setCode} language={language} height="100%" />
          </div>

          {/* Vertical Resizer (Horizontal bar) */}
          <div
            onMouseDown={startResizingV}
            style={{
              height: "4px",
              cursor: "row-resize",
              background: isResizingV ? "var(--color-blue)" : "transparent",
              transition: "background 0.2s",
              zIndex: 10,
              borderTop: "1px solid var(--color-border)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (!isResizingV) e.target.style.background = "rgba(88, 166, 255, 0.3)"; }}
            onMouseLeave={(e) => { if (!isResizingV) e.target.style.background = "transparent"; }}
          />

          {/* Submit error banner */}
          {submitError && (
            <div
              className="fade-in"
              style={{
                margin: "0 20px",
                background: "rgba(248, 81, 73, 0.08)",
                border: "1px solid rgba(248, 81, 73, 0.3)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "var(--color-red)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {submitError}
            </div>
          )}

          {/* Result panel */}
          <div
            style={{
              flex: 1,
              padding: "16px 20px",
              overflow: "auto",
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              minHeight: "120px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "12px",
              }}
            >
              Result
            </div>
            <SubmissionPanel submission={submission} isPolling={isPolling} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        border: "none",
        background: "transparent",
        color: active ? "var(--color-blue)" : "var(--color-text-muted)",
        borderBottom: active ? "2px solid var(--color-blue)" : "2px solid transparent",
        transition: "all 0.15s",
        marginBottom: "-1px",
      }}
    >
      {children}
    </button>
  );
}

function StatChip({ label, value, color = "var(--color-text-secondary)", icon }) {
  return (
    <span style={{ fontSize: "12px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
      {icon}{" "}
      <span style={{ color, fontWeight: "600" }}>{value}</span>{" "}
      {label}
    </span>
  );
}

function DescriptionTab({ problem }) {
  return (
    <div className="fade-in">
      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.75",
          color: "var(--color-text-primary)",
          marginBottom: "24px",
          whiteSpace: "pre-wrap",
        }}
      >
        {problem.description}
      </div>

      {problem.sampleInput && (
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--color-text-muted)",
              marginBottom: "8px",
            }}
          >
            Sample Input
          </h3>
          <pre
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "14px 16px",
              fontSize: "13px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--color-text-primary)",
              overflow: "auto",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            {problem.sampleInput}
          </pre>
        </div>
      )}

      {problem.sampleOutput && (
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--color-text-muted)",
              marginBottom: "8px",
            }}
          >
            Sample Output
          </h3>
          <pre
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "14px 16px",
              fontSize: "13px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--color-green)",
              overflow: "auto",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            {problem.sampleOutput}
          </pre>
        </div>
      )}
    </div>
  );
}

function TestCasesTab({ testCases }) {
  if (!testCases || testCases.length === 0) {
    return (
      <div className="fade-in" style={{ color: "var(--color-text-muted)", fontSize: "14px", paddingTop: "20px" }}>
        No visible test cases for this problem.
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {testCases.map((tc, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--color-bg-tertiary)",
              padding: "8px 14px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--color-text-muted)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            Test Case {i + 1}
          </div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "4px", fontWeight: "600" }}>INPUT</div>
              <pre
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--color-text-primary)",
                  margin: 0,
                  overflow: "auto",
                }}
              >
                {tc.input}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "4px", fontWeight: "600" }}>EXPECTED OUTPUT</div>
              <pre
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid rgba(63, 185, 80, 0.2)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--color-green)",
                  margin: 0,
                  overflow: "auto",
                }}
              >
                {tc.output}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="fade-in" style={{ paddingTop: "20px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "14px" }}>
        <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 10px", opacity: 0.4 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        No submissions yet for this problem.
      </div>
    );
  }

  const statusColor = (s) => {
    if (s === "Accepted") return "var(--color-green)";
    if (s === "Pending") return "var(--color-yellow)";
    return "var(--color-red)";
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {history.map((sub) => (
        <div
          key={sub._id}
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            padding: "12px 16px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: statusColor(sub.status),
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontWeight: "600", fontSize: "13px", color: statusColor(sub.status) }}>
                {sub.status}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  background: "var(--color-bg-tertiary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  color: "var(--color-text-muted)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {sub.language?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>
              {sub.executionTime && `${sub.executionTime} ms`}
              {sub.executionTime && sub.memoryUsed ? " · " : ""}
              {sub.memoryUsed ? `${sub.memoryUsed} KB` : ""}
              {(sub.executionTime || sub.memoryUsed) ? " · " : ""}
              {new Date(sub.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FullPageSkeleton() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        height: "calc(100vh - 61px)",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "45%", borderRight: "1px solid var(--color-border)", padding: "24px" }}>
        <div className="skeleton" style={{ height: "28px", width: "60%", marginBottom: "16px" }} />
        <div className="skeleton" style={{ height: "18px", width: "30%", marginBottom: "24px" }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "14px", marginBottom: "10px", width: `${70 + (i % 3) * 10}%` }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: "16px" }}>
        <div className="skeleton" style={{ height: "380px", borderRadius: "10px" }} />
      </div>
    </div>
  );
}

export default ProblemDetails;
