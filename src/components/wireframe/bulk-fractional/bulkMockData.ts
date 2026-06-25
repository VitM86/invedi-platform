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
 *  thousands). Keeping the numbers RAW here lets part 3 derive metrics from them or compare.
 *
 *  These are decoupled from BULK_LISTINGS on purpose: in production the stats reflect the
 *  full market (including deals the user can't see yet), not just the visible listings. */
export const BULK_STATS_RAW = {
  activeDeals: 1,
  avgDiscountPct: 17,
  exclusiveDeals: 0,
  totalDealVolumeEur: 58_600_000,
  discountedVolumeEur: 10_000_000,
  /** Discounted volume as % of total — matches the "(17%)" hint in the design. */
  discountedVolumePct: 17,
};

/* ------------------------------------------------------------------ */
/* Bulk listings — the actual deals the filters act on.                */
/* ------------------------------------------------------------------ */

export type BulkDeliveryQuarter =
  | "ready"
  | "Q1 2026" | "Q2 2026" | "Q3 2026" | "Q4 2026"
  | "Q1 2027" | "Q2 2027" | "Q3 2027" | "Q4 2027"
  | "Q1 2028" | "Q2 2028" | "Q3 2028" | "Q4 2028"
  | "2029+";

export type BulkListingStatus = "available" | "under-offer" | "reserved";

export type BulkListing = {
  id: string;
  /** Matches one of BULK_MARKETS[].id so the markets grid can hide/show city cards. */
  marketId: string;
  /** Display name copy, e.g. "London". Duplicated for ergonomic render — derived in
   *  practice from BULK_MARKETS but inlined here so listings are self-describing. */
  city: string;
  /** Sub-area / neighbourhood — surfaced under the city in the deal card and as the
   *  "Any location" filter dimension. */
  location: string;
  /** Project / development name. */
  project: string;
  /** Number of units in the bulk allocation. */
  totalUnits: number;
  /** Percentage off the per-unit list price. Surfaced as "%". */
  discountPct: number;
  /** Per-unit price (already-discounted), EUR. */
  pricePerUnitEur: number;
  /** Total deal volume = pricePerUnitEur × totalUnits, EUR. Kept derived but stored for
   *  easy sort + display. */
  totalVolumeEur: number;
  /** Delivery quarter. "ready" = move-in ready. */
  delivery: BulkDeliveryQuarter;
  /** Sales status. */
  status: BulkListingStatus;
};

// TODO(data): placeholder bulk listings — a small inventory across the six markets so the
// filter wiring has something to act on. Volumes computed pricePerUnit × totalUnits.
export const BULK_LISTINGS: BulkListing[] = [
  {
    id: "lon-mayfair-one",  marketId: "london",    city: "London",    location: "Mayfair",
    project: "One Mayfair",       totalUnits: 6,  discountPct: 22, pricePerUnitEur: 1_800_000,
    totalVolumeEur: 10_800_000,   delivery: "Q4 2026", status: "available",
  },
  {
    id: "lon-chelsea-reserve",  marketId: "london",    city: "London",    location: "Chelsea",
    project: "Chelsea Reserve",   totalUnits: 4,  discountPct: 18, pricePerUnitEur: 2_200_000,
    totalVolumeEur:  8_800_000,   delivery: "Q2 2027", status: "under-offer",
  },
  {
    id: "dxb-palm-pearl",  marketId: "dubai",     city: "Dubai",     location: "Palm Jumeirah",
    project: "Pearl Residences",  totalUnits: 8,  discountPct: 23, pricePerUnitEur: 1_400_000,
    totalVolumeEur: 11_200_000,   delivery: "Q3 2026", status: "available",
  },
  {
    id: "dxb-downtown-burjvista",  marketId: "dubai",     city: "Dubai",     location: "Downtown",
    project: "Burj Vista Loft",   totalUnits: 5,  discountPct: 20, pricePerUnitEur:   950_000,
    totalVolumeEur:  4_750_000,   delivery: "ready",   status: "available",
  },
  {
    id: "mia-brickell-edge",  marketId: "miami",     city: "Miami",     location: "Brickell",
    project: "Brickell Edge",     totalUnits: 7,  discountPct: 24, pricePerUnitEur:   700_000,
    totalVolumeEur:  4_900_000,   delivery: "Q1 2027", status: "available",
  },
  {
    id: "auh-saadiyat-lagoons",  marketId: "abu-dhabi", city: "Abu Dhabi", location: "Saadiyat Island",
    project: "Saadiyat Lagoons",  totalUnits: 5,  discountPct: 18, pricePerUnitEur: 1_100_000,
    totalVolumeEur:  5_500_000,   delivery: "Q4 2027", status: "reserved",
  },
  {
    id: "ber-mitte-quartier",  marketId: "berlin",    city: "Berlin",    location: "Mitte",
    project: "Mitte Quartier",    totalUnits: 10, discountPct: 15, pricePerUnitEur:   450_000,
    totalVolumeEur:  4_500_000,   delivery: "Q2 2026", status: "available",
  },
  {
    id: "ams-noord-quay",  marketId: "amsterdam", city: "Amsterdam", location: "Amsterdam-Noord",
    project: "Noord Quay",        totalUnits: 9,  discountPct: 17, pricePerUnitEur:   550_000,
    totalVolumeEur:  4_950_000,   delivery: "Q3 2026", status: "available",
  },
];
