import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Users, 
  UserPlus, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Briefcase, 
  Plus, 
  ArrowRight, 
  AlertTriangle, 
  Check, 
  Trash2,
  Clock
} from "lucide-react";

export function TeamManagementView({ leads, onFilterByMember, onAddLeadForMember }) {
  const { users, addTeamMember, updateUserStatus, deleteUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    title: "",
    role: "member"
  });

  const pendingUsers = users.filter(u => u.status === "pending");
  const approvedUsers = users.filter(u => u.status !== "pending");

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    await addTeamMember(newMember);
    setNewMember({ name: "", email: "", title: "", role: "member" });
    setShowAddForm(false);
  };

  const handleApprove = async (userId) => {
    await updateUserStatus(userId, "approved");
  };

  const handleReject = async (userId) => {
    if (window.confirm("Are you sure you want to decline this registration request?")) {
      await updateUserStatus(userId, "rejected");
    }
  };

  const handleDelete = async (userId, name) => {
    if (window.confirm(`Permanently remove team member "${name}"?`)) {
      await deleteUser(userId);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Users style={{ color: "var(--primary)" }} />
            Sales Team & User Administration
          </h2>
          <p>Authorize new team registrations, manage member permissions, and track individual performance</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <UserPlus size={16} /> Directly Add Member
        </button>
      </div>

      {/* PENDING APPROVAL REQUESTS SECTION */}
      {pendingUsers.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(244, 63, 94, 0.08) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 0 20px rgba(245, 158, 11, 0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-md)",
                background: "rgba(245, 158, 11, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fbbf24"
              }}>
                <Clock size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fef08a" }}>
                  Pending Access Requests ({pendingUsers.length})
                </h3>
                <div style={{ fontSize: "0.78rem", color: "#fde047" }}>
                  These team members have registered and are waiting for your authorization to log in
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pendingUsers.map((pUser) => (
              <div 
                key={pUser.id}
                style={{
                  background: "#101623",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.9rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <img src={pUser.avatar} alt={pUser.name} className="user-avatar" style={{ width: 40, height: 40 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                      {pUser.name}
                      <span className="badge-warning" style={{ marginLeft: "0.6rem", fontSize: "0.68rem" }}>
                        Awaiting Approval
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                      <Mail size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.3rem" }} />
                      {pUser.email} • {pUser.title || "Sales Representative"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <button
                    className="btn btn-sm btn-whatsapp"
                    style={{ fontWeight: 700 }}
                    onClick={() => handleApprove(pUser.id)}
                  >
                    <Check size={14} /> Allow / Approve User
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleReject(pUser.id)}
                  >
                    <XCircle size={14} /> Decline Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIRECT ONBOARDING FORM */}
      {showAddForm && (
        <div className="chart-card" style={{ marginBottom: "1.75rem", border: "1px solid var(--border-accent)" }}>
          <div className="chart-card-header">
            <div className="chart-card-title">
              <UserPlus size={18} style={{ color: "var(--primary)" }} />
              Onboard & Pre-Authorize Team Member
            </div>
          </div>

          <form onSubmit={handleCreateMember} className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jordan Blake"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. jordan@company.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Account Executive"
                value={newMember.title}
                onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Confirm & Add Representative
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE TEAM MEMBERS HEADER */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-secondary)" }}>
          Active Authorized Users ({approvedUsers.length})
        </h3>
      </div>

      {/* Team Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {approvedUsers.map((member) => {
          const memberLeads = leads.filter(l => l.assignedToId === member.id);
          const wonLeads = memberLeads.filter(l => l.status === "Won");
          const totalVal = wonLeads.reduce((acc, c) => acc + (c.estimatedValue || 0), 0);
          const isSuspended = member.status === "rejected";

          return (
            <div 
              key={member.id} 
              className="stat-card"
              style={{ opacity: isSuspended ? 0.65 : 1 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: "0.85rem" }}>
                  <img src={member.avatar} alt={member.name} className="user-avatar" style={{ width: 44, height: 44 }} />
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {member.name}
                    </h3>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                      {member.title || "Sales Representative"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                  <span className={`role-badge ${member.role}`}>
                    {member.role === "admin" ? "ADMIN" : "MEMBER"}
                  </span>
                  {isSuspended && (
                    <span className="badge-danger" style={{ fontSize: "0.62rem", padding: "0.1rem 0.4rem", borderRadius: "9999px" }}>
                      Access Suspended
                    </span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                <Mail size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.3rem" }} />
                {member.email}
              </div>

              <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5rem",
                textAlign: "center",
                marginBottom: "1rem"
              }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Leads</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {memberLeads.length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Won</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-won)" }}>
                    {wonLeads.length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Closed ₹</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#38bdf8" }}>
                    ₹{totalVal >= 100000 ? `${(totalVal / 100000).toFixed(1)}L` : totalVal >= 1000 ? `${(totalVal / 1000).toFixed(1)}k` : totalVal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
                  onClick={() => onAddLeadForMember && onAddLeadForMember(member)}
                  title={`Add a new lead directly assigned to ${member.name}`}
                >
                  <Plus size={14} /> Add Lead
                </button>

                <button
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onFilterByMember(member.id)}
                >
                  View Leads <ArrowRight size={13} />
                </button>

                {member.role !== "admin" && (
                  <button
                    className="btn-icon"
                    style={{ color: "var(--danger)" }}
                    title="Remove user"
                    onClick={() => handleDelete(member.id, member.name)}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
