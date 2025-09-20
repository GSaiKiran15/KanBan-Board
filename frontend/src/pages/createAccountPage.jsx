// src/pages/CreateAccountPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

function mapFirebaseError(code) {
  switch (code) {
    case "auth/email-already-in-use": return "That email is already in use.";
    case "auth/invalid-email":        return "Please enter a valid email.";
    case "auth/weak-password":        return "Password should be at least 6 characters.";
    default:                          return "Could not create account. Please try again.";
  }
}

export function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (pass !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      navigate(from, { replace: true });
    } catch (e) {
      setError(mapFirebaseError(e.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSignup}>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join and start organizing your work</p>

        <div className="auth-form">
          <label className="auth-label">Full name</label>
          <input
            className="auth-input"
            placeholder="Satoshi Nakamoto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <label className="auth-label">Confirm password</label>
          <input
            className="auth-input"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
        </div>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default CreateAccountPage;
