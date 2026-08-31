"use client";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HunterProfileClosed({ convention, hunter, targets = [] }) {

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

