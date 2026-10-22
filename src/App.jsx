import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AdminDashboard } from "./components/AdminDashboard";
import { MemberDashboard } from "./components/MemberDashboard";
import { LeadTable } from "./components/LeadTable";
import { LeadKanban } from "./components/LeadKanban";
import { TeamManagementView } from "./components/TeamManagementView";
import { LeadModal } from "./components/LeadModal";
import { LeadDetailDrawer } from "./components/LeadDetailDrawer";
import { LoginModal } from "./components/LoginModal";
import { FollowUpAlerts } from "./components/FollowUpAlerts";
import { ShareNetworkModal } from "./components/ShareNetworkModal";
import { AdminProfileModal } from "./components/AdminProfileModal";
import { AuthPage } from "./components/AuthPage";
import { api } from "./services/api";
import { 
  getLeads, 
  saveLeads, 
  resetStorage 
} from "./utils/storage";
import { 
  exportLeadsToCSV, 
  getFollowUpUrgency,
  getTodayDateString 
} from "./utils/helpers";
import { STATUS_OPTIONS, BUSINESS_TYPES, LEAD_SOURCES } from "./data/mockData";
import { 
  Search, 
  Filter, 
  X, 
  LayoutGrid, 
  List, 
  RotateCcw,
  Sparkles,
  UserCheck
} from "lucide-react";

