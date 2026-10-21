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
  { value: "New", label: "New Lead", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.3)" },
  { value: "Contacted", label: "Contacted", color: "#818cf8", bg: "rgba(129, 140, 248, 0.15)", border: "rgba(129, 140, 248, 0.3)" },
  { value: "In Discussion", label: "In Discussion", color: "#facc15", bg: "rgba(250, 204, 21, 0.15)", border: "rgba(250, 204, 21, 0.3)" },
  { value: "Proposal Sent", label: "Proposal Sent", color: "#fb923c", bg: "rgba(251, 146, 60, 0.15)", border: "rgba(251, 146, 60, 0.3)" },
  { value: "Negotiation", label: "Negotiation", color: "#c084fc", bg: "rgba(192, 132, 252, 0.15)", border: "rgba(192, 132, 252, 0.3)" },
  { value: "Won", label: "Closed / Won", color: "#4ade80", bg: "rgba(74, 222, 128, 0.15)", border: "rgba(74, 222, 128, 0.3)" },
  { value: "Lost", label: "Lost / Dropped", color: "#f87171", bg: "rgba(248, 113, 113, 0.15)", border: "rgba(248, 113, 113, 0.3)" }
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

