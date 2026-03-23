import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";

/**
 * Login Page — Email + Password sign-in form.
 * On success, stores token + user in AuthContext, redirects to /problems.
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login(formData);
      // Store token AND user object
      login(res.data.token, res.data.user);
      navigate("/problems");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(56, 139, 253, 0.08) 0%, transparent 60%), var(--color-bg-primary)",
        padding: "24px",
      }}
    >
      <div
        className="slide-up"
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
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
                "0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(56, 139, 253, 0.3)",
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
            Welcome back
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Sign in to your CodeStage account
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
          {/* Error message */}
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
              id="login-email"
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
          <div style={{ marginBottom: "24px" }}>
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
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: "16px", height: "16px" }} />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "var(--color-text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--color-blue)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
