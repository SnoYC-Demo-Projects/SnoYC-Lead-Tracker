import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, User, Mail, Lock, Key, Check, AlertCircle, X, Save } from "lucide-react";

export function AdminProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "Administrator");
      setEmail(currentUser.email || "admin@company.com");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    if (!email.trim()) {
      setError("Email / Login ID cannot be empty");
      return;
    }
    if (password && password.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await updateProfile(currentUser.id, {
      name: name.trim(),
      email: email.trim(),
      password: password ? password.trim() : undefined,
      title: "System Administrator"
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to update admin credentials");
    } else {
      setSuccess("Admin credentials updated successfully in the SQLite database!");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h3>
            <Shield size={20} style={{ color: "#ec4899" }} />
            Admin Account & Credentials Settings
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="modal-body" style={{ gap: "1rem" }}>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Update your primary administrator login ID and password. These credentials are saved directly to your local SQLite database.
            </p>

            {success && (
              <div style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#34d399",
                padding: "0.75rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div style={{
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "#fb7185",
                padding: "0.75rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <User size={13} /> Admin Display Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe (Admin)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={13} /> Admin Email / Login ID
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. myname@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem", marginTop: "0.25rem" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Key size={13} /> Change Password (Optional)
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    <Lock size={13} /> New Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Leave blank to keep"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Lock size={13} /> Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={15} /> {loading ? "Saving..." : "Save Admin Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
