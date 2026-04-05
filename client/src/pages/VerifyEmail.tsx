import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/Auth.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The token may be expired or invalid.");
        }
      } catch {
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h1 className="auth-title">Email Verification</h1>
        
        {status === "loading" && <p className="auth-subtitle">Verifying your email, please wait...</p>}
        
        {status === "success" && (
          <>
            <div className="auth-success fade-in">{message}</div>
            <div className="auth-footer" style={{ marginTop: 0 }}>
              <Link to="/login" className="auth-button" style={{ display: 'block', textDecoration: 'none' }}>
                Proceed to Login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="auth-error fade-in">{message}</div>
            <div className="auth-footer">
              <Link to="/">Back to Home</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
