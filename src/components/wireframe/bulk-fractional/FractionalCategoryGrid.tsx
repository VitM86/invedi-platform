"use client";

/**
 * FractionalCategoryGrid — selectable asset-type categories (Land / Hotel / Residential
 * / Padel club / Sports clubs).
 *
 * Each card has an inline-SVG line icon (kept local to this file rather than promoted to
 * /public/images so the strokes can match the existing inline-SVG vocabulary the rest of
 * the platform uses). Cards are buttons — clicking toggles selection, multi-select.
 *
 * Selection visual: primary teal border + tinted background + check pill in the corner,
 * mirroring the BulkRequirementsBlock "selected" treatment so the two feel like siblings.
 *
 * Selection state is owned by FractionalSection so part 5 can read it for filtering /
 * params later.
 */

import type { FractionalCategoryIcon } from "./fractionalMockData";
import { FRACTIONAL_CATEGORIES } from "./fractionalMockData";

function CategoryIcon({ name, className = "h-7 w-7" }: { name: FractionalCategoryIcon; className?: string }) {
  const sw = 1.6;
  switch (name) {
    case "land":
      // Horizon line with sun + hills — "plot of land" feel.
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={sw} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.5h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m3 17.5 4-5 4 4 3.5-4.5L18 16l3 1.5" />
          <circle cx="17" cy="7" r="2.4" />
        </svg>
      );
    case "hotel":
      // Stylised building with windows.
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={sw} stroke="currentColor" aria-hidden>
          <rect x="3.5" y="4.5" width="17" height="15" rx="1.4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 19.5h17M8 8.5h2.5M13.5 8.5H16M8 12.5h2.5M13.5 12.5H16M9.5 19.5v-3.2h5v3.2" />
        </svg>
      );
    case "residential":
      // House outline with door.
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={sw} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 11.5 12 4l8.5 7.5V20a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-8.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 21v-5h4v5" />
        </svg>
      );
    case "padel":
      // Crossed paddle bats.
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={sw} stroke="currentColor" aria-hidden>
          <ellipse cx="9" cy="9" rx="4" ry="5" transform="rotate(-30 9 9)" />
          <ellipse cx="15" cy="15" rx="4" ry="5" transform="rotate(-30 15 15)" />
          <path strokeLinecap="round" d="m5 14 14-4" />
        </svg>
      );
    case "sports":
      // Dumbbell.
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={sw} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4M6.5 8v8M17.5 8v8M20 10v4M6.5 12h11" />
        </svg>
      );
  }
}

export function FractionalCategoryGrid({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">Asset category</h2>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {FRACTIONAL_CATEGORIES.map((c) => {
          const isSelected = selected.includes(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onToggle(c.id)}
                aria-pressed={isSelected}
                className={`group relative flex h-full w-full flex-col items-start gap-3 rounded-2xl border bg-background p-5 text-left transition-colors sm:p-6 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-text"
                }`}
              >
                {/* Top: icon + selection checkmark in the corner */}
                <div className="flex w-full items-start justify-between">
                  <CategoryIcon
                    name={c.icon}
                    className={`h-7 w-7 transition-colors ${isSelected ? "text-primary" : "text-text"}`}
                  />
                  <span
                    aria-hidden
                    className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? "border-primary bg-primary" : "border-border bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </span>
                </div>

                {/* Bottom: label + sub-label */}
                <div className="mt-1">
                  <p className="text-base font-semibold text-text sm:text-[17px]">{c.label}</p>
                  {c.subLabel && (
                    <p className="mt-1 text-[12px] leading-snug text-text-muted">{c.subLabel}</p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
