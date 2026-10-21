import React from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Layers, 
  LayoutDashboard, 
  TableProperties, 
  Kanban, 
  Users, 
  PlusCircle, 
  Download, 
  LogOut, 
  RefreshCw,
  Sparkles,
  Key,
  Settings
} from "lucide-react";

export function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenAddModal, 
  onOpenUserModal, 
  onOpenShareModal,
  onOpenAdminSettings,
  onExportCSV,
  onResetData,
  totalLeadsCount 
}) {
  const { currentUser, isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon-wrapper">
          <img src="/logo.png" alt="SnoYC Lead Logo" className="brand-logo-img" />
        </div>
        <div className="brand-text">
          <h1>SnoYC Lead</h1>
          <span>{isAdmin ? "Admin Headquarters" : "Sales Representative Portal"}</span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentTab("dashboard")}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === "table" ? "active" : ""}`}
          onClick={() => setCurrentTab("table")}
        >
          <TableProperties size={16} />
          <span>Leads Table</span>
          <span className="nav-tab-badge">{totalLeadsCount}</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === "kanban" ? "active" : ""}`}
          onClick={() => setCurrentTab("kanban")}
        >
          <Kanban size={16} />
          <span>Pipeline</span>
        </button>

        {isAdmin && (
          <button
            className={`nav-tab-btn ${currentTab === "team" ? "active" : ""}`}
            onClick={() => setCurrentTab("team")}
          >
            <Users size={16} />
            <span>Team Overview</span>
          </button>
        )}
      </nav>

      <div className="nav-actions">
        <button 
          className="btn btn-outline btn-sm" 
          onClick={onOpenShareModal}
          title="Connect team member phones/laptops"
          style={{ borderColor: "rgba(52, 211, 153, 0.4)", color: "#34d399" }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
          <span>Team Link</span>
        </button>

        <button 
          className="btn btn-outline btn-sm" 
          onClick={onExportCSV}
          title="Export Leads to CSV / Excel"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>

        <button 
          className="btn btn-primary btn-sm"
          onClick={onOpenAddModal}
        >
          <PlusCircle size={16} />
          <span>Add Lead</span>
        </button>

        {currentUser && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isAdmin && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={onOpenAdminSettings}
                title="Change Admin Email/ID & Password"
                style={{ borderColor: "rgba(236, 72, 153, 0.4)", color: "#f472b6" }}
              >
                <Key size={14} />
                <span>ID & Password</span>
              </button>
            )}

            <div 
              className="user-pill" 
              onClick={isAdmin ? onOpenAdminSettings : onOpenUserModal}
              style={{ cursor: "pointer" }}
              title="Click to view credentials"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="user-avatar" 
              />
              <div className="user-info">
                <span className="user-name">{currentUser.name}</span>
                <span className={`role-badge ${currentUser.role}`}>
                  {currentUser.role === "admin" ? "ADMIN" : "MEMBER"}
                </span>
              </div>
            </div>

            <button 
              className="btn-icon" 
              onClick={logout}
              title="Sign Out"
              style={{ color: "var(--text-muted)" }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
