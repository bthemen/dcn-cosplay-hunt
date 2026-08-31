"use client";

import { createClient } from "@supabase/supabase-js";

// Public (anon) client — safe to use in the browser.
// RLS policies (see supabase/schema.sql) control what anon/authenticated
// users can actually read and write.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
