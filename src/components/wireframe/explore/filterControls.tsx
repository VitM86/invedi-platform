"use client";

/**
 * filterControls.tsx — Airbnb-quality filter primitives, shared by the desktop inline
 * FilterBar and the mobile FilterSheet. Every control is pure value/onChange so both layouts
 * render the exact same components.
 *
 *  - PriceHistogramSlider : custom dual-handle range slider with a price-distribution histogram
 *  - Stepper              : −/+ counter ("Any", "1+", …)
 *  - SegmentedGroup       : connected button row, single-select (≤4-ish options)
 *  - AmenityPills         : icon outline pills, multi-select
 *  - MultiSelectDropdown  : chips + checkbox menu (Country / Region)
 *  - ShortTermToggle      : the existing switch
 *
 * No external slider/icon libraries — custom pointer slider + inline SVGs (matches the
 * codebase) so dragging is fully controlled and smooth.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { priceHistogram, formatPrice } from "@/lib/mock-data";
import { PRICE_FLOOR, PRICE_CEIL } from "./types";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

export function useClickAway<T extends HTMLElement>(onAway: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onAway();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onAway]);
  return ref;
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-semibold text-text">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Price histogram + dual-handle slider                                */
/* ------------------------------------------------------------------ */

const PRICE_SNAP = 10_000;
const PRICE_GAP = 100_000;

function priceLabel(v: number, kind: "min" | "max") {
  if (kind === "min" && v <= PRICE_FLOOR) return "No minimum";
  if (kind === "max" && v >= PRICE_CEIL) return "No maximum";
  return formatPrice(v);
}

