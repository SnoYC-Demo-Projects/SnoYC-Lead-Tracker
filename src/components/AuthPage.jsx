import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../services/supabaseClient";
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  Cloud
} from "lucide-react";

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTitle, setRegTitle] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Login failed. Please check your credentials.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!regName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!regEmail.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
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
      setError(res.error || "Registration failed");
    } else {
      setSuccessMsg("Registration submitted successfully! Your account is pending Admin authorization. You will be able to log in once approved.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegTitle("");
      setMode("login");
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic ambient background glow */}
      <div className="auth-ambient-glow glow-1" />
      <div className="auth-ambient-glow glow-2" />
      <div className="auth-ambient-glow glow-3" />

      <div className="auth-card-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <img src="/logo.png" alt="SnoYC Lead Logo" className="auth-logo-img" />
          </div>
          <h1 className="auth-title">SnoYC Lead</h1>
          <p className="auth-subtitle">Enterprise Lead Pipeline & Team CRM</p>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Mode Switcher Tabs */}
          <div className="auth-tabs" role="tablist">
            <button
              id="tab-sign-in"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
            >
              <Lock size={15} />
              <span>Sign In</span>
            </button>
            <button
              id="tab-sign-up"
              role="tab"
              aria-selected={mode === "register"}
              className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => {
                setMode("register");
                setError("");
                setSuccessMsg("");
              }}
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="auth-alert error" role="alert">
              <AlertCircle size={18} className="auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert success" role="status">
              <CheckCircle2 size={18} className="auth-alert-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">
                  Work Email Address
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-control auth-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="login-password" style={{ marginBottom: "0.35rem" }} className="form-label">
                    Password
                  </label>
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="form-control auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="btn-sign-in"
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner-text">Verifying credentials...</span>
                ) : (
                  <>
                    <span>Sign In to CRM</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <div className="auth-footer-prompt">
                <span>Don't have an account yet?</span>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* SIGN UP / REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    className="form-control auth-input"
                    placeholder="e.g. Sarah Jenkins"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">
                  Work Email Address
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    className="form-control auth-input"
                    placeholder="sarah@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-title" className="form-label">
                  Job Title / Department
                </label>
                <div className="auth-input-wrapper">
                  <Briefcase size={16} className="auth-input-icon" />
                  <input
                    id="reg-title"
                    type="text"
                    className="form-control auth-input"
                    placeholder="e.g. Senior Sales Executive"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-password" style={{ marginBottom: "0.35rem" }} className="form-label">
                    Password (min 6 chars)
                  </label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      className="form-control auth-input"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-confirm-password" style={{ marginBottom: "0.35rem" }} className="form-label">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      id="reg-confirm-password"
                      type={showRegPassword ? "text" : "password"}
                      className="form-control auth-input"
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                id="btn-sign-up"
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner-text">Submitting registration...</span>
                ) : (
                  <>
                    <UserPlus size={17} />
                    <span>Create Team Account</span>
                  </>
                )}
              </button>

              <div className="auth-footer-prompt">
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Database status footer */}
        <div className="auth-db-status">
          <Cloud size={14} style={{ color: isSupabaseConfigured ? "#34d399" : "#fbbf24" }} />
          <span>
            {isSupabaseConfigured 
              ? "Connected to Supabase Cloud Database"
              : "Demo Local Storage Mode (Add Supabase keys in .env for Cloud Sync)"}
          </span>
        </div>
      </div>
    </div>
  );
}
