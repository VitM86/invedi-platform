"use client";

/**
 * ProjectActions — the CTA card that replaces Reserve. Primary "Speak to advisor", secondary
 * "Get sales pack" and "Request access". All three open the shared SalesSheet on the matching
 * tab. There is no Reserve button anywhere.
 */

// TODO(open-question): What exactly replaces Reserve as the primary action — a single action
// or three options? Current decision: three options (one primary + two secondary), all routing
// into one SalesSheet.

import { useState } from "react";
import { SalesSheet, type SalesIntent } from "../SalesSheet";

export function ProjectActions({ context }: { context: string }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<SalesIntent>("advisor");

  const trigger = (i: SalesIntent) => {
    setIntent(i);
    setOpen(true);
  };

  return (
    <>
      <div className="rounded border border-border bg-surface p-5">
        <p className="text-sm font-semibold text-text">Interested in this project?</p>
        <p className="mt-0.5 text-sm text-text-muted">Talk to an Invedi advisor or get the details.</p>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => trigger("advisor")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded bg-primary text-base font-semibold text-white transition hover:bg-primary-hover"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            Speak to advisor
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => trigger("pack")}
              className="h-11 rounded bg-accent/10 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              Get sales pack
            </button>
            <button
              onClick={() => trigger("access")}
              className="h-11 rounded bg-accent/10 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              Request access
            </button>
          </div>
        </div>
      </div>

      {open && (
        <SalesSheet
          intent={intent}
          onIntentChange={setIntent}
          onClose={() => setOpen(false)}
          context={context}
        />
      )}
    </>
  );
}
