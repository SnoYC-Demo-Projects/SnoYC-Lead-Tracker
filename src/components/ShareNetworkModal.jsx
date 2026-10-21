import React, { useState } from "react";
import { X, Copy, Check, Wifi, Globe, Smartphone, Laptop, Database } from "lucide-react";

export function ShareNetworkModal({ isOpen, onClose, networkInfo }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = networkInfo?.shareUrl || `http://${window.location.hostname}:5173/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            <Wifi size={20} style={{ color: "#34d399" }} />
            Connect Team Member Devices
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: "1.25rem" }}>
          <div>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              All leads and team accounts are stored in a centralized SQLite database. Any team member on your Wi-Fi or office network can open this URL on their phone, tablet, or laptop to log in and manage their leads:
            </p>
          </div>

          {/* Shareable Link Box */}
          <div style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflow: "hidden" }}>
              <Globe size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#38bdf8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {shareUrl}
              </span>
            </div>

            <button 
              className={`btn ${copied ? "btn-whatsapp" : "btn-primary"} btn-sm`}
              onClick={handleCopy}
              style={{ flexShrink: 0 }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy URL"}</span>
            </button>
          </div>

          {/* Device Instructions */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <Laptop size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.2rem" }} />
              <div>
                <strong style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>
                  Laptops & Desktops:
                </strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                  Open Chrome, Edge, or Safari and paste <code>{shareUrl}</code>. Team members can sign in with their email and password.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <Smartphone size={20} style={{ color: "#34d399", flexShrink: 0, marginTop: "0.2rem" }} />
              <div>
                <strong style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>
                  Mobile Phones & WhatsApp Outreach:
                </strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                  Connect the phone to the same Wi-Fi network and open the link. Team members can tap the WhatsApp icon on any lead to directly trigger WhatsApp on their phone!
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <Database size={20} style={{ color: "#facc15", flexShrink: 0, marginTop: "0.2rem" }} />
              <div>
                <strong style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>
                  Centralized SQLite Storage:
                </strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                  Every lead added, status updated, or note logged from any phone or computer is instantly recorded in <code>server/leads.db</code> and reflected on your Admin Dashboard in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
