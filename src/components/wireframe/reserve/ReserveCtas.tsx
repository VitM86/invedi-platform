"use client";

/**
 * ReserveCtas — curated-unit CTA block for the unit detail page hero.
 *
 * Mirrors UnitHeroCtas (same hero-block placement, share + shortlist row underneath) but
 * the primary action is "Reserve" and the secondary is a "Speak to advisor" link instead of
 * "Get sales pack". Non-curated units keep using UnitHeroCtas — the unit page chooses which
 * to render based on `project.isCurated`.
 */

import type { Project, Unit } from "@/lib/mock-data";
import { useSalesSheet } from "../SalesSheetProvider";
import { ReserveButton } from "./ReserveButton";

export function ReserveCtas({ project, unit }: { project: Project; unit: Unit }) {
  const { open: openSales } = useSalesSheet();
  return (
    <div>
      <div className="mb-3 space-y-2">
        <ReserveButton project={project} unit={unit} size="md" />
        <button
          onClick={() => openSales("advisor")}
          className="flex h-12 w-full items-center justify-center gap-2 rounded text-base font-semibold text-accent hover:underline"
        >
          {/* TODO(copy): secondary action label */}
          or speak to an advisor
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
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
