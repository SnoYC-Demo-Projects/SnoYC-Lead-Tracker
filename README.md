# SnoYC Lead Tracker 🎯

A high-performance Enterprise Lead Pipeline & Team CRM platform built with React, Vite, and Supabase.

---

## ✨ Features

- **Executive & Member Dashboards**: Role-based access for Administrators and Sales Team Members.
- **Visual Deal Pipeline (Kanban)**: Drag and move leads through dynamic stages (New, Contacted, In Discussion, Proposal Sent, Negotiation, Won, Lost).
- **Interactive Leads Table**: Advanced multi-attribute search, urgency indicators, stage filtering, and CSV export.
- **Real-Time Cloud Synchronization**: Instant live sync across devices and team members powered by Supabase Realtime.
- **Secure Authentication Portal**: Modern Sign In and Sign Up gate with role-based authorization.
- **Mobile & Multi-Device Ready**: Responsive interface accessible on desktops, laptops, and smartphones.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SnoYC-Demo-Projects/SnoYC-Lead-Tracker.git
cd SnoYC-Lead-Tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Run [`supabase-schema.sql`](./supabase-schema.sql) in your **Supabase SQL Editor**.
2. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the development server
```bash
npm run dev
```

---

## 📦 Deployment
Deploy with 1-click on **Vercel** or **Netlify**. See [**`DEPLOYMENT.md`**](./DEPLOYMENT.md) for full instructions.
