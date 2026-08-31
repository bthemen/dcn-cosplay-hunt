"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="mx-auto max-w-sm">
      <p className="eyebrow mb-3">Admin</p>
      <h1 className="mb-8 text-3xl font-bold">Sign in</h1>

      <form onSubmit={handleSubmit} className="card-shell space-y-4">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-flare">{error}</p>}

        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-parchment/40">
        Admin accounts are created in the Supabase dashboard under
        Authentication → Users — there&rsquo;s no public sign-up.
      </p>
    </div>
  );
}
