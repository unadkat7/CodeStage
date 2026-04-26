import { useEffect, useState } from "react";
import { leaderboardAPI } from "../services/api";
import Navbar from "../components/Navbar";
import RouteLoader from "../components/RouteLoader";

const BACKEND_URL = "http://localhost:5000";

/**
 * Leaderboard — Brutalist leaderboard page with two sections:
 *  1. GLOBAL_ELITE: Top 10 users overall (most unique problems solved)
 *  2. DAILY_STRIKERS: Today's top performers
 */
function Leaderboard() {
  const [overall, setOverall] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overallRes, dailyRes] = await Promise.all([
          leaderboardAPI.getOverall(),
          leaderboardAPI.getDaily(),
        ]);
        setOverall(overallRes.data);
        setDaily(dailyRes.data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <RouteLoader />;

  return (
    <div className="min-h-screen bg-mesh-brutal flex flex-col font-mono text-white">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">

        {/* ── Header ── */}
        <header className="mb-10 border-l-4 border-accent pl-5">
          <div className="text-[10px] text-text-dim font-black mb-1 uppercase tracking-widest">
            RANKING_MODULE // COMPETITIVE_INTEL
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            LEADER<span className="text-accent">BOARD</span>
          </h1>
          <div className="mt-2 text-xs text-text-muted font-bold tracking-tight">
            STATUS: [GLOBAL_RANKED: {overall.length}] [DAILY_ACTIVE: {daily.length}]
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ═══════════════════════════════════════════════════════════
           *  SECTION 1 — GLOBAL ELITE (Top 10 Overall)
           * ═══════════════════════════════════════════════════════════ */}
          <section>
            <div className="card-brutal overflow-hidden">
              <div className="terminal-header flex items-center justify-between">
                <span>GLOBAL_ELITE // ALL_TIME_TOP_10</span>
                <span className="text-accent text-[9px]">◆ LIFETIME</span>
              </div>

              {overall.length === 0 ? (
                <EmptyState message="NO_RANKED_OPERATIVES_FOUND" />
              ) : (
                <div className="divide-y divide-border">
                  {overall.map((entry, index) => (
                    <LeaderboardRow
                      key={entry.userId}
                      entry={entry}
                      rank={index + 1}
                      isTopThree={index < 3}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════
           *  SECTION 2 — DAILY STRIKERS (Today's Top)
           * ═══════════════════════════════════════════════════════════ */}
          <section>
            <div className="card-brutal overflow-hidden">
              <div className="terminal-header flex items-center justify-between">
                <span>DAILY_STRIKERS // TODAY&apos;S_ELITE</span>
                <span className="text-success text-[9px] animate-pulse">● LIVE</span>
              </div>

              {daily.length === 0 ? (
                <EmptyState message="NO_ACTIVITY_RECORDED_TODAY" />
              ) : (
                <div className="divide-y divide-border">
                  {daily.map((entry, index) => (
                    <LeaderboardRow
                      key={entry.userId}
                      entry={entry}
                      rank={index + 1}
                      isTopThree={index < 3}
                      isDaily
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="p-6 border-t border-border text-center text-[10px] text-text-dim font-black tracking-[0.2em]">
        CODESTAGE_V4.0 // RANKING_MODULE // © 2026
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════ */

function LeaderboardRow({ entry, rank, isTopThree, isDaily }) {
  const rankColors = {
    1: "text-yellow-400 border-yellow-400",
    2: "text-gray-300 border-gray-300",
    3: "text-amber-600 border-amber-600",
  };

  const rankClass = isTopThree
    ? rankColors[rank]
    : "text-text-dim border-border";

  const medalIcons = { 1: "◆", 2: "◇", 3: "▸" };

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition-all duration-150 group
        ${isTopThree ? "bg-surface/60 hover:bg-surface" : "hover:bg-surface/30"}
      `}
    >
      {/* Rank Badge */}
      <div
        className={`shrink-0 w-10 h-10 border-2 flex items-center justify-center font-black text-sm
          ${rankClass} ${isTopThree ? "bg-black" : "bg-transparent"}
        `}
      >
        {isTopThree ? medalIcons[rank] : `#${rank}`}
      </div>

      {/* Avatar */}
      <div className="shrink-0 w-14 h-14 bg-surface border-2 border-border flex items-center justify-center text-2xl font-black text-accent overflow-hidden">
        {entry.profilePicture ? (
          <img
            src={
              entry.profilePicture.startsWith("http")
                ? entry.profilePicture
                : `${BACKEND_URL}${entry.profilePicture}`
            }
            alt={entry.name}
            className="w-full h-full object-cover"
          />
        ) : (
          entry.name?.[0]?.toUpperCase() || "?"
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-accent transition-colors">
          {entry.name}
        </div>
        <div className="text-[10px] text-text-dim font-bold tracking-widest mt-1">
          {isDaily ? "TODAY_SOLVES" : "TOTAL_SOLVES"}
        </div>
      </div>

      {/* Solved Count */}
      <div className="shrink-0 text-right">
        <div
          className={`text-2xl font-black leading-none ${
            isTopThree ? "text-accent" : "text-white"
          }`}
        >
          {entry.solvedCount}
        </div>
        <div className="text-[8px] text-text-dim font-black tracking-widest mt-1">
          SOLVED
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="p-12 text-center">
      <div className="text-2xl text-text-dim mb-3">◇</div>
      <div className="text-[10px] font-black text-text-dim tracking-widest">
        {message}
      </div>
      <div className="text-[9px] text-text-dim mt-1 font-bold">
        Solve problems to appear on the leaderboard.
      </div>
    </div>
  );
}

export default Leaderboard;
