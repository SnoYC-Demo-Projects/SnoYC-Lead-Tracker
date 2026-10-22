import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("your-project-id")
);

if (!isSupabaseConfigured) {
  console.info(
    "%c[Supabase]%c Credentials not configured yet in .env file. Falling back to local storage. See .env.example or supabase-schema.sql to connect your Supabase project.",
    "background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
    "color: #fbbf24; padding-left: 6px;"
  );
}

// Export the initialized client or null if not configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
