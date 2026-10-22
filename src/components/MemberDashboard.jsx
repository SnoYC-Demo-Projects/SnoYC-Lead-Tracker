import React from "react";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  PhoneCall, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  Calendar
} from "lucide-react";
import { getFollowUpUrgency, getWhatsAppUrl, getTelUrl, formatDate } from "../utils/helpers";
import { STATUS_OPTIONS } from "../data/mockData";

export function MemberDashboard({ 
  currentUser, 
  leads, 
  onOpenAddModal, 
  onOpenLeadDetail, 
  onNavigateToTable 
}) {
  const myLeads = leads.filter(l => 
    l.assignedToId === currentUser?.id || 
    (l.assignedToName && currentUser?.name && l.assignedToName.toLowerCase() === currentUser.name.toLowerCase())
  );
  const myTotal = myLeads.length;
  const myWon = myLeads.filter(l => l.status === "Won").length;
  
  const myOverdue = myLeads.filter(l => getFollowUpUrgency(l.nextFollowUp, l.status).level === "overdue");
  const myToday = myLeads.filter(l => getFollowUpUrgency(l.nextFollowUp, l.status).level === "today");

  // Priority action items: overdue first, then today
  const urgentQueue = [...myOverdue, ...myToday];

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Sparkles style={{ color: "var(--primary)" }} />
            Welcome back, {currentUser?.name}!
          </h2>
          <p>Here is your daily pipeline snapshot and action items for today</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={16} /> Log New Lead
          </button>
        </div>
      </div>

      {/* Personal KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card card-primary">
          <div className="stat-header">
            <span className="stat-title">My Total Leads</span>
            <div className="stat-icon primary">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="stat-value">{myTotal}</div>
          <div className="stat-subtext">Active leads under your ownership</div>
        </div>

        <div className="stat-card card-success">
          <div className="stat-header">
            <span className="stat-title">My Closed Wins</span>
            <div className="stat-icon success">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-value">{myWon}</div>
          <div className="stat-subtext">Successfully converted deals</div>
        </div>

        <div className="stat-card card-warning">
          <div className="stat-header">
            <span className="stat-title">Due Today</span>
            <div className="stat-icon warning">
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-value">{myToday.length}</div>
          <div className="stat-subtext">Follow-ups scheduled for today</div>
        </div>

        <div className="stat-card card-danger">
          <div className="stat-header">
            <span className="stat-title">Overdue Follow-ups</span>
            <div className="stat-icon danger">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: myOverdue.length > 0 ? "var(--danger)" : undefined }}>
            {myOverdue.length}
          </div>
          <div className="stat-subtext">Requires immediate client outreach</div>
        </div>
      </div>

      {/* Priority Outreach Queue */}
      <div className="chart-card" style={{ marginBottom: "1.75rem" }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <Calendar size={18} style={{ color: "var(--warning)" }} />
            Today's Outreach Action Queue ({urgentQueue.length})
          </div>
          <button className="btn btn-outline btn-sm" onClick={onNavigateToTable}>
            View All My Leads <ArrowRight size={14} />
          </button>
        </div>

        {urgentQueue.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            <CheckCircle size={36} style={{ color: "var(--success)", margin: "0 auto 0.75rem" }} />
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>
              Great job! All your follow-ups are up to date!
            </div>
            <div style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
              No overdue or due-today follow-ups remaining. Ready to log new opportunities?
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
            {urgentQueue.map(lead => {
              const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
              const waUrl = getWhatsAppUrl(lead.phone, lead.contactName, lead.businessName);
              const telUrl = getTelUrl(lead.phone);

              return (
                <div 
                  key={lead.id} 
                  className="kanban-card"
                  style={{ 
                    borderLeft: urgency.level === "overdue" ? "4px solid var(--danger)" : "4px solid var(--warning)",
                    background: "var(--bg-surface-elevated)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <span className="lead-id-badge" onClick={() => onOpenLeadDetail(lead)}>
                      {lead.id}
                    </span>
                    <span className={`followup-pill ${urgency.badgeClass}`}>
                      {urgency.label}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                    {lead.businessName}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.45rem" }}>
                    👤 {lead.contactName} • {lead.city}
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem", fontStyle: "italic" }}>
                    "{lead.notes || lead.need}"
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.6rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <a 
                        href={waUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm btn-whatsapp"
                        title="Send WhatsApp message"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                      <a 
                        href={telUrl} 
                        className="btn btn-sm btn-call"
                        title="Call Phone"
                      >
                        <PhoneCall size={14} /> Call
                      </a>
                    </div>

                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onOpenLeadDetail(lead)}
                    >
                      Details & Notes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