export function PriceHistogramSlider({
  valueMin,
  valueMax,
  onChange,
}: {
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<null | "min" | "max">(null);
  const { bars } = useMemo(() => priceHistogram(PRICE_FLOOR, PRICE_CEIL, 30), []);

  const pct = (v: number) => ((v - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  useEffect(() => {
    function move(e: PointerEvent) {
      if (!dragging.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const raw = PRICE_FLOOR + frac * (PRICE_CEIL - PRICE_FLOOR);
      const val = Math.round(raw / PRICE_SNAP) * PRICE_SNAP;
      if (dragging.current === "min") onChange(Math.min(val, valueMax - PRICE_GAP), valueMax);
      else onChange(valueMin, Math.max(val, valueMin + PRICE_GAP));
    }
    function up() {
      dragging.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [valueMin, valueMax, onChange]);

  const inRange = (from: number, to: number) => to > valueMin && from < valueMax;

  return (
    <div>
      {/* Histogram + track share a 12px inset so the slider handles (±12px) never overflow. */}
      <div className="px-3">
        {/* Histogram */}
        <div className="flex h-20 items-end gap-[2px]">
          {bars.map((b, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-colors ${
                inRange(b.from, b.to) ? "bg-primary/70" : "bg-border"
              }`}
              style={{ height: `${Math.max(4, b.height * 100)}%` }}
              title={b.realCount ? `${b.realCount} project(s)` : undefined}
            />
          ))}
        </div>

        {/* Track + handles */}
        <div className="relative mt-1 h-6 select-none">
          <div ref={trackRef} className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border">
            <div
              className="absolute top-0 h-1 rounded-full bg-primary"
              style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }}
            />
          </div>
          <Handle pos={pct(valueMin)} onDown={() => (dragging.current = "min")} label="Minimum price" />
          <Handle pos={pct(valueMax)} onDown={() => (dragging.current = "max")} label="Maximum price" />
        </div>
      </div>

      {/* Min / max pills */}
      <div className="mt-3 flex items-center gap-3">
        <PricePill caption="Minimum" value={priceLabel(valueMin, "min")} />
        <span className="h-px w-4 flex-none bg-border" />
        <PricePill caption="Maximum" value={priceLabel(valueMax, "max")} />
      </div>
    </div>
  );
}

function Handle({ pos, onDown, label }: { pos: number; onDown: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        onDown();
      }}
      className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border border-border bg-white shadow active:cursor-grabbing"
      style={{ left: `${pos}%` }}
    >
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
    </button>
  );
}

function PricePill({ caption, value }: { caption: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{caption}</p>
      <p className="truncate text-sm font-semibold text-text">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */

export function Stepper({
  value,
  onChange,
  max,
  format,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
  /** Render the current value (e.g. 0 → "Any", 2 → "2+"). */
  format: (v: number) => string;
}) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-text";
  return (
    <div className="flex items-center gap-4">
      <button className={btn} onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} aria-label="Decrease">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" d="M5 12h14" />
        </svg>
      </button>
      <span className="min-w-[3rem] text-center text-sm font-semibold text-text">{format(value)}</span>
      <button className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented group                                                     */
/* ------------------------------------------------------------------ */

export function SegmentedGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-border p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.value ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Amenity pills (icon + label, multi-select)                          */
/* ------------------------------------------------------------------ */

const AMENITY_ICON: Record<string, React.ReactNode> = {
  Pool: <path strokeLinecap="round" strokeLinejoin="round" d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5S16 18 18 18M7 14V6a2 2 0 1 1 4 0M11 10h4" />,
  Gym: <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 6.5v11M17.5 6.5v11M4 9v6M20 9v6M6.5 12h11" />,
  Concierge: <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M5 19a7 7 0 0 1 14 0M12 5v2M12 7a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5Z" />,
  Parking: <path strokeLinecap="round" strokeLinejoin="round" d="M7 19V5h6a4 4 0 0 1 0 8H7" />,
  "Roof terrace": <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V10l8-5 8 5v11M9 21v-6h6v6" />,
  Garden: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-7M12 14c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Z" />,
  Spa: <path strokeLinecap="round" strokeLinejoin="round" d="M12 13c0-4 3-7 3-7s3 3 3 7M12 13c0-4-3-7-3-7s-3 3-3 7M5 14c4 1 7 4 7 7 0-3 3-6 7-7" />,
  "Co-working": <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18v11H3zM8 20h8M12 16v4" />,
  "EV charging": <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16H6ZM6 9h9M17 8l2 2v5a1.5 1.5 0 0 1-3 0M11 11l-2 3h3l-2 3" />,
  Storage: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4v12H3zM3 11h18M9 19v-4h6v4" />,
};

function AmenityIcon({ name }: { name: string }) {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
      {AMENITY_ICON[name] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

export function AmenityPills({
  all,
  selected,
  onToggle,
}: {
  all: readonly string[];
  selected: string[];
  onToggle: (a: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((a) => {
        const on = selected.includes(a);
        return (
          <button
            key={a}
            onClick={() => onToggle(a)}
            aria-pressed={on}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              on ? "border-primary bg-surface-tint text-primary-dark" : "border-border text-text hover:border-text"
            }`}
          >
            <AmenityIcon name={a} />
            {a}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Multi-select dropdown (chips)                                       */
/* ------------------------------------------------------------------ */

export function MultiSelectDropdown<T extends string>({
  label,
  options,
  selected,
  onToggle,
  emptyLabel,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (v: T) => void;
  emptyLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));
  const summary =
    selected.length === 0
      ? emptyLabel
      : selected.length <= 2
        ? options.filter((o) => selected.includes(o.value)).map((o) => o.label).join(", ")
        : `${selected.length} selected`;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 items-center gap-1.5 rounded border px-3 text-sm font-medium outline-none ${
          selected.length ? "border-primary bg-primary/10 text-text" : "border-border bg-white text-text"
        }`}
      >
        <span className="max-w-[12rem] truncate">{summary}</span>
        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-40 max-h-72 w-60 overflow-y-auto rounded border border-border bg-white p-1 shadow-xl">
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
          {options.length === 0 && <p className="px-2 py-2 text-sm text-text-muted">No options</p>}
          {options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-text hover:bg-surface">
                <input type="checkbox" checked={on} onChange={() => onToggle(o.value)} className="h-4 w-4 accent-primary" />
                {o.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Short-term letting toggle                                           */
/* ------------------------------------------------------------------ */

export function ShortTermToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={`flex h-10 items-center gap-2 rounded border px-3 text-sm font-medium transition-colors ${
        on ? "border-primary bg-primary/10 text-text" : "border-border bg-white text-text-muted"
      }`}
    >
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
      Short-term letting
    </button>
  );
}
