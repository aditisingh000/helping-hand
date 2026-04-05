import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If there's no token, they might be here to request a token
  const isRequestMode = !token;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // In request mode, we reuse the password state field as the email field to save code in this simple demo
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to request reset");

      setSuccess("If that email exists, we've sent a password reset link. Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess("Your password has been successfully reset!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h1 className="auth-title">
          {isRequestMode ? "Reset Password" : "Set New Password"}
        </h1>
        <p className="auth-subtitle">
          {isRequestMode 
            ? "Enter your email to receive a reset link" 
            : "Enter a strong new password for your account"}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success fade-in">{success}</div>}

        {!success && isRequestMode && (
          <form onSubmit={handleRequestSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && !isRequestMode && (
          <form onSubmit={handleResetSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
