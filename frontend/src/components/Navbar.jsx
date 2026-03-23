import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar — top navigation bar for all authenticated pages.
 * Shows logo, nav links, and user info/logout.
 */
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav
      style={{
        background: "rgba(13, 17, 23, 0.95)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <Link
          to="/problems"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #1f6feb, #8957e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "800",
              color: "white",
              boxShadow: "0 0 12px rgba(56, 139, 253, 0.4)",
            }}
          >
            C
          </div>
          <span
            style={{
              fontWeight: "700",
              fontSize: "18px",
              background: "linear-gradient(135deg, #58a6ff, #bc8cff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            CodeStage
          </span>
        </Link>

        {/* Center links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <NavLink to="/problems" active={isActive("/problems")}>
            Problems
          </NavLink>
        </div>

        {/* Right side — user info */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1f6feb, #8957e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ lineHeight: "1.2" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    textTransform: "capitalize",
                  }}
                >
                  {user.role}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-red)";
              e.currentTarget.style.borderColor = "rgba(248, 81, 73, 0.5)";
              e.currentTarget.style.background = "rgba(248, 81, 73, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-secondary)";
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.background = "var(--color-bg-card)";
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      style={{
        padding: "6px 14px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        textDecoration: "none",
        transition: "all 0.2s",
        color: active ? "var(--color-blue)" : "var(--color-text-secondary)",
        background: active ? "var(--color-blue-subtle)" : "transparent",
        border: active ? "1px solid rgba(88, 166, 255, 0.2)" : "1px solid transparent",
      }}
    >
      {children}
    </Link>
  );
}

export default Navbar;
