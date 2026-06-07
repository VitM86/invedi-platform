"use client";

/**
 * Unit-page CTA triggers. Reserve is gone — the primary buyer action is Speak to advisor,
 * secondary is Get sales pack. All open the shared SalesSheet (see SalesSheetProvider).
 *
 *  - UnitHeroCtas: the main CTA block in the hero summary (+ share / save row).
 *  - AdvisorCard:  the lower "want to learn more" card next to the mortgage calculator.
 */

import { useSalesSheet } from "../SalesSheetProvider";

// TODO(open-question): primary action that replaces Reserve — single action or several?
// Current decision on the unit page: Speak to advisor (primary) + Get sales pack (secondary).

export function UnitHeroCtas() {
  const { open } = useSalesSheet();
  return (
    <div>
      <div className="mb-3 space-y-2">
        <button
          onClick={() => open("advisor")}
          className="flex h-12 w-full items-center justify-center gap-2 rounded bg-primary text-lg font-semibold text-white shadow-sm transition hover:bg-primary-hover"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          Speak to advisor
        </button>
        <button
          onClick={() => open("pack")}
          className="h-12 w-full rounded bg-accent/10 text-lg font-semibold text-accent transition hover:bg-accent/20"
        >
          Get sales pack
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          Share
        </button>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon-heart.svg" alt="" className="h-4 w-4" />
          Add to shortlist
        </button>
      </div>
    </div>
  );
}

export function AdvisorCard() {
  const { open } = useSalesSheet();
  return (
    <div className="flex h-full flex-col justify-center rounded border border-border bg-surface p-8">
      <div className="mb-5 text-center">
        <h2 className="mb-1 text-2xl font-medium text-text">Want to learn more?</h2>
        <p className="text-base text-text-muted">Speak to an Invedi advisor about this unit.</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => open("advisor")}
          className="flex h-12 items-center gap-2 rounded bg-primary px-8 text-lg font-semibold text-white transition hover:bg-primary-hover"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          Speak to advisor
        </button>
        <button
          onClick={() => open("pack")}
          className="text-sm font-semibold text-accent hover:underline"
        >
          or get the sales pack →
        </button>
      </div>
    </div>
  );
}
