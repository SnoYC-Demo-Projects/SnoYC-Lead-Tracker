# 🚀 SnoYC Lead CRM - Production Hosting Guide (Supabase)

With Supabase, SnoYC Lead connects directly to your cloud PostgreSQL database. This means you can host the website **for free on any static host or serverless platform** (Vercel, Netlify, Render, Cloudflare Pages, etc.) without needing a persistent disk or a custom backend server.

---

## 📋 Step 1: Set Up Supabase (2 Minutes)

1. Go to **[supabase.com](https://supabase.com)** and create a free account (or log in).
2. Click **"New Project"** and give it a name (e.g., `snoyc-leads`).
3. In your Supabase project dashboard, navigate to the **SQL Editor** on the left menu.
4. Open the [**`supabase-schema.sql`**](file:///d:/SnoYC/Lead%20Tracker/supabase-schema.sql) file from this repository, copy all the SQL code, paste it into the SQL Editor, and click **Run**.
   * *This creates the `users` and `leads` tables, enables Row Level Security, sets up Realtime live updates, and seeds the default Admin account.*
5. Navigate to **Project Settings** → **API**.
6. Copy your:
   * **Project URL**
   * **anon / public Key**

---

## ⚡ Step 2: Deploy to Vercel (Recommended - 1 Click)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Migrate database to Supabase"
   git push origin main
   ```
2. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
3. Click **"Add New..."** → **"Project"** and import your repository.
4. Under **Environment Variables**, add:
   * `VITE_SUPABASE_URL`: *(your Supabase project URL)*
   * `VITE_SUPABASE_ANON_KEY`: *(your Supabase anon key)*
5. Click **Deploy**. Vercel will build and deploy your site in ~30 seconds with a free worldwide HTTPS link!

---

## 🌐 Alternative Option: Netlify

1. Go to **[netlify.com](https://netlify.com)** and import your GitHub repository.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Under **Site configuration** → **Environment variables**, add:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 💻 Running Locally

1. Open [`.env`](file:///d:/SnoYC/Lead%20Tracker/.env) in your editor and paste your Supabase keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`. Any changes will instantly synchronize to your live Supabase database!

---

## 🔑 Default Administrator Credentials

* **Email**: `admin@company.com`
* **Password**: `admin123`
*(Created automatically by the SQL schema script)*
