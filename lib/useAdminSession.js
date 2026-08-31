"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Redirects to /admin/login if there's no active session, and hands back
// the session + a loading flag otherwise. Being logged in at all is what
// makes someone an Admin here (see supabase/schema.sql policies) — only
// give this login to people you trust.
export function useAdminSession() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      if (!data.session) router.replace("/admin/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) router.replace("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return { session, loading: session === undefined };
}