function MainApp() {
  const { currentUser, users, isAdmin, logout } = useAuth();
  const [leads, setLeads] = useState(() => getLeads());
  const [currentTab, setCurrentTab] = useState("dashboard"); // 'dashboard' | 'table' | 'kanban' | 'team'
  const [networkInfo, setNetworkInfo] = useState(null);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all"); // 'all' | 'urgent' | 'overdue' | 'today'
  const [myLeadsOnly, setMyLeadsOnly] = useState(false);

  // Fetch leads from centralized SQLite API
  const refreshLeads = useCallback(async () => {
    try {
      const serverLeads = await api.getLeads();
      if (serverLeads && Array.isArray(serverLeads)) {
        setLeads(serverLeads);
        saveLeads(serverLeads);
      }
    } catch (err) {
      console.warn("Could not sync with API, using cached data", err);
    }
  }, []);

  // Initial load, real-time Supabase listener, and fallback background sync
  useEffect(() => {
    refreshLeads();
    api.getNetworkInfo().then(info => setNetworkInfo(info));

    // Live instant updates when any lead changes in Supabase
    const unsubscribe = api.subscribeToLeads(() => {
      refreshLeads();
    });

    const interval = setInterval(refreshLeads, 15000);
    return () => {
      clearInterval(interval);
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [refreshLeads]);

  // Sync selected lead drawer if lead was edited
  useEffect(() => {
    if (selectedLeadForDetail) {
      const updated = leads.find(l => l.id === selectedLeadForDetail.id);
      if (updated) setSelectedLeadForDetail(updated);
    }
  }, [leads]);

  // Lead CRUD handlers
  const handleSaveLead = async (leadData) => {
    if (editingLead) {
      // Optimistic update
      const updated = leads.map(l => l.id === editingLead.id ? { ...leadData } : l);
      setLeads(updated);
      saveLeads(updated);
      setEditingLead(null);

      try {
        await api.updateLead(editingLead.id, leadData);
      } catch (e) {
        console.warn("Failed to update on server", e);
      }
    } else {
      // Optimistic update
      const updated = [leadData, ...leads];
      setLeads(updated);
      saveLeads(updated);

      try {
        await api.createLead(leadData);
      } catch (e) {
        console.warn("Failed to create on server", e);
      }
    }
    refreshLeads();
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm(`Are you sure you want to delete lead ${leadId}?`)) {
      const updated = leads.filter(l => l.id !== leadId);
      setLeads(updated);
      saveLeads(updated);
      if (selectedLeadForDetail?.id === leadId) {
        setSelectedLeadForDetail(null);
      }

      try {
        await api.deleteLead(leadId);
      } catch (e) {
        console.warn("Failed to delete on server", e);
      }
    }
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    const today = getTodayDateString();
    const noteEntry = `[${today}] Status updated to ${newStatus}`;
    const target = leads.find(l => l.id === leadId);
    const combinedNotes = target?.notes ? `${noteEntry}\n${target.notes}` : noteEntry;

    // Optimistic update
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          lastContacted: today,
          notes: combinedNotes
        };
      }
      return l;
    });
    setLeads(updated);
    saveLeads(updated);

    try {
      await api.updateLeadStatus(leadId, newStatus, today, combinedNotes);
    } catch (e) {
      console.warn("Failed to update status on server", e);
    }
  };

  const handleAddNote = async (leadId, notesContent) => {
    // Optimistic update
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, notes: notesContent };
      }
      return l;
    });
    setLeads(updated);
    saveLeads(updated);

    try {
      await api.appendLeadNotes(leadId, notesContent);
    } catch (e) {
      console.warn("Failed to append note on server", e);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Reset all leads and users to initial demo data in SQLite database?")) {
      try {
        await api.resetDatabase();
      } catch (e) {
        resetStorage();
      }
      await refreshLeads();
      alert("Database reset to initial demo state successfully.");
    }
  };

  // Filter handlers from dashboard clicks
  const handleFilterByMember = (memberId) => {
    setMemberFilter(memberId);
    setCurrentTab("table");
  };

  const handleFilterByStatus = (statusValue) => {
    setStatusFilter(statusValue);
    setCurrentTab("table");
  };

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setEditingLead(lead);
    setIsAddModalOpen(true);
  };

  // Filtered Leads calculation
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. My Leads Only toggle
      if (myLeadsOnly && currentUser && lead.assignedToId !== currentUser.id) {
        return false;
      }

      // 2. Member filter (admin view)
      if (memberFilter !== "all" && lead.assignedToId !== memberFilter) {
        return false;
      }

      // 3. Status filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      // 4. Business Type filter
      if (businessTypeFilter !== "all" && lead.businessType !== businessTypeFilter) {
        return false;
      }

      // 5. Source filter
      if (sourceFilter !== "all" && lead.source !== sourceFilter) {
        return false;
      }

      // 6. Urgency filter
      if (urgencyFilter !== "all") {
        const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
        if (urgencyFilter === "urgent" && urgency.level !== "overdue" && urgency.level !== "today") return false;
        if (urgencyFilter === "overdue" && urgency.level !== "overdue") return false;
        if (urgencyFilter === "today" && urgency.level !== "today") return false;
      }

      // 7. Text Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (lead.id || "").toLowerCase().includes(q);
        const matchesBusiness = (lead.businessName || "").toLowerCase().includes(q);
        const matchesContact = (lead.contactName || "").toLowerCase().includes(q);
        const matchesPhone = (lead.phone || "").toLowerCase().includes(q);
        const matchesCity = (lead.city || "").toLowerCase().includes(q);
        const matchesNeed = (lead.need || "").toLowerCase().includes(q);
        const matchesNotes = (lead.notes || "").toLowerCase().includes(q);
        const matchesMember = (lead.assignedToName || "").toLowerCase().includes(q);

        return (
          matchesId || 
          matchesBusiness || 
          matchesContact || 
          matchesPhone || 
          matchesCity || 
          matchesNeed || 
          matchesNotes || 
          matchesMember
        );
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, memberFilter, businessTypeFilter, sourceFilter, urgencyFilter, myLeadsOnly, currentUser]);

  const hasActiveFilters = 
    statusFilter !== "all" || 
    memberFilter !== "all" || 
    businessTypeFilter !== "all" || 
    sourceFilter !== "all" || 
    urgencyFilter !== "all" || 
    myLeadsOnly || 
    searchQuery.trim().length > 0;

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setMemberFilter("all");
    setBusinessTypeFilter("all");
    setSourceFilter("all");
    setUrgencyFilter("all");
    setMyLeadsOnly(false);
  };

  const handleExportCSV = () => {
    const filename = `leads_export_${currentUser?.name?.replace(/\s+/g, "_") || "crm"}_${getTodayDateString()}.csv`;
    exportLeadsToCSV(filteredLeads, filename);
  };

  // Leads applicable to current user for banner alerts
  const alertLeadsScope = isAdmin ? leads : leads.filter(l => l.assignedToId === currentUser?.id);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenUserModal={() => setIsLoginModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        totalLeadsCount={leads.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Urgent Follow-up Banner */}
        <FollowUpAlerts 
          leads={alertLeadsScope}
          onSelectUrgentFilter={(type) => {
            setUrgencyFilter(type);
            setCurrentTab("table");
          }}
          onOpenLeadDetail={(lead) => setSelectedLeadForDetail(lead)}
        />

        {/* Tab 1: Dashboard View */}
        {currentTab === "dashboard" && (
          isAdmin ? (
            <AdminDashboard
              leads={leads}
              users={users}
              onFilterByMember={handleFilterByMember}
              onFilterByStatus={handleFilterByStatus}
              onNavigateToTable={() => setCurrentTab("table")}
              onNavigateToTeam={() => setCurrentTab("team")}
            />
          ) : (
            <MemberDashboard
              currentUser={currentUser}
              leads={leads}
              onOpenAddModal={handleOpenAddModal}
              onOpenLeadDetail={(lead) => setSelectedLeadForDetail(lead)}
              onNavigateToTable={() => {
                setMyLeadsOnly(true);
                setCurrentTab("table");
              }}
            />
          )
        )}

        {/* Tab 2: Full Leads Table View */}
        {currentTab === "table" && (
          <div>
            <div className="page-header">
              <div className="page-title-group">
                <h2>Leads Directory & Log</h2>
                <p>
                  Showing {filteredLeads.length} of {leads.length} recorded leads
                  {isAdmin ? " (All company leads)" : ` (Assigned to ${currentUser?.name})`}
                </p>
              </div>

              <div className="header-actions">
                {/* Toggle between All and My leads */}
                <button
                  className={`btn ${myLeadsOnly ? "btn-primary" : "btn-outline"} btn-sm`}
                  onClick={() => setMyLeadsOnly(!myLeadsOnly)}
                >
                  <UserCheck size={14} />
                  <span>{myLeadsOnly ? "Showing: My Leads Only" : "Filter: My Leads"}</span>
                </button>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleOpenAddModal}
                >
                  + Add Lead
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-row-top">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by ID, business, contact, phone, city, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn-icon"
                      style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-dropdowns">
                  {/* Status Filter */}
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  {/* Urgency Filter */}
                  <select
                    className="filter-select"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <option value="all">Follow-Up: All</option>
                    <option value="urgent">Overdue & Due Today</option>
                    <option value="overdue">Overdue Only</option>
                    <option value="today">Due Today Only</option>
                  </select>

                  {/* Business Type Filter */}
                  <select
                    className="filter-select"
                    value={businessTypeFilter}
                    onChange={(e) => setBusinessTypeFilter(e.target.value)}
                  >
                    <option value="all">All Business Types</option>
                    {BUSINESS_TYPES.map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>

                  {/* Source Filter */}
                  <select
                    className="filter-select"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                  >
                    <option value="all">All Sources</option>
                    {LEAD_SOURCES.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>

                  {/* Admin member filter */}
                  {isAdmin && (
                    <select
                      className="filter-select"
                      value={memberFilter}
                      onChange={(e) => setMemberFilter(e.target.value)}
                    >
                      <option value="all">All Team Members</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  )}

                  {hasActiveFilters && (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={handleClearFilters}
                      style={{ color: "var(--danger)" }}
                    >
                      <RotateCcw size={13} /> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="active-filters-chips">
                  <span>Active Filters:</span>
                  {statusFilter !== "all" && (
                    <span className="filter-chip">
                      Status: {statusFilter}
                      <button className="chip-remove-btn" onClick={() => setStatusFilter("all")}><X size={12} /></button>
                    </span>
                  )}
                  {urgencyFilter !== "all" && (
                    <span className="filter-chip" style={{ background: "rgba(244, 63, 94, 0.15)", borderColor: "rgba(244, 63, 94, 0.3)", color: "#fb7185" }}>
                      Follow-up: {urgencyFilter}
                      <button className="chip-remove-btn" onClick={() => setUrgencyFilter("all")}><X size={12} /></button>
                    </span>
                  )}
                  {businessTypeFilter !== "all" && (
                    <span className="filter-chip">
                      Type: {businessTypeFilter}
                      <button className="chip-remove-btn" onClick={() => setBusinessTypeFilter("all")}><X size={12} /></button>
                    </span>
                  )}
                  {sourceFilter !== "all" && (
                    <span className="filter-chip">
                      Source: {sourceFilter}
                      <button className="chip-remove-btn" onClick={() => setSourceFilter("all")}><X size={12} /></button>
                    </span>
                  )}
                  {memberFilter !== "all" && (
                    <span className="filter-chip">
                      Member: {users.find(u => u.id === memberFilter)?.name}
                      <button className="chip-remove-btn" onClick={() => setMemberFilter("all")}><X size={12} /></button>
                    </span>
                  )}
                  {myLeadsOnly && (
                    <span className="filter-chip">
                      Only My Leads
                      <button className="chip-remove-btn" onClick={() => setMyLeadsOnly(false)}><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Leads Table */}
            <LeadTable
              leads={filteredLeads}
              onViewLead={(lead) => setSelectedLeadForDetail(lead)}
              onEditLead={handleOpenEditModal}
              onDeleteLead={handleDeleteLead}
              onQuickStatusChange={handleQuickStatusChange}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {/* Tab 3: Kanban Pipeline View */}
        {currentTab === "kanban" && (
          <div>
            <div className="page-header">
              <div className="page-title-group">
                <h2>Visual Deal Pipeline</h2>
                <p>Move leads across deal stages and monitor conversion bottlenecks</p>
              </div>

              <div className="header-actions">
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
                  + Add Lead
                </button>
              </div>
            </div>

            <LeadKanban
              leads={filteredLeads}
              onViewLead={(lead) => setSelectedLeadForDetail(lead)}
              onMoveStage={handleQuickStatusChange}
            />
          </div>
        )}

        {/* Tab 4: Admin Team Management View */}
        {currentTab === "team" && isAdmin && (
          <TeamManagementView
            leads={leads}
            onFilterByMember={handleFilterByMember}
          />
        )}
      </main>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        editingLead={editingLead}
        existingLeads={leads}
        currentUser={currentUser}
        users={users}
        isAdmin={isAdmin}
      />

      {/* Lead Detail & Activity Drawer */}
      <LeadDetailDrawer
        lead={selectedLeadForDetail}
        isOpen={Boolean(selectedLeadForDetail)}
        onClose={() => setSelectedLeadForDetail(null)}
        onEditLead={(lead) => {
          setSelectedLeadForDetail(null);
          handleOpenEditModal(lead);
        }}
        onAddNote={handleAddNote}
        onUpdateStatus={handleQuickStatusChange}
      />

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Share / Multi-device Network Modal */}
      <ShareNetworkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        networkInfo={networkInfo}
      />

      {/* Admin ID & Password Settings Modal */}
      <AdminProfileModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
      />
    </div>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
