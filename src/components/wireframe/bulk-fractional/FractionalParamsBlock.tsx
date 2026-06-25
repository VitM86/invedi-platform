"use client";

/**
 * FractionalParamsBlock — controlled params block beneath the category + country grids.
 *
 * Composition (top to bottom):
 *   - Max volume — single euro input setting volumeMax. A prominent "what's the most I
 *     want to commit" surface; same field the range slider below also controls.
 *   - Flexibility — three paired toggles (left/right/off). Visual treatment exactly
 *     mirrors BulkRequirementsBlock's Choice button (border + tint + check pill in the
 *     corner) so the two sub-sections feel like siblings.
 *   - Type — two-option selector reusing the same Choice button as flexibility.
 *   - Min/Max volume — paired euro inputs (same RangeInputs vocab as BulkFilterBar).
 *   - Min/Max price per unit — paired euro inputs.
 *   - Trailing "Clear filters" affordance when any param is dirty.
 *
 * The visual paired-choice atom (`Choice`) is duplicated locally rather than imported
 * from BulkRequirementsBlock — keeps the Bulk sub-section untouched (per the part-5
 * brief) and gives part 6 freedom to evolve either side without breaking the other.
 */

import { formatPriceFull } from "@/lib/mock-data";
import {
  DEFAULT_FRACTIONAL_FILTERS,
  FRACTIONAL_SHARE_CEIL,
  FRACTIONAL_SHARE_FLOOR,
  FRACTIONAL_VOLUME_CEIL,
  FRACTIONAL_VOLUME_FLOOR,
  activeFractionalFilterCount,
  type FractionalFilters,
} from "./fractionalFilters";

/* ------------------------------------------------------------------ */
/* Atoms                                                              */
/* ------------------------------------------------------------------ */

