import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard: don't crash the app if env vars are missing/placeholder
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co");

if (!isConfigured) {
  console.warn(
    "[CivicAlert] Supabase is not configured yet.\n" +
      "Edit frontend/.env and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n" +
      "Auth features will be disabled until then."
  );
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseReady = isConfigured;
