// Clean production users, statuses, business types, and empty leads array
export const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Administrator",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    status: "approved",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
    title: "System Administrator"
  }
];

export const STATUS_OPTIONS = [
  { value: "New", label: "New Lead", color: "#0284c7", bg: "#e0f2fe", border: "#bae6fd" },
  { value: "Contacted", label: "Contacted", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" },
  { value: "In Discussion", label: "In Discussion", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  { value: "Proposal Sent", label: "Proposal Sent", color: "#c2410c", bg: "#ffedd5", border: "#fed7aa" },
  { value: "Negotiation", label: "Negotiation", color: "#7e22ce", bg: "#f3e8ff", border: "#e9d5ff" },
  { value: "Won", label: "Closed / Won", color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
  { value: "Lost", label: "Lost / Dropped", color: "#b91c1c", bg: "#fee2e2", border: "#fecaca" }
];

export const BUSINESS_TYPES = [
  "Retail Store",
  "Restaurant & Hospitality",
  "Real Estate & Construction",
  "SaaS & Tech",
  "Healthcare & Clinic",
  "Education & Coaching",
  "Manufacturing & Industrial",
  "Logistics & Cargo",
  "Finance & Accounting",
  "Digital Agency / Marketing",
  "Other"
];

export const LEAD_SOURCES = [
  "Cold Call",
  "WhatsApp Direct",
  "Instagram / Meta Ads",
  "Google Maps / Local SEO",
  "Website Inquiry",
  "Referral",
  "Walk-in",
  "Exhibition / Trade Fair",
  "LinkedIn",
  "Other"
];

// Production initial leads: 0 leads (clean state)
export const INITIAL_LEADS = [];

