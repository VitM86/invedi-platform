import type { CountryCode } from "@/lib/mock-data";

export type ViewMode = "regions" | "map" | "grid";

export type CompletionFilter = "any" | "ready" | "2026" | "2027" | "2028+";

/** Price slider bounds (EUR). Floor reads as "No minimum", ceil as "No maximum". */
export const PRICE_FLOOR = 100_000;
export const PRICE_CEIL = 10_000_000;

export interface Filters {
  countries: CountryCode[]; // empty = any
  regions: string[]; // region display names; empty = any
  priceMin: number; // EUR, PRICE_FLOOR = no minimum
  priceMax: number; // EUR, PRICE_CEIL = no maximum
  bedrooms: number; // minimum bedrooms, 0 = any
  areaMin: number; // m², 0 = any
  completion: CompletionFilter;
  amenities: string[]; // project must include ALL selected
  shortTermOnly: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  countries: [],
  regions: [],
  priceMin: PRICE_FLOOR,
  priceMax: PRICE_CEIL,
  bedrooms: 0,
  areaMin: 0,
  completion: "any",
  amenities: [],
  shortTermOnly: false,
};

/* Shared control config (used by both desktop bar and mobile sheet) */

export const BED_MAX = 4;
export const bedLabel = (n: number) => (n <= 0 ? "Any" : `${n}+`);

export const AREA_THRESHOLDS = [0, 40, 60, 80, 100];
export const areaLabel = (m2: number) => (m2 <= 0 ? "Any" : `${m2}+ m²`);

// TODO(open-question): Completion has 5 options — one over the "≤4 = segmented" guideline.
// Kept segmented (wraps fine). Flag if the threshold feels wrong here.
export const COMPLETION_OPTIONS: { value: CompletionFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "ready", label: "Ready" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028+", label: "2028+" },
];

/** Number of distinct active filter groups — drives the mobile "Filters · N" badge. */
export function activeFilterCount(f: Filters): number {
  let n = 0;
  if (f.countries.length) n++;
  if (f.regions.length) n++;
  if (f.priceMin > PRICE_FLOOR || f.priceMax < PRICE_CEIL) n++;
  if (f.bedrooms > 0) n++;
  if (f.areaMin > 0) n++;
  if (f.completion !== "any") n++;
  if (f.amenities.length) n++;
  if (f.shortTermOnly) n++;
  return n;
}
