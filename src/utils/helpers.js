// Utility helper functions for Lead Tracker

/**
 * Format date string into human friendly format (e.g. "Oct 22, 2026")
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}

/**
 * Get current date in YYYY-MM-DD
 */
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Determine follow up status: 'overdue' | 'today' | 'upcoming' | 'none'
 */
export function getFollowUpUrgency(nextFollowUpDate, status) {
  if (!nextFollowUpDate || status === "Won" || status === "Lost") {
    return { level: "completed", label: "Completed / N/A", badgeClass: "badge-neutral" };
  }

  const today = getTodayDateString();

  if (nextFollowUpDate < today) {
    return { level: "overdue", label: "Overdue", badgeClass: "badge-danger" };
  } else if (nextFollowUpDate === today) {
    return { level: "today", label: "Due Today", badgeClass: "badge-warning" };
  } else {
    return { level: "upcoming", label: "Upcoming", badgeClass: "badge-info" };
  }
}

/**
 * Clean phone numbers to digits only for WhatsApp
 */
export function sanitizePhoneForWhatsApp(phone) {
  if (!phone) return "";
  // strip all non digits
  let cleaned = phone.replace(/\D/g, "");
  // If starts with 0 or doesn't have country code, keep clean representation
  return cleaned;
}

/**
 * Generate WhatsApp direct click URL with customizable pre-filled message
 */
export function getWhatsAppUrl(phone, contactName, businessName) {
  const cleaned = sanitizePhoneForWhatsApp(phone);
  if (!cleaned) return "#";
  const greeting = `Hi ${contactName || "there"}, reaching out from our team regarding ${businessName || "your business requirement"}. How is your schedule today for a quick chat?`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(greeting)}`;
}

/**
 * Generate Tel URL
 */
export function getTelUrl(phone) {
  if (!phone) return "#";
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

/**
 * Generate next sequential Lead ID
 */
export function generateNextLeadId(existingLeads) {
  let highestNum = 1000;
  existingLeads.forEach(lead => {
    if (lead.id && lead.id.startsWith("LD-")) {
      const num = parseInt(lead.id.replace("LD-", ""), 10);
      if (!isNaN(num) && num > highestNum) {
        highestNum = num;
      }
    }
  });
  return `LD-${highestNum + 1}`;
}

/**
 * Export array of leads into a downloadable CSV file
 */
export function exportLeadsToCSV(leads, filename = "leads_export.csv") {
  const headers = [
    "Lead ID",
    "Date Logged",
    "Business Name",
    "Owner / Contact Name",
    "Phone / WhatsApp",
    "Area / City",
    "Business Type",
    "Source",
    "Need",
    "Status",
    "Last Contacted",
    "Next Follow-up Date",
    "Notes",
    "Assigned Team Member"
  ];

  const rows = leads.map(lead => [
    lead.id || "",
    lead.dateLogged || "",
    lead.businessName || "",
    lead.contactName || "",
    lead.phone || "",
    lead.city || "",
    lead.businessType || "",
    lead.source || "",
    lead.need || "",
    lead.status || "",
    lead.lastContacted || "",
    lead.nextFollowUp || "",
    lead.notes || "",
    lead.assignedToName || ""
  ]);

  const escapeCSV = (value) => {
    const stringVal = String(value ?? "");
    if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const csvContent = "\uFEFF" + [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format number into Indian Rupees (₹)
 * e.g. 50000 -> "₹50,000", 1500000 -> "₹15,00,000"
 */
export function formatRupees(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

/**
 * Check if a lead is owned by or assigned to a user (Admin has universal access)
 */
export function isLeadOwnedByUser(lead, user) {
  if (!lead || !user) return false;
  if (user.role === "admin") return true;
  if (lead.assignedToId && String(lead.assignedToId) === String(user.id)) return true;
  if (lead.assignedToName && user.name && lead.assignedToName.toLowerCase().trim() === user.name.toLowerCase().trim()) return true;
  return false;
}
