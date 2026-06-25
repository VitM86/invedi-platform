"use client";

/**
 * BulkFilterBar — controlled filter bar for the Bulk landing.
 *
 * Visual vocabulary mirrors Explore's FilterBar: h-10 white pills with chevron-down for the
 * popover triggers, search input with magnifier, active filters highlighted via the same
 * `border-primary bg-primary/10` shape. The local Popover helper repeats Explore's pattern
 * (useClickAway from filterControls + position-absolute panel) — kept local rather than
 * promoted to a shared util so part 4 (Fractional) can copy/tune freely without a refactor.
 *
 * Layout: row 1 = search (flex-1) + sort on the right · row 2 = horizontal pill row
 * (Markets, Any location, Any delivery, Any status, Volume €, Price per unit €) with a
 * trailing "Clear" affordance when any filter is active.
 */

import { useState } from "react";
import { formatPriceFull } from "@/lib/mock-data";
import { useClickAway } from "../explore/filterControls";
import { BULK_MARKETS } from "./bulkMockData";
import {
  DEFAULT_BULK_FILTERS,
  DELIVERY_OPTIONS,
  PER_UNIT_CEIL,
  PER_UNIT_FLOOR,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  VOLUME_CEIL,
  VOLUME_FLOOR,
  activeBulkFilterCount,
  allBulkLocations,
  type BulkFilters,
} from "./bulkFilters";

/* ------------------------------------------------------------------ */
/* Local atoms                                                         */
/* ------------------------------------------------------------------ */

