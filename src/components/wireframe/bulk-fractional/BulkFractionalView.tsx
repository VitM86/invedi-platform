"use client";

/**
 * BulkFractionalView — client orchestrator for /bulk-fractional.
 *
 * Shape mirrors ExploreView: the server (page.tsx) parses `?view=` from searchParams and
 * passes the resolved sub-section in as `initialView`; this component owns the runtime
 * state, the toggle, and the URL sync. Only the shell is wired up at this stage — the two
 * sub-section components (BulkSection / FractionalSection) are placeholders that part 2 and
 * part 4 will fill in.
 *
 * URL sync via `window.history.replaceState`: cheap (no Next route navigation, no server
 * roundtrip — the swap is pure local state) and gives us shallow URL writeback so the active
 * tab is deep-linkable and survives refresh. We use replaceState (not pushState) so flipping
 * tabs doesn't pollute the back-button stack.
 *
 * Header is the shared AppHeader (links left / dark logo center / Sign in right) — matches
 * Explore + project pages. Footer is the shared SiteFooter without socials (those are /v3-only
 * by founder direction so far).
 */

import { useCallback, useState } from "react";
import { AppHeader } from "../AppHeader";
import { SiteFooter } from "../SiteFooter";
import { BulkFractionalToggle } from "./BulkFractionalToggle";
import { BulkSection } from "./BulkSection";
import { FractionalSection } from "./FractionalSection";
import type { BfView } from "./types";

export function BulkFractionalView({ initialView }: { initialView: BfView }) {
  const [view, setView] = useState<BfView>(initialView);

  const onChange = useCallback((next: BfView) => {
    setView(next);
    if (typeof window !== "undefined") {
      const url = `/bulk-fractional?view=${next}`;
      // Preserve any history state (Next stores routing info there) but rewrite the URL.
      window.history.replaceState(window.history.state, "", url);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-16">
        {/* Section intro — placeholder copy. TODO(copy): founder to refine. */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
            For groups
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-text sm:text-4xl">
            Bulk &amp; fractional
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            Two ways for groups to enter the same curated inventory — multi-unit reservations
            with bulk discounts, or fractional ownership of single units.
          </p>
        </div>

        <div className="mt-8">
          <BulkFractionalToggle view={view} onChange={onChange} />
        </div>

        <div className="mt-10">
          {view === "bulk" ? <BulkSection /> : <FractionalSection />}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
