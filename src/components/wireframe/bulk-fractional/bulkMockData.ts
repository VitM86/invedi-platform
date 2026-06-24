/**
 * bulkMockData — placeholder data for the Bulk landing sub-section.
 *
 * TODO(data): placeholder bulk stats / markets — replace with real values pulled from the
 * back-end once it exists. Kept in one file so part 3 (filter wiring) and any later real-data
 * pass can swap the source without hunting across components.
 */

/** Stats row — five summary metrics shown above the filter bar. */
export type BulkStat = {
  /** Internal key, used for React `key` and analytics later. */
  id: string;
  label: string;
  /** Pre-formatted display value. Euros pre-formatted via formatPriceFull at the call site. */
  value: string;
  /** Small de-emphasised line under the value (e.g. percentage breakdown). */
  hint?: string;
};

/** Market card — city we have bulk-deal access in, with a teaser discount ceiling. */
export type BulkMarket = {
  id: string;
  city: string;
  /** Marketing teaser, NOT a guarantee — surfaced as "Avg. discount up to X%". */
  avgDiscountUpToPct: number;
  /** Image path. Missing files fall back to RegionImage's gradient + label. */
  image: string;
  /** "Verified" pill matches the rest of the platform's trust signal. */
  verified: boolean;
};

/** Markets list. Order matches the PDF the founder shared.
 *
 * Existing assets in /public/images/regions/ that map cleanly: amsterdam (nl-amsterdam.jpg).
 * Other five cities don't have photos yet — listed below for design to drop in later:
 *   - public/images/regions/uk-london.jpg
 *   - public/images/regions/ae-dubai.jpg
 *   - public/images/regions/us-miami.jpg
 *   - public/images/regions/ae-abu-dhabi.jpg
 *   - public/images/regions/de-berlin.jpg
 * Until those exist, RegionImage gracefully degrades to a labelled gradient.
 */
export const BULK_MARKETS: BulkMarket[] = [
  { id: "london",    city: "London",    avgDiscountUpToPct: 22, image: "/images/regions/uk-london.jpg",    verified: true },
  { id: "dubai",     city: "Dubai",     avgDiscountUpToPct: 23, image: "/images/regions/ae-dubai.jpg",     verified: true },
  { id: "miami",     city: "Miami",     avgDiscountUpToPct: 24, image: "/images/regions/us-miami.jpg",     verified: true },
  { id: "abu-dhabi", city: "Abu Dhabi", avgDiscountUpToPct: 18, image: "/images/regions/ae-abu-dhabi.jpg", verified: true },
  { id: "berlin",    city: "Berlin",    avgDiscountUpToPct: 16, image: "/images/regions/de-berlin.jpg",    verified: true },
  { id: "amsterdam", city: "Amsterdam", avgDiscountUpToPct: 17, image: "/images/regions/nl-amsterdam.jpg", verified: true },
];

/** Raw numeric values surfaced in the stats row. Euros are formatted in the component using
 *  the shared formatPriceFull so we keep one source of truth for locale (nl-NL period
 *  thousands). Keeping the numbers RAW here lets part 3 derive metrics from them or compare. */
export const BULK_STATS_RAW = {
  activeDeals: 1,
  avgDiscountPct: 17,
  exclusiveDeals: 0,
  totalDealVolumeEur: 58_600_000,
  discountedVolumeEur: 10_000_000,
  /** Discounted volume as % of total — matches the "(17%)" hint in the design. */
  discountedVolumePct: 17,
};
