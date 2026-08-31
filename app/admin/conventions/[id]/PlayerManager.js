"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function PlayerManager({ conventionId, characters, onChange }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    let image_url = null;

    if (file) {
      const path = `${conventionId}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("character-images")
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from("character-images").getPublicUrl(path);
      image_url = data.publicUrl;
    }

    const { error: insertError } = await supabase.from("characters").insert({
      convention_id: conventionId,
      name: name.trim(),
      image_url,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setName("");
    setFile(null);
    setSaving(false);
    onChange();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this character? It will also come off any bingo cards using it.")) return;
    await supabase.from("characters").delete().eq("id", id);
    onChange();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="card-shell space-y-4">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="char-name">Character name</label>
          <input
            id="char-name"
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Nausicaä"
            required
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="char-image">Reference image (optional)</label>
          <input
            id="char-image"
            type="file"
            accept="image/*"
            className="field-input file:mr-3 file:rounded-sm file:border-0 file:bg-flare file:px-3 file:py-1.5 file:font-mono file:text-xs file:uppercase file:text-ink"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        {error && <p className="text-sm text-flare">{error}</p>}
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Adding…" : "Add character"}
        </button>
      </form>

      {characters.length === 0 ? (
        <p className="text-sm text-parchment/50">No characters added yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {characters.map((c) => (
            <li key={c.id} className="card-shell relative p-3">
              <div className="mb-2 aspect-square overflow-hidden rounded-sm bg-parchment/10">
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-[10px] text-parchment/30">
                    No image
                  </div>
                )}
              </div>
              <p className="truncate text-sm font-medium">{c.name}</p>
              <button
                onClick={() => handleDelete(c.id)}
                className="mt-2 font-mono text-[10px] uppercase tracking-wide text-flare/80 hover:text-flare"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
