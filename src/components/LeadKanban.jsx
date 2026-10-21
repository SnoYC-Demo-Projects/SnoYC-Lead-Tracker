import React from "react";
import { 
  Building, 
  User, 
  MapPin, 
  MessageCircle, 
  PhoneCall, 
  ArrowRight,
  MoreVertical
} from "lucide-react";
import { STATUS_OPTIONS } from "../data/mockData";
import { getFollowUpUrgency, getWhatsAppUrl, getTelUrl, formatDate } from "../utils/helpers";

export function LeadKanban({ leads, onViewLead, onMoveStage }) {
  return (
    <div className="kanban-board">
      {STATUS_OPTIONS.map((status) => {
        const columnLeads = leads.filter(l => l.status === status.value);

        return (
          <div key={status.value} className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title" style={{ color: status.color }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: status.color }} />
                <span>{status.label}</span>
              </div>
              <span className="kanban-badge-count">{columnLeads.length}</span>
            </div>

            <div className="kanban-cards-wrapper">
              {columnLeads.length === 0 ? (
                <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  No leads in this stage
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
                  const waUrl = getWhatsAppUrl(lead.phone, lead.contactName, lead.businessName);
                  const telUrl = getTelUrl(lead.phone);

                  return (
                    <div 
                      key={lead.id} 
                      className="kanban-card"
                      onClick={() => onViewLead(lead)}
                    >
                      <div className="kanban-card-top">
                        <span className="lead-id-badge">{lead.id}</span>
                        <span className={`followup-pill ${urgency.badgeClass}`} style={{ fontSize: "0.68rem", padding: "0.15rem 0.45rem" }}>
                          {urgency.label}
                        </span>
                      </div>

                      <div className="kanban-card-title">{lead.businessName}</div>
                      
                      <div className="kanban-card-contact">
                        <User size={12} /> {lead.contactName}
                        {lead.city && <span>• {lead.city}</span>}
                      </div>

                      {lead.need && (
                        <div className="kanban-card-need">
                          {lead.need}
                        </div>
                      )}

                      <div className="kanban-card-footer" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <a 
                            href={waUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="quick-icon-btn wa"
                            title="WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </a>
                          <a 
                            href={telUrl} 
                            className="quick-icon-btn call"
                            title="Call"
                          >
                            <PhoneCall size={13} />
                          </a>
                        </div>

                        {/* Quick stage changer */}
                        <select
                          className="form-select"
                          value={lead.status}
                          onChange={(e) => onMoveStage(lead.id, e.target.value)}
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.4rem",
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-subtle)",
                            borderRadius: "var(--radius-sm)",
                            maxWidth: "130px"
                          }}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              Move: {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
