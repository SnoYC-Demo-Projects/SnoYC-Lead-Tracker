import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Shield, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  UserPlus, 
  Clock, 
  AlertCircle,
  Briefcase
} from "lucide-react";

export function LoginModal({ isOpen, onClose }) {
  const { login, register, quickLoginAs, users, currentUser } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTitle, setRegTitle] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen && currentUser) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    } else {
      if (onClose) onClose();
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      title: regTitle.trim() || "Sales Representative"
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    } else {
      setSuccessMsg("Registration submitted successfully! Your account is pending Admin approval. The Admin will review and authorize your access.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegTitle("");
      setMode("login");
    }
  };

  const handleQuickSwitch = (u) => {
    if (u.status === "pending") {
      setError(`"${u.name}" is pending Admin approval. An administrator must approve this user before login.`);
      return;
    }
    quickLoginAs(u);
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="login-card" style={{ maxWidth: 480 }}>
        <div className="login-brand">
          <div className="login-brand-icon">
            <img src="/logo.png" alt="SnoYC Lead Logo" className="login-brand-img" />
          </div>
          <h2>SnoYC Lead</h2>
          <p>Multi-User Team & Admin Lead Tracking Platform</p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: "flex",
          background: "var(--bg-input)",
          padding: "0.25rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          marginBottom: "1.25rem"
        }}>
          <button
            type="button"
            className={`btn-sm ${mode === "login" ? "btn-primary" : "btn-outline"}`}
            style={{ flex: 1, border: "none", borderRadius: "var(--radius-sm)" }}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`btn-sm ${mode === "register" ? "btn-primary" : "btn-outline"}`}
            style={{ flex: 1, border: "none", borderRadius: "var(--radius-sm)" }}
            onClick={() => { setMode("register"); setError(""); }}
          >
            <UserPlus size={14} /> Register New Member
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#34d399",
            padding: "0.75rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.82rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
            lineHeight: 1.4
          }}>
            <Clock size={16} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
            padding: "0.75rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.82rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
            lineHeight: 1.4
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <span>{error}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={14} /> Work Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", marginTop: "0.4rem" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Platform"} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div className="form-group">
              <label className="form-label">
                <User size={14} /> Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jordan Blake"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={14} /> Work Email <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. jordan@company.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Briefcase size={14} /> Job Title / Position
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sales Executive, Lead Specialist"
                value={regTitle}
                onChange={(e) => setRegTitle(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label className="form-label">
                  <Lock size={14} /> Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="At least 6 chars"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={14} /> Confirm <span className="required">*</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{
              fontSize: "0.74rem",
              color: "var(--text-muted)",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)"
            }}>
              🔒 <strong>Security Policy:</strong> Newly registered accounts are submitted in <strong>Pending</strong> status and must be approved by the Admin before accessing leads.
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", marginTop: "0.25rem" }}
              disabled={loading}
            >
              <UserPlus size={16} /> Submit Registration for Admin Approval
            </button>
          </form>
        )}

        {/* PRODUCTION AUTH FOOTER */}
        <div style={{
          marginTop: "1.25rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          textAlign: "center"
        }}>
          {mode === "login" ? (
            <div>
              <span>Need an account? </span>
              <button 
                type="button" 
                onClick={() => { setMode("register"); setError(""); }}
                style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Register as Team Member
              </button>
            </div>
          ) : (
            <div>
              <span>Already registered? </span>
              <button 
                type="button" 
                onClick={() => { setMode("login"); setError(""); }}
                style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>

        {currentUser && onClose && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={onClose}
          >
            Cancel & Keep Current Session
          </button>
        )}
      </div>
    </div>
  );
}
