import React from "react";
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  IndianRupee, 
  Briefcase, 
  BarChart3,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { STATUS_OPTIONS } from "../data/mockData";
import { getFollowUpUrgency } from "../utils/helpers";

export function AdminDashboard({ leads, users, onFilterByMember, onFilterByStatus, onNavigateToTable, onNavigateToTeam }) {
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === "Won");
  const wonCount = wonLeads.length;
  const totalRevenue = wonLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

  const overdueLeads = leads.filter(l => getFollowUpUrgency(l.nextFollowUp, l.status).level === "overdue");
  const todayLeads = leads.filter(l => getFollowUpUrgency(l.nextFollowUp, l.status).level === "today");
  const pendingUsers = users.filter(u => u.status === "pending");

  // Pipeline stage counts
  const stageCounts = STATUS_OPTIONS.map(opt => {
    const count = leads.filter(l => l.status === opt.value).length;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return { ...opt, count, percentage };
  });

  // Team members stats
  const memberStats = users
    .filter(u => u.role === "member" && u.status !== "pending")
    .map(member => {
      const memberLeads = leads.filter(l => l.assignedToId === member.id);
      const memberWon = memberLeads.filter(l => l.status === "Won").length;
      const memberOverdue = memberLeads.filter(l => getFollowUpUrgency(l.nextFollowUp, l.status).level === "overdue").length;
      const memberRate = memberLeads.length > 0 ? Math.round((memberWon / memberLeads.length) * 100) : 0;
      return {
        ...member,
        total: memberLeads.length,
        won: memberWon,
        overdue: memberOverdue,
        rate: memberRate
      };
    });

  // Source breakdown
  const sourceMap = {};
  leads.forEach(l => {
    const src = l.source || "Other";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const topSources = Object.entries(sourceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Layers style={{ color: "var(--primary)" }} />
            Executive CRM Command Center
          </h2>
          <p>Complete organization overview across all team members and sales pipelines</p>
        </div>
      </div>

      {/* Pending User Approval Banner */}
      {pendingUsers.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.12) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.3rem" }}>🔔</span>
            <div>
              <strong style={{ fontSize: "0.92rem", color: "#fef08a" }}>
                {pendingUsers.length} New Team Member Registration{pendingUsers.length > 1 ? "s" : ""} Awaiting Approval
              </strong>
              <div style={{ fontSize: "0.78rem", color: "#fde047", marginTop: "0.15rem" }}>
                Review and approve their access so they can log in and start tracking leads.
              </div>
            </div>
          </div>

          <button 
            className="btn btn-sm btn-primary"
            onClick={onNavigateToTeam}
            style={{ fontWeight: 700 }}
          >
            Review & Authorize ({pendingUsers.length}) <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card card-primary">
          <div className="stat-header">
            <span className="stat-title">Total Company Leads</span>
            <div className="stat-icon primary">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="stat-value">{totalLeads}</div>
          <div className="stat-subtext">Across {users.filter(u => u.role === "member").length} active representatives</div>
        </div>

        <div className="stat-card card-success">
          <div className="stat-header">
            <span className="stat-title">Closed Deals Won</span>
            <div className="stat-icon success">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-value">{wonCount}</div>
          <div className="stat-subtext">Est. ₹{totalRevenue.toLocaleString('en-IN')} in closed value</div>
        </div>

        <div className="stat-card card-info">
          <div className="stat-header">
            <span className="stat-title">Conversion Rate</span>
            <div className="stat-icon info">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-value">{conversionRate}%</div>
          <div className="stat-subtext">Overall pipeline closing efficiency</div>
        </div>

        <div className="stat-card card-danger">
          <div className="stat-header">
            <span className="stat-title">Overdue Follow-ups</span>
            <div className="stat-icon danger">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: overdueLeads.length > 0 ? "var(--danger)" : undefined }}>
            {overdueLeads.length}
          </div>
          <div className="stat-subtext">{todayLeads.length} leads due for follow-up today</div>
        </div>
      </div>

      {/* Performance & Stages Split */}
      <div className="performance-grid">
        {/* Pipeline Health */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <BarChart3 size={18} style={{ color: "var(--primary)" }} />
              Pipeline Stage Distribution
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{totalLeads} Total</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "0.5rem" }}>
            {stageCounts.map(stage => (
              <div 
                key={stage.value} 
                className="pipeline-bar-wrapper"
                style={{ cursor: "pointer" }}
                onClick={() => onFilterByStatus(stage.value)}
                title={`Click to filter leads by ${stage.label}`}
              >
                <div className="pipeline-label-row">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: stage.color }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                    {stage.label}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <strong>{stage.count}</strong> ({stage.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${stage.percentage}%`, 
                      background: stage.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance Table */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Users size={18} style={{ color: "#38bdf8" }} />
              Team Member Performance
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Real-time sync</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {memberStats.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                No active team members registered yet. Click <strong>"Team Link"</strong> in the navbar to invite representatives.
              </div>
            ) : (
              memberStats.map(member => (
              <div key={member.id} className="team-member-row">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img src={member.avatar} alt={member.name} className="user-avatar" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {member.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {member.total} Leads
                    </div>
                    <div style={{ fontSize: "0.72rem", color: member.overdue > 0 ? "var(--danger)" : "var(--success)" }}>
                      {member.overdue > 0 ? `${member.overdue} Overdue` : "All follow-ups on track"}
                    </div>
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onFilterByMember(member.id)}
                    title="View this member's leads"
                  >
                    View Leads <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
          </div>

          {/* Top Acquisition Channels */}
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.65rem" }}>
              Top Lead Acquisition Sources
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {topSources.map(([src, count]) => (
                <span 
                  key={src} 
                  className="filter-chip"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "var(--border-subtle)" }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>{src}</strong>: {count} leads
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
