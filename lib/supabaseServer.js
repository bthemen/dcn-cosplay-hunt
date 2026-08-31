import { createClient } from "@supabase/supabase-js";

// Server Component client. Uses the anon key too — reads of public data
// (conventions, characters, cards) are allowed by RLS for everyone.
// We never use the service-role key here since this file ships in a
// server bundle that we don't need elevated privileges for.
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