/** Paired-choice button — visually identical to BulkRequirementsBlock.Choice. */
function Choice({
  label, selected, onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-12 w-full items-center justify-between gap-3 rounded-lg border px-4 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-text"
          : "border-border bg-white text-text-muted hover:border-text hover:text-text"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-primary bg-primary" : "border-border bg-white"
        }`}
        aria-hidden
      >
        {selected && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        )}
      </span>
    </button>
  );
}

/** Min/max euro input pair — same vocab as BulkFilterBar's RangeInputs popover content. */
function RangeRow({
  min, max, floor, ceil, captionMin, captionMax, onChange,
}: {
  min: number;
  max: number;
  floor: number;
  ceil: number;
  captionMin: string;
  captionMax: string;
  onChange: (min: number, max: number) => void;
}) {
  const clamp = (raw: string, fallback: number) => {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return fallback;
    return Math.max(floor, Math.min(ceil, Number(digits)));
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border px-3 py-2">
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
      <div className="rounded-lg border border-border px-3 py-2">
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

/** Field-group container with a small label. */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-text">{label}</p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pair definitions                                                    */
/* ------------------------------------------------------------------ */

/** TODO(copy): founder to refine pair labels. */
const FLEX_PAIRS: {
  key: "leasing" | "tenure" | "operator";
  left:  { label: string; value: "non-permitted" | "leasehold" | "external" };
  right: { label: string; value: "permitted"     | "freehold"  | "own" };
}[] = [
  {
    key: "leasing",
    left:  { label: "Non permitted",                       value: "non-permitted" },
    right: { label: "Permitted (must)",                    value: "permitted" },
  },
  {
    key: "tenure",
    left:  { label: "Leasehold / Lease",                   value: "leasehold" },
    right: { label: "Freehold (must)",                     value: "freehold" },
  },
  {
    key: "operator",
    left:  { label: "External operator / Local JV partner", value: "external" },
    right: { label: "Own operations (must)",               value: "own" },
  },
];

const AUDIENCE_PAIR = {
  left:  { label: "Group of buyers / investors", value: "investor" as const },
  right: { label: "Broker / Agent",              value: "broker"   as const },
};

/* ------------------------------------------------------------------ */
/* Block                                                              */
/* ------------------------------------------------------------------ */

export function FractionalParamsBlock({
  filters,
  onChange,
}: {
  filters: FractionalFilters;
  onChange: (f: FractionalFilters) => void;
}) {
  const set = (patch: Partial<FractionalFilters>) => onChange({ ...filters, ...patch });
  const activeCount = activeFractionalFilterCount(filters);

  const clampMax = (raw: string, fallback: number) => {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return fallback;
    return Math.max(FRACTIONAL_VOLUME_FLOOR, Math.min(FRACTIONAL_VOLUME_CEIL, Number(digits)));
  };

  return (
    <section className="rounded-2xl border border-border bg-background p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">Parameters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FRACTIONAL_FILTERS)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6 space-y-8">
        {/* Max volume — prominent quick input. Writes the same volumeMax as the range
            below; intentional — this is just a more prominent surface for "what's the
            most I want to commit". */}
        <Group label="Max volume">
          <div className="rounded-lg border border-border px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">Maximum</p>
            <input
              type="text"
              inputMode="numeric"
              value={formatPriceFull(filters.volumeMax)}
              onChange={(e) => set({ volumeMax: clampMax(e.target.value, FRACTIONAL_VOLUME_CEIL) })}
              className="w-full bg-transparent text-lg font-semibold text-text outline-none"
            />
          </div>
        </Group>

        {/* Flexibility — three paired binary toggles. Selecting one side filters; selecting
            the already-selected side clears it back to "any". */}
        <Group label="Flexibility">
          <ul className="space-y-3">
            {FLEX_PAIRS.map((p) => {
              const current = filters[p.key];
              return (
                <li key={p.key} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr]">
                  <Choice
                    label={p.left.label}
                    selected={current === p.left.value}
                    onClick={() => set({ [p.key]: current === p.left.value ? "any" : p.left.value } as Partial<FractionalFilters>)}
                  />
                  <Choice
                    label={p.right.label}
                    selected={current === p.right.value}
                    onClick={() => set({ [p.key]: current === p.right.value ? "any" : p.right.value } as Partial<FractionalFilters>)}
                  />
                </li>
              );
            })}
          </ul>
        </Group>

        {/* Type — two-option selector for the audience the opportunity is presented to. */}
        <Group label="Type">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr]">
            <Choice
              label={AUDIENCE_PAIR.left.label}
              selected={filters.audience === AUDIENCE_PAIR.left.value}
              onClick={() => set({ audience: filters.audience === AUDIENCE_PAIR.left.value ? "any" : AUDIENCE_PAIR.left.value })}
            />
            <Choice
              label={AUDIENCE_PAIR.right.label}
              selected={filters.audience === AUDIENCE_PAIR.right.value}
              onClick={() => set({ audience: filters.audience === AUDIENCE_PAIR.right.value ? "any" : AUDIENCE_PAIR.right.value })}
            />
          </div>
        </Group>

        {/* Volume range — paired min/max. */}
        <Group label="Min / max total volume">
          <RangeRow
            min={filters.volumeMin}
            max={filters.volumeMax}
            floor={FRACTIONAL_VOLUME_FLOOR}
            ceil={FRACTIONAL_VOLUME_CEIL}
            captionMin="Minimum"
            captionMax="Maximum"
            onChange={(volumeMin, volumeMax) => set({ volumeMin, volumeMax })}
          />
        </Group>

        {/* Per-share / per-unit price range. */}
        <Group label="Min / max price per unit (share)">
          <RangeRow
            min={filters.perShareMin}
            max={filters.perShareMax}
            floor={FRACTIONAL_SHARE_FLOOR}
            ceil={FRACTIONAL_SHARE_CEIL}
            captionMin="Minimum"
            captionMax="Maximum"
            onChange={(perShareMin, perShareMax) => set({ perShareMin, perShareMax })}
          />
        </Group>
      </div>
    </section>
  );
}
