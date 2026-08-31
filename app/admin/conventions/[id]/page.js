"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAdminSession } from "@/lib/useAdminSession";
import PlayerManager from "./PlayerManager";
import PlayerList from "./SubmissionsList";

export default function AdminConventionPage({ params }) {
  const { session, loading } = useAdminSession();
  const conventionId = params.id;

  const [convention, setConvention] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [cards, setCards] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState("characters");

  const loadAll = useCallback(async () => {
    const [{ data: conv }, { data: chars }, { data: cardRows }, { data: subs }] = await Promise.all([
      supabase.from("conventions").select("*").eq("id", conventionId).single(),
      supabase.from("characters").select("*").eq("convention_id", conventionId).order("name"),
      supabase.from("bingo_cards").select("*").eq("convention_id", conventionId).order("created_at"),
      supabase.from("submissions").select("*").eq("convention_id", conventionId).order("created_at", { ascending: false }),
    ]);

    setConvention(conv ?? null);
    setCharacters(chars ?? []);
    setCards(cardRows ?? []);
    setSubmissions(subs ?? []);
  }, [conventionId]);

  useEffect(() => {
    if (session) loadAll();
  }, [session, loadAll]);

  if (loading || !session) {
    return <p className="text-parchment/50">Checking credentials…</p>;
  }

  if (!convention) {
    return <p className="text-parchment/50">Loading convention…</p>;
  }

  const tabs = [
    { id: "characters", label: `Characters (${characters.length})` },
    { id: "cards", label: `Bingo cards (${cards.length})` },
    { id: "submissions", label: `Submissions (${submissions.length})` },
  ];

  return (
    <div>
      <p className="eyebrow mb-3">Admin · Convention</p>
      <h1 className="mb-8 text-4xl font-bold">{convention.name}</h1>

      <div className="mb-6 flex gap-2 border-b border-parchment/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`font-mono text-xs uppercase tracking-wide ${
              tab === t.id ? "text-flare" : "text-parchment/50 hover:text-parchment"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "characters" && (
        <PlayerManager conventionId={conventionId} characters={characters} onChange={loadAll} />
      )}
      {tab === "cards" && (
        <BingoCardManager
          conventionId={conventionId}
          characters={characters}
          cards={cards}
          onChange={loadAll}
        />
      )}
      {tab === "submissions" && <PlayerList submissions={submissions} />}
    </div>
  );
}
