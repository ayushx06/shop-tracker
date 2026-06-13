import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [pin, setPin] = useState("");
  const [staffName, setStaffName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(pin, staffName);
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🛒</div>
        <h1>Shop Tracker</h1>
        <p className="login-sub">Enter your PIN to continue</p>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Staff Name (for staff only)</label>
            <input
              type="text"
              placeholder="Your name..."
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </div>
          <div className="field">
            <label>PIN</label>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
              required
              autoFocus
            />
          </div>
          {error && <div className="error-msg">⚠ {error}</div>}
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? "Checking..." : "Login →"}
          </button>
        </form>

        <div className="login-hint">
          <span>Owner PIN and Staff PIN are set by the shop owner</span>
        </div>
      </div>
    </div>
  );
}
