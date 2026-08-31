"use client";

import { useEffect, useRef, useState } from "react";

function initialsFor(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HunterProfileClosed({ convention, hunter, targets = [] }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [capturedIds, setCapturedIds] = useState(() => new Set());
  const [score, setScore] = useState(hunter?.score ?? 0);

  const hunterPhotoUrl =
    convention?.id && hunter?.app_uid
      ? `/c/${convention.id}/player/${hunter.app_uid}/photo`
      : null;

  return (
    <div className="bg-grain relative mx-auto min-h-screen max-w-[560px] bg-ink bg-repeat font-body text-parchment">

      <main className="pb-10 pt-4.5">
        <p className="mb-3.5 px-4 font-mono text-[11px] uppercase tracking-wide text-parchment/50">
          {convention?.name ? `${convention.name} · ` : ""}
        </p>
      </main>
      Welcome back {hunter?.name}. This convention has ended! You ended with a score of {hunter?.score}. 
      Thanks for hunting, we hope you had fun, and keep an eye on our socials for the next edition!
    </div>
  );
}

