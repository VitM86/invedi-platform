"use client";

/**
 * PhiButton — entry point to Phi, the AI advisor. Floating action button, bottom-right.
 * Opens a small placeholder chat panel (no real assistant wired at wireframe stage).
 */

// TODO(open-question): Phi entry point placement on Project and Unit pages is not finalised.
// Current decision: floating button, bottom-right. Alternatives considered: inline in the CTA
// card, or a docked sidebar. Revisit once Phi's scope (search vs. advisor vs. concierge) is set.

import { useState } from "react";

export function PhiButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 overflow-hidden rounded-lg border border-border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <span className="text-sm font-bold text-black">Phi · AI advisor</span>
            <button onClick={() => setOpen(false)} aria-label="Close Phi" className="text-black/70 hover:text-black">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3 p-4">
            <p className="rounded-lg bg-surface px-3 py-2 text-sm text-text">
              Hi, I&apos;m Phi. Ask me about this project, its units, or the buying process.
              (Placeholder — no AI wired at wireframe stage.)
            </p>
            <input
              disabled
              placeholder="Ask Phi…"
              className="w-full cursor-not-allowed rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-muted"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Phi, the AI advisor"
        className="flex h-14 items-center gap-2 rounded-full bg-primary pl-4 pr-5 font-semibold text-white shadow-lg transition hover:bg-primary-hover"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
        Phi
      </button>
    </div>
  );
}
