/**
 * bulkFilters — types, defaults, and a pure pipeline that filters + sorts BULK_LISTINGS.
 *
 * Kept off the components so the matcher/sort can be unit-tested or extended (in a future
 * pass) without re-rendering UI files. The pipeline order is: search → city → location →
 * delivery → status → volume range → price-per-unit range, then sort.
 *
 * Requirements (off-plan vs finished, letting policy, operator) are intentionally NOT in
 * Filters — those are captured separately (RequirementsBlock) per the founder direction:
 *   // TODO: wire requirements to filtering — they're preference signals for a later
 *   ranking pass, not strict filters.
 */

import { BULK_LISTINGS, type BulkListing, type BulkListingStatus, type BulkDeliveryQuarter } from "./bulkMockData";

/** Delivery filter is bucketed (Any / Ready / 2026 / 2027 / 2028+) so the dropdown reads
 *  the same as Explore's CompletionFilter even though listings store quarters. */
export type BulkDeliveryFilter = "any" | "ready" | "2026" | "2027" | "2028+";

/** Status filter mirrors listing statuses + an "Any" wildcard. */
export type BulkStatusFilter = "any" | BulkListingStatus;

/** Sort key surfaced as "Sort: …" on the right of the filter row. */
export type BulkSortKey = "recommended" | "price-per-unit" | "discount" | "volume";

/** Sensible volume / price-per-unit bounds covering the listing pool with a bit of slack
 *  so users can drag past the extremes to clearly clear the filter. */
export const VOLUME_FLOOR = 0;
export const VOLUME_CEIL  = 15_000_000;
export const PER_UNIT_FLOOR = 0;
export const PER_UNIT_CEIL  =  3_000_000;

export interface BulkFilters {
  /** Free-text search applied to city + location + project, case-insensitive. */
  search: string;
  /** Markets (city) multi-select. Empty = any. Values are BulkMarket.id. */
  marketIds: string[];
  /** Location / neighbourhood multi-select. Empty = any. Values are listing.location. */
  locations: string[];
  delivery: BulkDeliveryFilter;
  status: BulkStatusFilter;
  /** Inclusive €. Both ends at the floor/ceil = no range filter applied. */
  volumeMin: number;
  volumeMax: number;
  pricePerUnitMin: number;
  pricePerUnitMax: number;
  sort: BulkSortKey;
}

export const DEFAULT_BULK_FILTERS: BulkFilters = {
  search: "",
  marketIds: [],
  locations: [],
  delivery: "any",
  status: "any",
  volumeMin: VOLUME_FLOOR,
  volumeMax: VOLUME_CEIL,
  pricePerUnitMin: PER_UNIT_FLOOR,
  pricePerUnitMax: PER_UNIT_CEIL,
  sort: "recommended",
};

/** True iff the listing's delivery quarter falls inside the bucketed filter selection. */
function matchesDelivery(delivery: BulkDeliveryQuarter, f: BulkDeliveryFilter): boolean {
  if (f === "any") return true;
  if (f === "ready") return delivery === "ready";
  if (f === "2026") return delivery.endsWith("2026");
  if (f === "2027") return delivery.endsWith("2027");
  // 2028+ bucket sweeps 2028 quarters and the explicit "2029+" sentinel.
  return delivery.endsWith("2028") || delivery === "2029+";
}

/** True iff every active filter passes for this listing. */
function matchesAll(listing: BulkListing, f: BulkFilters): boolean {
  if (f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    const hay = `${listing.city} ${listing.location} ${listing.project}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.marketIds.length > 0 && !f.marketIds.includes(listing.marketId)) return false;
  if (f.locations.length > 0 && !f.locations.includes(listing.location)) return false;
  if (!matchesDelivery(listing.delivery, f.delivery)) return false;
  if (f.status !== "any" && listing.status !== f.status) return false;
  if (listing.totalVolumeEur < f.volumeMin || listing.totalVolumeEur > f.volumeMax) return false;
  if (listing.pricePerUnitEur < f.pricePerUnitMin || listing.pricePerUnitEur > f.pricePerUnitMax) return false;
  return true;
}

/** Sort the listings array in place-safe (returns a new array). "Recommended" preserves
 *  source order — that's the curated ordering the editorial team would maintain in prod. */
function sortListings(listings: BulkListing[], sort: BulkSortKey): BulkListing[] {
  if (sort === "recommended") return listings;
  const copy = [...listings];
  if (sort === "price-per-unit") copy.sort((a, b) => a.pricePerUnitEur - b.pricePerUnitEur);
  else if (sort === "discount")  copy.sort((a, b) => b.discountPct      - a.discountPct);
  else /* volume */              copy.sort((a, b) => b.totalVolumeEur   - a.totalVolumeEur);
  return copy;
}

/** Top-level pipeline: filter then sort. */
export function applyBulkFilters(filters: BulkFilters): BulkListing[] {
  return sortListings(BULK_LISTINGS.filter((l) => matchesAll(l, filters)), filters.sort);
}

/** Count of active filter groups — drives the "Clear filters" affordance in the UI. */
export function activeBulkFilterCount(f: BulkFilters): number {
  let n = 0;
  if (f.search.trim()) n++;
  if (f.marketIds.length) n++;
  if (f.locations.length) n++;
  if (f.delivery !== "any") n++;
  if (f.status !== "any") n++;
  if (f.volumeMin > VOLUME_FLOOR || f.volumeMax < VOLUME_CEIL) n++;
  if (f.pricePerUnitMin > PER_UNIT_FLOOR || f.pricePerUnitMax < PER_UNIT_CEIL) n++;
  if (f.sort !== "recommended") n++;
  return n;
}

/** All unique locations across the listing pool — feeds the "Any location" dropdown. */
export function allBulkLocations(): string[] {
  return Array.from(new Set(BULK_LISTINGS.map((l) => l.location))).sort();
}

export const DELIVERY_OPTIONS: { value: BulkDeliveryFilter; label: string }[] = [
  { value: "any",   label: "Any delivery" },
  { value: "ready", label: "Ready" },
  { value: "2026",  label: "2026" },
  { value: "2027",  label: "2027" },
  { value: "2028+", label: "2028+" },
];

export const STATUS_OPTIONS: { value: BulkStatusFilter; label: string }[] = [
  { value: "any",         label: "Any status" },
  { value: "available",   label: "Available" },
  { value: "under-offer", label: "Under offer" },
  { value: "reserved",    label: "Reserved" },
];

export const SORT_OPTIONS: { value: BulkSortKey; label: string }[] = [
  { value: "recommended",    label: "Recommended" },
  { value: "price-per-unit", label: "Price per unit" },
  { value: "discount",       label: "Discount %" },
  { value: "volume",         label: "Volume" },
];
