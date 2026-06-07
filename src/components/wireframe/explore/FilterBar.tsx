"use client";

/**
 * FilterBar — desktop inline filter bar for /explore (md+).
 *
 * Always-visible: Country, Region (multi-select dropdowns), Price (histogram-slider popover),
 * Beds (stepper popover). Less-common controls (Area, Completion, Amenities, Short-term) live
 * in a "More filters" popover so the bar stays 1–2 rows tall. State owned by ExploreView.
 *
 * On mobile this whole bar is hidden — see FilterButton + FilterSheet.
 */

import { useState } from "react";
import { formatPrice } from "@/lib/mock-data";
import { DEFAULT_FILTERS, PRICE_CEIL, PRICE_FLOOR, bedLabel, type Filters } from "./types";
import { useClickAway } from "./filterControls";
import {
  AmenitiesSection,
  AreaSection,
  BedsSection,
  CompletionSection,
  CountryRegionSection,
  PriceSection,
  ShortTermSection,
} from "./FilterSections";

function Popover({
  label,
  active,
  width = "w-64",
  children,
}: {
  label: React.ReactNode;
  active?: boolean;
  width?: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 items-center gap-1.5 rounded border px-3 text-sm font-medium outline-none ${
          active ? "border-primary bg-primary/10 text-text" : "border-border bg-white text-text"
        }`}
      >
        {label}
        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className={`absolute left-0 top-11 z-40 ${width} rounded-lg border border-border bg-white p-4 shadow-xl`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const isDirty = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  const priceActive = filters.priceMin > PRICE_FLOOR || filters.priceMax < PRICE_CEIL;
  const priceLabel = priceActive
    ? `${filters.priceMin <= PRICE_FLOOR ? "Any" : formatPrice(filters.priceMin)} – ${
        filters.priceMax >= PRICE_CEIL ? "Any" : formatPrice(filters.priceMax)
      }`
    : "Price";

  const moreCount =
    (filters.areaMin > 0 ? 1 : 0) +
    (filters.completion !== "any" ? 1 : 0) +
    (filters.amenities.length ? 1 : 0) +
    (filters.shortTermOnly ? 1 : 0);

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Country + Region (always visible) */}
        <CountryRegionSection filters={filters} set={set} inline />

        {/* Price (always visible) */}
        <Popover label={priceLabel} active={priceActive} width="w-[360px]">
          {() => <PriceSection filters={filters} set={set} />}
        </Popover>

        {/* Beds (always visible) */}
        <Popover label={filters.bedrooms > 0 ? `${bedLabel(filters.bedrooms)} beds` : "Beds"} active={filters.bedrooms > 0} width="w-64">
          {() => <BedsSection filters={filters} set={set} />}
        </Popover>

        {/* More filters */}
        <Popover
          label={
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6 12h12m-9 5.25h6" />
              </svg>
              More filters
              {moreCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-white">{moreCount}</span>
              )}
            </span>
          }
          active={moreCount > 0}
          width="w-[380px]"
        >
          {() => (
            <div className="space-y-5">
              <AreaSection filters={filters} set={set} />
              <CompletionSection filters={filters} set={set} />
              <AmenitiesSection filters={filters} set={set} />
              <ShortTermSection filters={filters} set={set} />
            </div>
          )}
        </Popover>

        {/* Reset */}
        {isDirty && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="ml-auto flex h-10 items-center gap-1.5 rounded bg-surface px-3 text-sm font-semibold text-text hover:bg-border/60"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356M3.86 5.99A8.25 8.25 0 0 1 19.5 9.348M3.985 14.652A8.25 8.25 0 0 0 19.64 18.01M8.977 14.652H3.985v4.992" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
