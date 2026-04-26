import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Navbar — Refactored to clean Tailwind CSS.
 */
function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b-2 border-border h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        
        {/* ── Logo ── */}
        <Link to="/home" className="flex items-center gap-3 no-underline group">
          <div className="bg-accent text-black p-1.5 font-black text-lg transition-transform group-hover:scale-110">
            {">_"}
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase">
            CODESTAGE
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div className="flex items-center gap-8">
          <NavLink to="/home" label="HOME" />
          <NavLink to="/problems" label="PROBLEMS" />
          <NavLink to="/leaderboard" label="LEADERBOARD" />
          <NavLink to="/profile" label="PROFILE" />
        </div>

        {/* ── User Actions ── */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-border px-3 py-1.5 bg-surface text-[10px] font-black">
                <span className="text-text-dim uppercase tracking-widest">USER:</span>
                <span className="text-accent">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-brutal-secondary h-8 px-4"
              >
                SIGN_OUT
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-text-dim hover:text-accent font-black text-[11px] uppercase tracking-widest transition-colors flex items-center gap-2 group"
    >
      <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">[</span>
      {label}
      <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">]</span>
    </Link>
  );
}

export default Navbar;
