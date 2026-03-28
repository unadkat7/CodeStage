import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { problemsAPI } from "../services/api";
import ProblemCard from "../components/ProblemCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/**
 * Problems — main problem list page.
 * Shows all problems with filter by difficulty and search.
 */
function Problems() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" }); // key: id | title | difficulty


  // Check if we came from a successful registration
  const queryParams = new URLSearchParams(location.search);
  const registered = queryParams.get("registered") === "1";

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await problemsAPI.getAll();
        setProblems(res.data);
      } catch (err) {
        setError("Failed to load problems. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Filter Logic
  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "all" || p.difficulty?.toLowerCase() === diffFilter;
    return matchSearch && matchDiff;
  });

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortConfig.key === "id") {
      return sortConfig.direction === "asc" ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id);
    }
    if (sortConfig.key === "title") {
      return sortConfig.direction === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortConfig.key === "difficulty") {
      const order = { easy: 1, medium: 2, hard: 3 };
      const valA = order[a.difficulty?.toLowerCase()] || 0;
      const valB = order[b.difficulty?.toLowerCase()] || 0;
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Stats
  const counts = {
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      <Navbar />

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* Welcome Banner (after registration) */}


        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              margin: "0 0 8px",
              background: "linear-gradient(135deg, #e6edf3 0%, #8b949e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Problem Set
          </h1>
          <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "15px" }}>
            {problems.length} problems available. Pick one and start coding.
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <StatCard label="Easy" count={counts.easy} color="var(--color-green)" bg="rgba(63, 185, 80, 0.08)" />
          <StatCard label="Medium" count={counts.medium} color="var(--color-yellow)" bg="rgba(210, 153, 34, 0.08)" />
          <StatCard label="Hard" count={counts.hard} color="var(--color-red)" bg="rgba(248, 81, 73, 0.08)" />
        </div>

        {/* Toolbar — Search + Filter */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                pointerEvents: "none",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="problem-search"
              type="text"
              placeholder="Search problems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: "38px" }}
            />
          </div>

          {/* Difficulty filter pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["all", "easy", "medium", "hard"].map((d) => (
              <FilterPill
                key={d}
                active={diffFilter === d}
                onClick={() => setDiffFilter(d)}
                label={d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                color={
                  d === "easy"
                    ? "var(--color-green)"
                    : d === "medium"
                    ? "var(--color-yellow)"
                    : d === "hard"
                    ? "var(--color-red)"
                    : "var(--color-blue)"
                }
              />
            ))}
          </div>
        </div>

        {/* Problem Table */}
        <div
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <SkeletonRows />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState
              hasSearch={!!search || diffFilter !== "all"}
              onClear={() => { setSearch(""); setDiffFilter("all"); }}
            />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    background: "var(--color-bg-tertiary)",
                  }}
                >
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort("id")}>
                    # {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ ...thStyle, textAlign: "left", cursor: "pointer" }} onClick={() => requestSort("title")}>
                    Title {sortConfig.key === "title" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ ...thStyle, textAlign: "left", cursor: "pointer" }} onClick={() => requestSort("difficulty")}>
                    Difficulty {sortConfig.key === "difficulty" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((problem, index) => (
                  <ProblemCard
                    key={problem._id}
                    problem={problem}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p
            style={{
              textAlign: "right",
              color: "var(--color-text-muted)",
              fontSize: "12px",
              marginTop: "12px",
            }}
          >
            Showing {filtered.length} of {problems.length} problems
          </p>
        )}
      </main>
    </div>
  );
}

const thStyle = {
  padding: "12px 20px",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  userSelect: "none",
};

function StatCard({ label, count, color, bg }) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${color}30`,
        borderRadius: "10px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "800",
          color,
        }}
      >
        {count}
      </div>
      <div>
        <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
          {label}
        </div>
        <div
          style={{ fontSize: "14px", fontWeight: "600", color }}
        >{label} Problems</div>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        border: active ? `1px solid ${color}50` : "1px solid var(--color-border)",
        background: active ? `${color}15` : "var(--color-bg-card)",
        color: active ? color : "var(--color-text-secondary)",
        transition: "all 0.15s ease",
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}

function SkeletonRows() {
  return (
    <div style={{ padding: "16px" }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "16px",
            padding: "16px 4px",
            borderBottom: "1px solid var(--color-border-muted)",
          }}
        >
          <div className="skeleton" style={{ width: "30px", height: "18px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ flex: 1, height: "18px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ width: "70px", height: "18px", borderRadius: "20px" }} />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div
      style={{
        padding: "60px 24px",
        textAlign: "center",
        color: "var(--color-red)",
      }}
    >
      <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 12px", opacity: 0.6 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p style={{ fontSize: "14px" }}>{message}</p>
    </div>
  );
}

function EmptyState({ hasSearch, onClear }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 12px", color: "var(--color-text-muted)", opacity: 0.5 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
        {hasSearch ? "No problems match your filters." : "No problems yet."}
      </p>
      {hasSearch && (
        <button onClick={onClear} className="btn-secondary" style={{ fontSize: "13px", padding: "8px 16px" }}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export default Problems;
