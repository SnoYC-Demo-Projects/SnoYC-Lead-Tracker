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

  const handleTabSelect = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="navbar">
      <div className="navbar-main-row">
        {/* Brand */}
        <div className="nav-brand">
          <div className="brand-icon-wrapper">
            <img src="/logo.png" alt="SnoYC Lead Logo" className="brand-logo-img" />
          </div>
          <div className="brand-text">
            <h1>SnoYC Lead</h1>
            <span>{isAdmin ? "Admin HQ" : "Sales Portal"}</span>
          </div>
        </div>

        {/* Desktop-only Navigation Tabs */}
        <nav className="nav-tabs nav-tabs-desktop">
          <button
            className={`nav-tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleTabSelect("dashboard")}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === "table" ? "active" : ""}`}
            onClick={() => handleTabSelect("table")}
          >
            <TableProperties size={16} />
            <span>Leads Table</span>
            <span className="nav-tab-badge">{totalLeadsCount}</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === "kanban" ? "active" : ""}`}
            onClick={() => handleTabSelect("kanban")}
          >
            <Kanban size={16} />
            <span>Pipeline</span>
          </button>

          {isAdmin && (
            <button
              className={`nav-tab-btn ${currentTab === "team" ? "active" : ""}`}
              onClick={() => handleTabSelect("team")}
            >
              <Users size={16} />
              <span>Team Overview</span>
            </button>
          )}
        </nav>

        {/* Right Section: Add Lead + User Profile + Logout */}
        <div className="nav-actions">
          {/* Secondary Tools (Desktop only) */}
          <div className="nav-secondary-desktop">
            <button 
              className="btn btn-outline btn-sm nav-tool-btn" 
              onClick={onOpenShareModal}
              title="Connect team member phones/laptops"
              style={{ borderColor: "rgba(16, 185, 129, 0.4)", color: "#059669" }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <span>Team Link</span>
            </button>

            <button 
              className="btn btn-outline btn-sm nav-tool-btn" 
              onClick={onExportCSV}
              title="Export Leads to CSV / Excel"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {isAdmin && (
              <button 
                className="btn btn-outline btn-sm nav-tool-btn"
                onClick={onOpenAdminSettings}
                title="Change Admin ID & Password"
                style={{ borderColor: "rgba(217, 119, 6, 0.4)", color: "#d97706" }}
              >
                <Key size={13} />
                <span>ID & Password</span>
              </button>
            )}
          </div>

          {/* Add Lead Primary CTA */}
          <button 
            className="btn btn-primary btn-sm nav-add-btn"
            onClick={onOpenAddModal}
            title="Log new prospective client"
          >
            <PlusCircle size={15} />
            <span className="add-btn-text">Add Lead</span>
          </button>

          {/* User Profile Pill & Sign Out */}
          {currentUser && (
            <div className="nav-user-cluster">
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
                className="btn-icon nav-logout-btn" 
                onClick={logout}
                title="Sign Out"
                style={{ color: "var(--text-muted)" }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub Row: Quick Action Chips & Mobile Tab Navigator */}
      <div className="navbar-mobile-row">
        {/* Mobile secondary tools row */}
        <div className="mobile-tools-bar">
          <button 
            className="mobile-tool-chip" 
            onClick={onOpenShareModal}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span>Team Link</span>
          </button>

          <button 
            className="mobile-tool-chip" 
            onClick={onExportCSV}
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>

          {isAdmin && (
            <button 
              className="mobile-tool-chip admin-chip"
              onClick={onOpenAdminSettings}
            >
              <Key size={12} />
              <span>ID & Password</span>
            </button>
          )}
        </div>

        {/* Mobile Navigation Tabs */}
        <nav className="nav-tabs nav-tabs-mobile">
          <button
            className={`nav-tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleTabSelect("dashboard")}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === "table" ? "active" : ""}`}
            onClick={() => handleTabSelect("table")}
          >
            <TableProperties size={15} />
            <span>Leads Table</span>
            <span className="nav-tab-badge">{totalLeadsCount}</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === "kanban" ? "active" : ""}`}
            onClick={() => handleTabSelect("kanban")}
          >
            <Kanban size={15} />
            <span>Pipeline</span>
          </button>

          {isAdmin && (
            <button
              className={`nav-tab-btn ${currentTab === "team" ? "active" : ""}`}
              onClick={() => handleTabSelect("team")}
            >
              <Users size={15} />
              <span>Team</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
