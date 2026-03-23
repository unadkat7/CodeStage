import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

/**
 * Signup Page — Name + Email + Password registration form.
 * On success, navigates to /login with a success banner.
 */
function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic client-side validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(formData);
      // Navigate to login with a success query param
      navigate("/login?registered=1");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(137, 87, 229, 0.08) 0%, transparent 60%), var(--color-bg-primary)",
        padding: "24px",
      }}
    >
      <div
        className="slide-up"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1f6feb, #8957e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "800",
              color: "white",
              margin: "0 auto 16px",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(137, 87, 229, 0.3)",
            }}
          >
            C
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #e6edf3, #8b949e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.03em",
              margin: "0 0 8px",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "14px", margin: 0 }}>
            Join CodeStage and start solving problems
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
            borderRadius: "14px",
            padding: "32px",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Error */}
          {error && (
            <div
              className="fade-in"
              style={{
                background: "rgba(248, 81, 73, 0.08)",
                border: "1px solid rgba(248, 81, 73, 0.3)",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--color-red)", flexShrink: 0, marginTop: "1px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span style={{ color: "var(--color-red)", fontSize: "13px" }}>
                {error}
              </span>
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-text-secondary)",
                marginBottom: "6px",
              }}
            >
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-text-secondary)",
                marginBottom: "6px",
              }}
            >
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-text-secondary)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="input-field"
              autoComplete="new-password"
            />
          </div>

          {/* Password strength indicator */}
          <PasswordStrength password={formData.password} />

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "20px" }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: "16px", height: "16px" }} />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "var(--color-text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--color-blue)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * PasswordStrength — visual indicator bar for password strength.
 */
function PasswordStrength({ password }) {
  if (!password) return null;

  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const score =
    (len >= 6 ? 1 : 0) +
    (len >= 10 ? 1 : 0) +
    (hasUpper ? 1 : 0) +
    (hasDigit ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const levels = [
    { threshold: 1, color: "#f85149", label: "Weak" },
    { threshold: 2, color: "#d29922", label: "Fair" },
    { threshold: 3, color: "#58a6ff", label: "Good" },
    { threshold: 5, color: "#3fb950", label: "Strong" },
  ];

  const level = levels.find((l) => score <= l.threshold) || levels[3];
  const fill = Math.min((score / 5) * 100, 100);

  return (
    <div style={{ marginTop: "8px", marginBottom: "4px" }}>
      <div
        style={{
          height: "4px",
          borderRadius: "2px",
          background: "var(--color-bg-card)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fill}%`,
            background: level.color,
            borderRadius: "2px",
            transition: "width 0.3s ease, background 0.3s ease",
          }}
        />
      </div>
      <div
        style={{
          fontSize: "11px",
          color: level.color,
          marginTop: "4px",
          fontWeight: "500",
        }}
      >
        {level.label}
      </div>
    </div>
  );
}

export default Signup;
