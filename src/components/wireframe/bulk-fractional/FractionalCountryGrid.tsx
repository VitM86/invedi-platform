"use client";

/**
 * FractionalCountryGrid — selectable country cards for the Fractional landing.
 *
 * Visual vocabulary borrowed from BulkMarketsGrid (and via that, MarketFocusV2): full-bleed
 * RegionImage with a black gradient scrim and bottom-aligned label. Differences:
 *   - Card is a <button> instead of <div> so the whole tile is the click surface.
 *   - Selected state adds a primary ring + corner check pill so it's clearly toggled.
 *   - Country + location sub-label replace the "X deals" deal-count from Bulk — there's no
 *     listing inventory in Fractional yet (part 5 work).
 *
 * Selection state is owned by FractionalSection — part 5 will turn it into actual
 * filter params on a deal list.
 */

import { RegionImage } from "../explore/RegionImage";
import { FRACTIONAL_COUNTRIES } from "./fractionalMockData";

export function FractionalCountryGrid({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">Country</h2>
        <p className="text-xs text-text-muted">
          {/* TODO: wire country selection to fractional params in part 5. */}
          Captured for filtering — wires in a later pass.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FRACTIONAL_COUNTRIES.map((c) => {
          const isSelected = selected.includes(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onToggle(c.id)}
                aria-pressed={isSelected}
                className={`group relative block h-[260px] w-full overflow-hidden rounded-2xl border text-left transition-colors ${
                  isSelected ? "border-primary ring-2 ring-primary" : "border-[#e6dfd2] hover:border-text"
                }`}
              >
                <RegionImage
                  src={c.image}
                  label={c.country}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                  showLabel={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Top-right: selection checkmark pill (matches the category cards). */}
                <span
                  aria-hidden
                  className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-white/70 bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {isSelected && (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </span>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 lg:p-6">
                  <div>
                    <h3 className="text-[22px] font-semibold leading-tight text-white drop-shadow lg:text-[26px]">
                      {c.country}
                    </h3>
                    <p className="mt-1.5 text-[13px] font-medium text-white/85 drop-shadow">
                      {c.location}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
