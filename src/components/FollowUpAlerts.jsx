import React from "react";
import { AlertTriangle, Clock, ArrowRight, PhoneCall, MessageCircle } from "lucide-react";
import { getFollowUpUrgency, getWhatsAppUrl, getTelUrl } from "../utils/helpers";

export function FollowUpAlerts({ leads, onSelectUrgentFilter, onOpenLeadDetail }) {
  // Count overdue & today
  const urgentLeads = leads.filter((lead) => {
    const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
    return urgency.level === "overdue" || urgency.level === "today";
  });

  const overdueCount = leads.filter((lead) => {
    const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
    return urgency.level === "overdue";
  }).length;

  const todayCount = leads.filter((lead) => {
    const urgency = getFollowUpUrgency(lead.nextFollowUp, lead.status);
    return urgency.level === "today";
  }).length;

  if (urgentLeads.length === 0) return null;

  return (
    <div className="followup-alert-banner">
      <div className="followup-alert-content">
        <div className="alert-pulse-icon">
          <AlertTriangle size={22} />
        </div>
        <div>
          <div className="alert-heading">
            Action Required: {urgentLeads.length} Leads Need Follow-up Attention
          </div>
          <div className="alert-desc">
            {overdueCount > 0 && <span><strong>{overdueCount}</strong> overdue follow-ups</span>}
            {overdueCount > 0 && todayCount > 0 && <span> • </span>}
            {todayCount > 0 && <span><strong>{todayCount}</strong> scheduled for today</span>}
            {" "}— Reach out now via WhatsApp or Phone to prevent deal drop-offs.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onSelectUrgentFilter("urgent")}
        >
          <Clock size={14} /> Filter Urgent Leads ({urgentLeads.length})
        </button>
      </div>
    </div>
  );
}
