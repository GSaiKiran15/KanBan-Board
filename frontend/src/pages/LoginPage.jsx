// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      navigate(from, { replace: true });
    } catch (e) {
      // friendly-ish message
      setErr(e.code?.startsWith("auth/") ? e.code.replace("auth/", "").replaceAll("-", " ") : e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to your projects</p>

        <div className="auth-form">
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          {err && <div className="auth-error">{err}</div>}

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <div className="auth-footer">
          <span>New here?</span>
          <Link to="/create-account" className="auth-link">Create an account</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
