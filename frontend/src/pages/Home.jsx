import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { problemsAPI } from "../services/api";
import ProblemCard from "../components/ProblemCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/**
 * Home — personal dashboard and introduction page.
 * Shows a hero section, site stats, and a small curated list of problems.
 */
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await problemsAPI.getAll();
        setProblems(res.data);
      } catch (err) {
        setError("Failed to load featured problems.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Curate 2 Easy, 2 Medium, 1 Hard
  const curated = (() => {
    const easy = problems.filter(p => p.difficulty?.toLowerCase() === "easy").slice(0, 2);
    const medium = problems.filter(p => p.difficulty?.toLowerCase() === "medium").slice(0, 2);
    const hard = problems.filter(p => p.difficulty?.toLowerCase() === "hard").slice(0, 1);
    return [...easy, ...medium, ...hard];
  })();

  // Calculate Stats
  const stats = (() => {
    const total = problems.length;
    const solved = problems.filter(p => p.isSolved).length;
    const easySolved = problems.filter(p => p.difficulty?.toLowerCase() === "easy" && p.isSolved).length;
    const mediumSolved = problems.filter(p => p.difficulty?.toLowerCase() === "medium" && p.isSolved).length;
    const hardSolved = problems.filter(p => p.difficulty?.toLowerCase() === "hard" && p.isSolved).length;
    
    return {
      total,
      solved,
      remaining: total - solved,
      rate: total > 0 ? Math.round((solved / total) * 100) : 0,
      easy: easySolved,
      medium: mediumSolved,
      hard: hardSolved
    };
  })();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      <Navbar />

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 24px" }}>
        {/* Hero Section */}
        <section className="fade-in" style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ 
            fontSize: "48px", 
            fontWeight: "800", 
            letterSpacing: "-0.04em", 
            marginBottom: "16px",
            background: "linear-gradient(135deg, #fff 0%, #8b949e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ 
            fontSize: "18px", 
            color: "var(--color-text-secondary)", 
            maxWidth: "600px", 
            margin: "0 auto 32px" 
          }}>
            Sharpen your coding skills, master algorithms, and track your progress all in one place. Ready for your next challenge?
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button onClick={() => navigate("/problems")} className="btn-primary" style={{ padding: "12px 28px", fontSize: "16px" }}>
              Browse All Problems
            </button>
            <button onClick={() => window.open("https://github.com", "_blank")} className="btn-secondary" style={{ padding: "12px 28px", fontSize: "16px" }}>
              Learn More
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px", 
          marginBottom: "80px" 
        }}>
          <InfoCard 
            title="Total Solved" 
            value={stats.solved} 
            desc={`${stats.remaining} problems left to solve`} 
            icon={<svg width="24" height="24" fill="none" stroke="var(--color-green)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          
          <div className="card-hover" style={{ 
            background: "var(--color-bg-secondary)", 
            border: "1px solid var(--color-border)", 
            borderRadius: "12px", 
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Difficulty Split</span>
              <svg width="20" height="20" fill="none" stroke="var(--color-purple)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <DifficultyStat label="Easy" solved={stats.easy} color="var(--color-green)" />
              <DifficultyStat label="Med" solved={stats.medium} color="var(--color-yellow)" />
              <DifficultyStat label="Hard" solved={stats.hard} color="var(--color-red)" />
            </div>
          </div>

          <div className="card-hover" style={{ 
            background: "var(--color-bg-secondary)", 
            border: "1px solid var(--color-border)", 
            borderRadius: "12px", 
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Completion Rate</span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-blue)" }}>{stats.rate}%</span>
            </div>
            <div style={{ position: "relative", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ 
                position: "absolute", 
                left: 0, 
                top: 0, 
                height: "100%", 
                width: `${stats.rate}%`, 
                background: "var(--color-blue)", 
                borderRadius: "4px",
                transition: "width 1s ease-out" 
              }} />
            </div>
            <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--color-text-muted)" }}>
              {stats.solved} / {stats.total} challenges completed
            </div>
          </div>
        </section>

        {/* Curated Problems */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>Daily Challenges</h2>
              <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>A balanced set of problems to keep you sharp.</p>
            </div>
            <Link to="/problems" style={{ color: "var(--color-blue)", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              Explore more →
            </Link>
          </div>

          <div style={{ 
            background: "var(--color-bg-secondary)", 
            border: "1px solid var(--color-border)", 
            borderRadius: "12px", 
            overflow: "hidden" 
          }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>Loading featured problems...</div>
            ) : curated.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>No problems found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-tertiary)" }}>
                    <th style={thStyle}>#</th>
                    <th style={{ ...thStyle, textAlign: "left" }}>Title</th>
                    <th style={{ ...thStyle, textAlign: "left" }}>Difficulty</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {curated.map((problem, index) => (
                    <ProblemCard key={problem._id} problem={problem} index={index} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div style={{ marginTop: "24px", textAlign: "center" }}>
             <button onClick={() => navigate("/problems")} className="btn-secondary" style={{ width: "100%", padding: "14px", fontWeight: "600" }}>
                Explore All {problems.length} Problems
             </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ title, value, desc, icon }) {
  return (
    <div className="card-hover" style={{ 
      background: "var(--color-bg-secondary)", 
      border: "1px solid var(--color-border)", 
      borderRadius: "12px", 
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--color-text-primary)" }}>{value}</div>
        <div style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{desc}</div>
      </div>
    </div>
  );
}

function DifficultyStat({ label, solved, color }) {
  return (
    <div style={{ flex: 1, textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
       <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "4px" }}>{label}</div>
       <div style={{ fontSize: "18px", fontWeight: "700", color: color }}>{solved}</div>
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
};

export default Home;
