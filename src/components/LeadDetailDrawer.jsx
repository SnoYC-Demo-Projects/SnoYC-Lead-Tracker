import React, { useState } from "react";
import { 
  X, 
  MessageCircle, 
  PhoneCall, 
  Edit3, 
  Calendar, 
  MapPin, 
  Building, 
  User, 
  Globe, 
  Tag, 
  Clock, 
  Send,
  FileText,
  IndianRupee
} from "lucide-react";
import { 
  formatDate, 
  getFollowUpUrgency, 
  getWhatsAppUrl, 
  getTelUrl, 
  getTodayDateString,
  isLeadOwnedByUser
} from "../utils/helpers";
import { STATUS_OPTIONS } from "../data/mockData";

export function LeadDetailDrawer({ 
  lead, 
  isOpen, 
  onClose, 
  onEditLead, 
  onAddNote,
  onUpdateStatus,
  currentUser,
  isAdmin
}) {
  const [newNoteText, setNewNoteText] = useState("");

  if (!isOpen || !lead) return null;

  const canAccess = isAdmin || isLeadOwnedByUser(lead, currentUser);

  if (!canAccess) {
    return (
      <div className="drawer-overlay" onClick={onClose}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450, padding: "2rem" }}>
          <div className="drawer-header">
            <h3>Access Restricted</h3>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>
            You do not have permission to view or edit this lead. Only the assigned representative ({lead.assignedToName || "another member"}) or an Administrator can access it.
          </p>
        </div>
      </div>
    );
  }

  const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
  const statusMeta = STATUS_OPTIONS.find(s => s.value === lead.status) || {
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.15)",
    border: "rgba(148, 163, 184, 0.3)"
  };

  const waUrl = getWhatsAppUrl(lead.phone, lead.contactName, lead.businessName);
  const telUrl = getTelUrl(lead.phone);

  const handleAppendNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = getTodayDateString();
    const formattedNote = `[${today} ${timestamp}] ${newNoteText.trim()}`;
    const combinedNotes = lead.notes 
      ? `${formattedNote}\n\n${lead.notes}`
      : formattedNote;
    
    onAddNote(lead.id, combinedNotes);
    setNewNoteText("");
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span className="lead-id-badge" style={{ fontSize: "0.82rem" }}>{lead.id}</span>
            <span 
              className="status-pill"
              style={{
                backgroundColor: statusMeta.bg,
                color: statusMeta.color,
                border: `1px solid ${statusMeta.border}`
              }}
            >
              <span className="status-dot" style={{ backgroundColor: statusMeta.color }} />
              {lead.status}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button className="btn btn-outline btn-sm" onClick={() => onEditLead(lead)}>
              <Edit3 size={14} /> Edit
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {/* Main Title & Action Bar */}
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {lead.businessName}
            </h2>
            <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              {lead.contactName} • {lead.city}
            </div>

            {/* Direct Connect Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp"
                style={{ flex: 1 }}
              >
                <MessageCircle size={16} /> WhatsApp Message
              </a>
              <a 
                href={telUrl} 
                className="btn btn-call"
                style={{ flex: 1 }}
              >
                <PhoneCall size={16} /> Call Client
              </a>
            </div>
          </div>

          {/* Follow-up Urgency Callout */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Next Follow-Up Date
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                {formatDate(lead.nextFollowUp)}
              </div>
            </div>
            <span className={`followup-pill ${urgency.badgeClass}`}>
              {urgency.label}
            </span>
          </div>

          {/* Key Specifications Grid */}
          <div>
            <div className="detail-section-title">
              <Building size={14} /> Lead Specifications
            </div>
            <div className="detail-info-grid">
              <div className="info-item">
                <label>Date Logged</label>
                <span>{formatDate(lead.dateLogged)}</span>
              </div>
              <div className="info-item">
                <label>Last Contacted</label>
                <span>{formatDate(lead.lastContacted)}</span>
              </div>
              <div className="info-item">
                <label>Phone / WhatsApp</label>
                <span style={{ fontFamily: "var(--font-mono)" }}>{lead.phone}</span>
              </div>
              <div className="info-item">
                <label>Area / City</label>
                <span>{lead.city}</span>
              </div>
              <div className="info-item">
                <label>Business Type</label>
                <span>{lead.businessType}</span>
              </div>
              <div className="info-item">
                <label>Lead Source</label>
                <span>{lead.source}</span>
              </div>
              <div className="info-item">
                <label>Assigned Representative</label>
                <span style={{ color: "var(--primary)" }}>{lead.assignedToName || "Unassigned"}</span>
              </div>
              <div className="info-item">
                <label>Estimated Deal Value</label>
                <span style={{ color: "#34d399", fontWeight: 700 }}>
                  {lead.estimatedValue ? `₹${Number(lead.estimatedValue).toLocaleString('en-IN')}` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Client Need */}
          <div>
            <div className="detail-section-title">
              <FileText size={14} /> Client Need / Requirement
            </div>
            <div style={{
              background: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "0.9rem",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              color: "#e2e8f0"
            }}>
              {lead.need}
            </div>
          </div>

          {/* Notes & Fast Log */}
          <div>
            <div className="detail-section-title">
              <Clock size={14} /> Activity Log & Notes
            </div>

            {/* Quick add note form */}
            <form onSubmit={handleAppendNote} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Log quick follow-up outcome or reminder..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={14} /> Log
                </button>
              </div>
            </form>

            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              whiteSpace: "pre-wrap",
              fontSize: "0.82rem",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxHeight: "220px",
              overflowY: "auto"
            }}>
              {lead.notes || "No notes recorded yet. Use the input above to log your first call summary."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
