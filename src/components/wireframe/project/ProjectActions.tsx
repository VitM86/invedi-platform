"use client";

/**
 * ProjectActions — compact CTA card in the right rail. Primary "Speak to advisor",
 * with "Get sales pack" and "Request access" as small secondary options. All three open
 * the shared SalesSheet on the matching tab. There is no Reserve button anywhere.
 *
 * Signup gate: advisor / agent contact is gated content per the founder's strategy
 * session. Until the session is unlocked (UnlockProvider — same gate as GatedUnits),
 * the card surfaces as a "Sign up to talk to an advisor" prompt that flips the same
 * unlock flag. Once unlocked the actual action card renders.
 *
 * // DEMO: mocked signup gate, no real auth. Reuses the existing UnlockProvider
 * mechanic; "Sign up to unlock" is the same flag-flip as on the units table.
 */

import { useState } from "react";
import { SalesSheet, type SalesIntent } from "../SalesSheet";
import { useUnlock } from "../UnlockProvider";

export function ProjectActions({ context }: { context: string }) {
  const { unlocked, unlock } = useUnlock();
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<SalesIntent>("advisor");

  const trigger = (i: SalesIntent) => {
    setIntent(i);
    setOpen(true);
  };

  if (!unlocked) {
    return (
      <div className="rounded border border-border bg-surface p-5">
        <p className="text-sm font-semibold text-text">Interested in this project?</p>
        {/* TODO(copy): founder to refine signup ask. */}
        <p className="mt-1 text-sm text-text-muted">
          Sign up to talk to an Invedi advisor and access the sales pack.
        </p>
        <button
          onClick={() => unlock()}
          className="mt-4 flex h-11 w-full items-center justify-center rounded bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Sign up to unlock
        </button>
        <p className="mt-2 text-xs text-text-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => unlock()}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-text">Interested in this project?</p>
        <p className="mt-0.5 text-xs text-text-muted">Talk to an Invedi advisor or get the details.</p>

        <button
          onClick={() => trigger("advisor")}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          Speak to advisor
        </button>

        <div className="mt-2.5 flex items-center justify-center gap-2.5 text-sm font-semibold text-accent">
          <button onClick={() => trigger("pack")} className="underline-offset-2 hover:underline">
            Get sales pack
          </button>
          <span className="text-border">·</span>
          <button onClick={() => trigger("access")} className="underline-offset-2 hover:underline">
            Request access
          </button>
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