function ChevDown() {
  return (
    <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function Popover({
  label,
  active,
  width = "w-72",
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
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 items-center gap-1.5 rounded border px-3 text-sm font-medium outline-none transition-colors ${
          active ? "border-primary bg-primary/10 text-text" : "border-border bg-white text-text hover:bg-surface"
        }`}
      >
        {label}
        <ChevDown />
      </button>
      {open && (
        <div className={`absolute left-0 top-11 z-40 ${width} rounded-lg border border-border bg-white p-4 shadow-xl`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-semibold text-text">{children}</p>;
}

/** Compact min/max number-input pair styled like Explore's PricePills. Range bounds are
 *  passed in so the same primitive serves both Volume and Price-per-unit filters. */
function RangeInputs({
  min, max, floor, ceil, onChange, captionMin, captionMax,
}: {
  min: number;
  max: number;
  floor: number;
  ceil: number;
  onChange: (min: number, max: number) => void;
  captionMin: string;
  captionMax: string;
}) {
  const clamp = (raw: string, fallback: number) => {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return fallback;
    return Math.max(floor, Math.min(ceil, Number(digits)));
  };
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2">
        <p className="text-[11px] uppercase tracking-wide text-text-muted">{captionMin}</p>
        <input
          type="text"
          inputMode="numeric"
          value={formatPriceFull(min)}
          onChange={(e) => {
            const next = clamp(e.target.value, floor);
            onChange(Math.min(next, max), max);
          }}
          className="w-full bg-transparent text-sm font-semibold text-text outline-none"
        />
      </div>
      <span className="h-px w-4 flex-none bg-border" />
      <div className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2">
        <p className="text-[11px] uppercase tracking-wide text-text-muted">{captionMax}</p>
        <input
          type="text"
          inputMode="numeric"
          value={formatPriceFull(max)}
          onChange={(e) => {
            const next = clamp(e.target.value, ceil);
            onChange(min, Math.max(next, min));
          }}
          className="w-full bg-transparent text-sm font-semibold text-text outline-none"
        />
      </div>
    </div>
  );
}

function CheckboxRow({
  label, checked, onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded px-1.5 py-1 text-sm text-text hover:bg-surface">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 cursor-pointer accent-primary"
      />
      {label}
    </label>
  );
}

function RadioRow({
  label, checked, onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded px-1.5 py-1 text-sm text-text hover:bg-surface">
      <input
        type="radio"
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 cursor-pointer accent-primary"
      />
      {label}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* BulkFilterBar                                                       */
/* ------------------------------------------------------------------ */

export function BulkFilterBar({
  filters,
  onChange,
}: {
  filters: BulkFilters;
  onChange: (f: BulkFilters) => void;
}) {
  const set = (patch: Partial<BulkFilters>) => onChange({ ...filters, ...patch });
  const locations = allBulkLocations();
  const activeCount = activeBulkFilterCount(filters);

  const marketsLabel =
    filters.marketIds.length === 0 ? "Markets"
    : filters.marketIds.length === 1 ? (BULK_MARKETS.find((m) => m.id === filters.marketIds[0])?.city ?? "Markets")
    : `Markets · ${filters.marketIds.length}`;

  const locationLabel =
    filters.locations.length === 0 ? "Any location"
    : filters.locations.length === 1 ? filters.locations[0]
    : `Locations · ${filters.locations.length}`;

  const deliveryLabel = DELIVERY_OPTIONS.find((o) => o.value === filters.delivery)?.label ?? "Any delivery";
  const statusLabel   = STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? "Any status";
  const sortLabel     = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? "Recommended";

  const volumeActive  = filters.volumeMin > VOLUME_FLOOR || filters.volumeMax < VOLUME_CEIL;
  const perUnitActive = filters.pricePerUnitMin > PER_UNIT_FLOOR || filters.pricePerUnitMax < PER_UNIT_CEIL;
  const volumeLabel   = volumeActive  ? `${formatPriceFull(filters.volumeMin)} – ${formatPriceFull(filters.volumeMax)}` : "Volume";
  const perUnitLabel  = perUnitActive ? `${formatPriceFull(filters.pricePerUnitMin)} – ${formatPriceFull(filters.pricePerUnitMax)}` : "Price per unit";

  return (
    <div className="space-y-3">
      {/* Row 1: search (flex) + Sort on right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search cities, locations, projects…"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="h-10 w-full rounded border border-border bg-white pl-9 pr-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-text"
          />
        </div>
        <Popover label={<><span className="text-text-muted">Sort:</span> {sortLabel}</>} active={filters.sort !== "recommended"} width="w-56">
          {(close) => (
            <div className="space-y-0.5">
              {SORT_OPTIONS.map((opt) => (
                <RadioRow
                  key={opt.value}
                  label={opt.label}
                  checked={filters.sort === opt.value}
                  onSelect={() => { set({ sort: opt.value }); close(); }}
                />
              ))}
            </div>
          )}
        </Popover>
      </div>

      {/* Row 2: pill row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Markets — multi-select cities */}
        <Popover label={marketsLabel} active={filters.marketIds.length > 0}>
          {() => (
            <div className="space-y-0.5">
              <FieldLabel>Markets</FieldLabel>
              {BULK_MARKETS.map((m) => {
                const checked = filters.marketIds.includes(m.id);
                return (
                  <CheckboxRow
                    key={m.id}
                    label={m.city}
                    checked={checked}
                    onToggle={() =>
                      set({
                        marketIds: checked
                          ? filters.marketIds.filter((id) => id !== m.id)
                          : [...filters.marketIds, m.id],
                      })
                    }
                  />
                );
              })}
              {filters.marketIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => set({ marketIds: [] })}
                  className="mt-2 text-xs font-medium text-text-muted underline hover:text-text"
                >
                  Clear markets
                </button>
              )}
            </div>
          )}
        </Popover>

        {/* Any location — multi-select neighbourhoods */}
        <Popover label={locationLabel} active={filters.locations.length > 0}>
          {() => (
            <div className="space-y-0.5">
              <FieldLabel>Location</FieldLabel>
              {locations.map((loc) => {
                const checked = filters.locations.includes(loc);
                return (
                  <CheckboxRow
                    key={loc}
                    label={loc}
                    checked={checked}
                    onToggle={() =>
                      set({
                        locations: checked
                          ? filters.locations.filter((l) => l !== loc)
                          : [...filters.locations, loc],
                      })
                    }
                  />
                );
              })}
              {filters.locations.length > 0 && (
                <button
                  type="button"
                  onClick={() => set({ locations: [] })}
                  className="mt-2 text-xs font-medium text-text-muted underline hover:text-text"
                >
                  Clear locations
                </button>
              )}
            </div>
          )}
        </Popover>

        {/* Any delivery — single-select bucket */}
        <Popover label={deliveryLabel} active={filters.delivery !== "any"} width="w-56">
          {(close) => (
            <div className="space-y-0.5">
              {DELIVERY_OPTIONS.map((opt) => (
                <RadioRow
                  key={opt.value}
                  label={opt.label}
                  checked={filters.delivery === opt.value}
                  onSelect={() => { set({ delivery: opt.value }); close(); }}
                />
              ))}
            </div>
          )}
        </Popover>

        {/* Any status — single-select */}
        <Popover label={statusLabel} active={filters.status !== "any"} width="w-56">
          {(close) => (
            <div className="space-y-0.5">
              {STATUS_OPTIONS.map((opt) => (
                <RadioRow
                  key={opt.value}
                  label={opt.label}
                  checked={filters.status === opt.value}
                  onSelect={() => { set({ status: opt.value }); close(); }}
                />
              ))}
            </div>
          )}
        </Popover>

        {/* Volume range */}
        <Popover label={volumeLabel} active={volumeActive} width="w-80">
          {() => (
            <div>
              <FieldLabel>Total deal volume</FieldLabel>
              <RangeInputs
                min={filters.volumeMin}
                max={filters.volumeMax}
                floor={VOLUME_FLOOR}
                ceil={VOLUME_CEIL}
                captionMin="Minimum"
                captionMax="Maximum"
                onChange={(volumeMin, volumeMax) => set({ volumeMin, volumeMax })}
              />
              {volumeActive && (
                <button
                  type="button"
                  onClick={() => set({ volumeMin: VOLUME_FLOOR, volumeMax: VOLUME_CEIL })}
                  className="mt-3 text-xs font-medium text-text-muted underline hover:text-text"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </Popover>

        {/* Price-per-unit range */}
        <Popover label={perUnitLabel} active={perUnitActive} width="w-80">
          {() => (
            <div>
              <FieldLabel>Price per unit</FieldLabel>
              <RangeInputs
                min={filters.pricePerUnitMin}
                max={filters.pricePerUnitMax}
                floor={PER_UNIT_FLOOR}
                ceil={PER_UNIT_CEIL}
                captionMin="Minimum"
                captionMax="Maximum"
                onChange={(pricePerUnitMin, pricePerUnitMax) => set({ pricePerUnitMin, pricePerUnitMax })}
              />
              {perUnitActive && (
                <button
                  type="button"
                  onClick={() => set({ pricePerUnitMin: PER_UNIT_FLOOR, pricePerUnitMax: PER_UNIT_CEIL })}
                  className="mt-3 text-xs font-medium text-text-muted underline hover:text-text"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </Popover>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_BULK_FILTERS)}
            className="ml-auto inline-flex h-10 items-center gap-1.5 rounded px-3 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
