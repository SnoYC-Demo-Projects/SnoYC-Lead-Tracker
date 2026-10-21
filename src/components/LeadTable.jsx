import React, { useState } from "react";
import { 
  PhoneCall, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  Calendar, 
  MapPin, 
  FileText,
  User,
  Building,
  CheckCircle2
} from "lucide-react";
import { 
  formatDate, 
  getFollowUpUrgency, 
  getWhatsAppUrl, 
  getTelUrl 
} from "../utils/helpers";
import { STATUS_OPTIONS } from "../data/mockData";

export function LeadTable({ 
  leads, 
  onViewLead, 
  onEditLead, 
  onDeleteLead, 
  onQuickStatusChange,
  isAdmin 
}) {
  const [sortField, setSortField] = useState("dateLogged");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let aVal = a[sortField] || "";
    let bVal = b[sortField] || "";
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="leads-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("id")}>
                Lead ID {sortField === "id" && <ArrowUpDown size={12} style={{ display: "inline" }} />}
              </th>
              <th className="sortable" onClick={() => handleSort("dateLogged")}>
                Date Logged {sortField === "dateLogged" && <ArrowUpDown size={12} style={{ display: "inline" }} />}
              </th>
              <th className="sortable" onClick={() => handleSort("businessName")}>
                Business Name & Type {sortField === "businessName" && <ArrowUpDown size={12} style={{ display: "inline" }} />}
              </th>
              <th>Owner / Contact</th>
              <th>Phone / WhatsApp</th>
              <th>Area / City</th>
              <th>Source</th>
              <th>Need</th>
              <th>Status</th>
              <th className="sortable" onClick={() => handleSort("lastContacted")}>
                Last Contacted
              </th>
              <th className="sortable" onClick={() => handleSort("nextFollowUp")}>
                Next Follow-Up {sortField === "nextFollowUp" && <ArrowUpDown size={12} style={{ display: "inline" }} />}
              </th>
              {isAdmin && <th>Assigned Member</th>}
              <th>Notes Preview</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 14 : 13} style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <div style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: "var(--radius-lg)",
                      background: "rgba(99, 102, 241, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)"
                    }}>
                      <Building size={24} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                      No Leads in Database Yet
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      Your lead tracker is clean and ready. Start adding your prospective business clients or share the team link with your representatives.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedLeads.map((lead) => {
                const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
                const statusMeta = STATUS_OPTIONS.find(s => s.value === lead.status) || {
                  color: "#94a3b8",
                  bg: "rgba(148, 163, 184, 0.15)",
                  border: "rgba(148, 163, 184, 0.3)"
                };

                const waUrl = getWhatsAppUrl(lead.phone, lead.contactName, lead.businessName);
                const telUrl = getTelUrl(lead.phone);

                return (
                  <tr key={lead.id}>
                    {/* 1. Lead ID */}
                    <td>
                      <span 
                        className="lead-id-badge" 
                        onClick={() => onViewLead(lead)} 
                        title="Click to view full lead details"
                      >
                        {lead.id}
                      </span>
                    </td>

                    {/* 2. Date Logged */}
                    <td style={{ whiteSpace: "nowrap", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {formatDate(lead.dateLogged)}
                    </td>

                    {/* 3. Business Name & Type */}
                    <td>
                      <span className="business-name-cell">{lead.businessName}</span>
                      <span className="business-type-cell">
                        <Building size={11} /> {lead.businessType || "General"}
                      </span>
                    </td>

                    {/* 4. Owner / Contact Name */}
                    <td>
                      <div className="contact-cell-name">{lead.contactName}</div>
                    </td>

                    {/* 5. Phone / WhatsApp with quick triggers */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-primary)" }}>
                          {lead.phone}
                        </span>
                        <div className="phone-quick-actions">
                          <a 
                            href={waUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="quick-icon-btn wa"
                            title={`Send WhatsApp message to ${lead.contactName}`}
                          >
                            <MessageCircle size={14} />
                          </a>
                          <a 
                            href={telUrl} 
                            className="quick-icon-btn call"
                            title={`Call ${lead.contactName}`}
                          >
                            <PhoneCall size={14} />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* 6. Area / City */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <MapPin size={12} style={{ color: "var(--text-muted)" }} />
                        {lead.city || "—"}
                      </span>
                    </td>

                    {/* 7. Source */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.74rem",
                        border: "1px solid var(--border-subtle)"
                      }}>
                        {lead.source || "Direct"}
                      </span>
                    </td>

                    {/* 8. Need */}
                    <td style={{ maxWidth: "220px" }}>
                      <div style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)"
                      }} title={lead.need}>
                        {lead.need || "—"}
                      </div>
                    </td>

                    {/* 9. Status with quick inline switcher */}
                    <td>
                      <select
                        className="form-select"
                        value={lead.status}
                        onChange={(e) => onQuickStatusChange(lead.id, e.target.value)}
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.6rem",
                          color: statusMeta.color,
                          backgroundColor: statusMeta.bg,
                          borderColor: statusMeta.border,
                          borderRadius: "9999px",
                          cursor: "pointer"
                        }}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} style={{ background: "#111827", color: opt.color }}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 10. Last Contacted */}
                    <td style={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                      {formatDate(lead.lastContacted)}
                    </td>

                    {/* 11. Next Follow-up Date with Urgency Badge */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {formatDate(lead.nextFollowUp)}
                        </span>
                        <span className={`followup-pill ${urgency.badgeClass}`}>
                          {urgency.label}
                        </span>
                      </div>
                    </td>

                    {/* Optional Admin column: Assigned Member */}
                    {isAdmin && (
                      <td style={{ whiteSpace: "nowrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem" }}>
                          <User size={12} style={{ color: "var(--primary)" }} />
                          {lead.assignedToName || "Unassigned"}
                        </span>
                      </td>
                    )}

                    {/* 12. Notes Preview */}
                    <td style={{ maxWidth: "180px" }}>
                      <div 
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "0.76rem",
                          color: "var(--text-muted)",
                          cursor: "pointer"
                        }}
                        onClick={() => onViewLead(lead)}
                        title={lead.notes || "No notes logged yet. Click to view or add."}
                      >
                        {lead.notes || <span style={{ opacity: 0.5 }}>+ Add note</span>}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="btn-icon"
                          onClick={() => onViewLead(lead)}
                          title="View Lead Details & Notes"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          className="btn-icon"
                          onClick={() => onEditLead(lead)}
                          title="Edit Lead"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          className="btn-icon"
                          style={{ color: "var(--danger)" }}
                          onClick={() => onDeleteLead(lead.id)}
                          title="Delete Lead"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
