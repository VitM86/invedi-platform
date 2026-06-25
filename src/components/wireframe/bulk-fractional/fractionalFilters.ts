/**
 * fractionalFilters — types + pure pipeline for the Fractional listings.
 *
 * Mirrors the shape of bulkFilters.ts so the two sub-sections feel like siblings: a
 * single Filters interface, sensible DEFAULTS, a per-listing matcher, and one
 * applyFractionalFilters() entry point. Sort isn't surfaced yet (no "Sort:" control in the
 * params block — would land if/when the founder asks for ordering).
 *
 * Selection state from the category + country grids feeds straight into this:
 *   filters.categoryIds — empty = any · selected entries narrow by listing.categoryId
 *   filters.countryIds  — empty = any · selected entries narrow by listing.countryId
 *
 * The three flexibility pairs (leasing / tenure / operator) and the audience type each
 * have an "any" wildcard plus the two concrete sides. The volume + per-share-price ranges
 * snap to floor/ceil = no range filter.
 */

import {
  FRACTIONAL_LISTINGS,
  type FractionalAudience,
  type FractionalLeasing,
  type FractionalListing,
  type FractionalOperator,
  type FractionalTenure,
} from "./fractionalMockData";

export const FRACTIONAL_VOLUME_FLOOR = 0;
export const FRACTIONAL_VOLUME_CEIL  = 30_000_000;
export const FRACTIONAL_SHARE_FLOOR  = 0;
export const FRACTIONAL_SHARE_CEIL   = 500_000;

export type FractionalLeasingFilter  = "any" | FractionalLeasing;
export type FractionalTenureFilter   = "any" | FractionalTenure;
export type FractionalOperatorFilter = "any" | FractionalOperator;
export type FractionalAudienceFilter = "any" | FractionalAudience;

export interface FractionalFilters {
  /** Wired from FractionalCategoryGrid in part 5. */
  categoryIds: string[];
  /** Wired from FractionalCountryGrid in part 5. */
  countryIds: string[];

  /** Range — both ends at floor/ceil means "no range filter". */
  volumeMin: number;
  volumeMax: number;
  perShareMin: number;
  perShareMax: number;

  /** Flexibility — three paired toggles from the PDF (any/left/right). */
  leasing:  FractionalLeasingFilter;
  tenure:   FractionalTenureFilter;
  operator: FractionalOperatorFilter;

  /** Audience type — two-option selector + "any". */
  audience: FractionalAudienceFilter;
}

export const DEFAULT_FRACTIONAL_FILTERS: FractionalFilters = {
  categoryIds: [],
  countryIds:  [],
  volumeMin:   FRACTIONAL_VOLUME_FLOOR,
  volumeMax:   FRACTIONAL_VOLUME_CEIL,
  perShareMin: FRACTIONAL_SHARE_FLOOR,
  perShareMax: FRACTIONAL_SHARE_CEIL,
  leasing:     "any",
  tenure:      "any",
  operator:    "any",
  audience:    "any",
};

function matchesAll(l: FractionalListing, f: FractionalFilters): boolean {
  if (f.categoryIds.length > 0 && !f.categoryIds.includes(l.categoryId)) return false;
  if (f.countryIds.length  > 0 && !f.countryIds.includes(l.countryId))   return false;

  if (l.totalAssetValueEur < f.volumeMin || l.totalAssetValueEur > f.volumeMax) return false;
  if (l.minShareEur < f.perShareMin || l.minShareEur > f.perShareMax)           return false;

  if (f.leasing  !== "any" && l.leasing  !== f.leasing)  return false;
  if (f.tenure   !== "any" && l.tenure   !== f.tenure)   return false;
  if (f.operator !== "any" && l.operator !== f.operator) return false;
  if (f.audience !== "any" && l.audience !== f.audience) return false;

  return true;
}

export function applyFractionalFilters(filters: FractionalFilters): FractionalListing[] {
  return FRACTIONAL_LISTINGS.filter((l) => matchesAll(l, filters));
}

/** Number of active filter groups — drives the "Clear filters" affordance. */
export function activeFractionalFilterCount(f: FractionalFilters): number {
  let n = 0;
  if (f.categoryIds.length) n++;
  if (f.countryIds.length)  n++;
  if (f.volumeMin   > FRACTIONAL_VOLUME_FLOOR || f.volumeMax   < FRACTIONAL_VOLUME_CEIL) n++;
  if (f.perShareMin > FRACTIONAL_SHARE_FLOOR  || f.perShareMax < FRACTIONAL_SHARE_CEIL)  n++;
  if (f.leasing  !== "any") n++;
  if (f.tenure   !== "any") n++;
  if (f.operator !== "any") n++;
  if (f.audience !== "any") n++;
  return n;
}
