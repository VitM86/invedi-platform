"use client";

/**
 * BulkFractionalToggle — two-option segmented control switching the /bulk-fractional
 * sub-section.
 *
 * Visual style mirrors the Explore ViewToggle (Regions / Map / Grid):
 *   - Outer pill: `rounded-lg bg-surface p-1`
 *   - Active option: `bg-primary text-white shadow-sm`
 *   - Inactive option: `text-text-muted hover:text-text`
 *
 * Differences from Explore's toggle: only two options, both fully labelled at every
 * breakpoint (the labels are short enough that hiding text under sm isn't needed), and
 * icons specific to the sub-section (stack of receipts for bulk pricing, pie slice for
 * fractional ownership).
 */

import type { BfView } from "./types";

const OPTIONS: { value: BfView; label: string; icon: React.ReactNode }[] = [
  {
    value: "bulk",
    label: "Bulk discounts",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        {/* Stack of three layers — multi-unit / bulk feel. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 12 8 4 8-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 17 8 4 8-4" />
      </svg>
    ),
  },
  {
    value: "fractional",
    label: "Fractional ownership",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        {/* Circle with a wedge cut out — share / fraction feel. */}
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9l6.36 6.36" />
      </svg>
    ),
  },
];

export function BulkFractionalToggle({
  view,
  onChange,
}: {
  view: BfView;
  onChange: (v: BfView) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Bulk and fractional sub-sections"
      className="inline-flex items-center gap-1 rounded-lg bg-surface p-1"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={view === opt.value}
          onClick={() => onChange(opt.value)}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 ${
            view === opt.value
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
