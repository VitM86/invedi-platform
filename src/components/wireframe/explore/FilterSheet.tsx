"use client";

/**
 * FilterSheet — mobile/narrow-viewport filter UI. A full-height bottom sheet with the same
 * control components as desktop, stacked vertically and touch-friendly, plus a sticky footer:
 * "Clear all" (left) and "Show N projects" (right, primary) where N updates live.
 */

import { useEffect } from "react";
import { DEFAULT_FILTERS, type Filters } from "./types";
import {
  AmenitiesSection,
  AreaSection,
  BedsSection,
  CompletionSection,
  CountryRegionSection,
  PriceSection,
  ShortTermSection,
} from "./FilterSections";

export function FilterSheet({
  open,
  filters,
  onChange,
  resultCount,
  onClose,
}: {
  open: boolean;
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
  onClose: () => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end overflow-x-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="animate-slide-up relative box-border flex max-h-[92vh] w-full max-w-full flex-col overflow-x-hidden rounded-t-2xl bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-text">Filters</h2>
          <button onClick={onClose} aria-label="Close filters" className="rounded p-1.5 hover:bg-surface">
            <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body — vertical only; never horizontal */}
        <div className="flex-1 divide-y divide-border overflow-x-hidden overflow-y-auto px-4">
          <div className="py-5"><CountryRegionSection filters={filters} set={set} /></div>
          <div className="py-5"><PriceSection filters={filters} set={set} /></div>
          <div className="py-5"><BedsSection filters={filters} set={set} /></div>
          <div className="py-5"><AreaSection filters={filters} set={set} /></div>
          <div className="py-5"><CompletionSection filters={filters} set={set} /></div>
          <div className="py-5"><AmenitiesSection filters={filters} set={set} /></div>
          <div className="py-5"><ShortTermSection filters={filters} set={set} /></div>
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-sm font-semibold text-text underline-offset-2 hover:underline"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="rounded bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Show {resultCount} project{resultCount === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}
