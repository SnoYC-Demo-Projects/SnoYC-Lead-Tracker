-- =========================================================================
--  SnoYC Lead CRM - Supabase Database Schema
--  Run this script in your Supabase Project -> SQL Editor -> Run
-- =========================================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'approved',
  avatar TEXT,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  "dateLogged" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  "businessType" TEXT,
  source TEXT,
  need TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  "lastContacted" TEXT,
  "nextFollowUp" TEXT,
  notes TEXT,
  "assignedToId" TEXT,
  "assignedToName" TEXT,
  "estimatedValue" NUMERIC DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for API access
DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
CREATE POLICY "Allow all access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to leads" ON public.leads;
CREATE POLICY "Allow all access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable Realtime updates for live collaboration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
END $$;

-- 5. Seed Initial Default Admin Account
INSERT INTO public.users (id, name, email, password, role, status, avatar, title)
VALUES (
  'user-admin',
  'Administrator',
  'admin@company.com',
  'admin123',
  'admin',
  'approved',
  'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
  'System Administrator'
) ON CONFLICT (email) DO NOTHING;
