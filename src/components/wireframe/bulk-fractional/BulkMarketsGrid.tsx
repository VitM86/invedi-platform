/**
 * BulkMarketsGrid — "Markets we have access to" grid, now filter-aware.
 *
 * Receives the FILTERED listings from BulkSection and derives per-market availability
 * counts from them. Cities with zero matching listings are hidden so the grid mirrors the
 * deals list — picking "Berlin" via the filter shouldn't leave Berlin's card visible
 * surrounded by hidden siblings, that reads as a layout bug.
 *
 * Card body adds a "X deals" counter under the "Avg. discount up to X%" line — the more
 * useful real-data signal once filters narrow down inventory.
 */

import { RegionImage } from "../explore/RegionImage";
import { VerifiedBadge } from "../VerifiedBadge";
import { BULK_MARKETS, type BulkListing } from "./bulkMockData";

export function BulkMarketsGrid({ listings }: { listings: BulkListing[] }) {
  /** Count of matching listings per market id, used to (a) hide markets with 0 matches
   *  and (b) show "X deals" on each visible card. */
  const counts = new Map<string, number>();
  for (const l of listings) counts.set(l.marketId, (counts.get(l.marketId) ?? 0) + 1);

  const visible = BULK_MARKETS.filter((m) => (counts.get(m.id) ?? 0) > 0);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">
          Markets we have access to
        </h2>
      </div>

      {visible.length === 0 ? (
        // Empty state mirrors BulkDealsList's empty state visually so the two empty regions
        // read as one consistent "no results" rhythm.
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-text-muted">
            No markets match your filters.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => {
            const count = counts.get(m.id) ?? 0;
            return (
              <li
                key={m.id}
                className="group relative h-[260px] overflow-hidden rounded-2xl border border-[#e6dfd2]"
              >
                <RegionImage
                  src={m.image}
                  label={m.city}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                  showLabel={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <div className="pointer-events-none absolute left-4 top-4">
                  <VerifiedBadge verified={m.verified} />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 lg:p-6">
                  <div>
                    <h3 className="text-[22px] font-semibold leading-tight text-white drop-shadow lg:text-[26px]">
                      {m.city}
                    </h3>
                    <p className="mt-1.5 text-[13px] font-medium text-white/85 drop-shadow">
                      Avg. discount up to {m.avgDiscountUpToPct}%
                    </p>
                    <p className="mt-0.5 text-[12px] font-medium text-white/70 drop-shadow">
                      {count} deal{count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* TODO(copy): founder to confirm trailing caption. */}
      <p className="mt-6 text-sm text-text-muted">
        New markets and exclusive opportunities are added regularly.
      </p>
    </section>
  );
}
