/**
 * BulkMarketsGrid — "Markets we have access to" grid of city cards.
 *
 * Card vocabulary borrowed from MarketFocusV2: photo with bottom-aligned text over a black
 * → transparent gradient scrim. Shrunken proportions (h-[260px] vs MarketFocusV2's 420px)
 * since this is a six-card list, not a hero pair. Each card carries an Invedi-verified pill
 * top-left and the "Avg. discount up to X%" teaser bottom-right of the title block.
 *
 * Cards aren't linked yet — part 3 will route them to filtered deal lists. Rendered as <div>
 * (not <Link>) so they're not announcing fake-navigation to screen readers.
 */

import { RegionImage } from "../explore/RegionImage";
import { VerifiedBadge } from "../VerifiedBadge";
import { BULK_MARKETS } from "./bulkMockData";

export function BulkMarketsGrid() {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">
          Markets we have access to
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BULK_MARKETS.map((m) => (
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

            {/* Top-left: verified pill */}
            <div className="pointer-events-none absolute left-4 top-4">
              <VerifiedBadge verified={m.verified} />
            </div>

            {/* Bottom: city name + discount teaser */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 lg:p-6">
              <div>
                <h3 className="text-[22px] font-semibold leading-tight text-white drop-shadow lg:text-[26px]">
                  {m.city}
                </h3>
                <p className="mt-1.5 text-[13px] font-medium text-white/85 drop-shadow">
                  Avg. discount up to {m.avgDiscountUpToPct}%
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* TODO(copy): founder to confirm trailing caption. */}
      <p className="mt-6 text-sm text-text-muted">
        New markets and exclusive opportunities are added regularly.
      </p>
    </section>
  );
}
