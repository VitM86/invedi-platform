/**
 * fractionalMockData — placeholder data for the Fractional landing sub-section.
 *
 * Part 4 ships these as static, click-to-select rosters. Part 5 will turn the captured
 * selection state into actual filter / params on a deal list — kept in one file so that
 * pass can swap or extend the data source without rewriting the grids.
 *
 * Deliberate divergence from Bulk: Fractional rosters by COUNTRY ("Portugal", "Spain"…)
 * where Bulk rosters by CITY ("London", "Dubai"…). Per the founder's PDF and called out
 * as an open question; treat them as separate dimensions for now and don't try to unify.
 *
 * TODO(data): placeholder fractional categories / countries.
 */

/* ------------------------------------------------------------------ */
/* Asset categories — what KIND of asset is being fractionalised.       */
/* ------------------------------------------------------------------ */

/** Icon variants used by FractionalCategoryGrid — each maps to an inline SVG defined
 *  next to the grid. Kept as a string-union (rather than a node) so the data file stays
 *  framework-agnostic and serialisable. */
export type FractionalCategoryIcon =
  | "land" | "hotel" | "residential" | "padel" | "sports";

export type FractionalCategory = {
  id: string;
  label: string;
  /** Small de-emphasised line under the label; optional. */
  subLabel?: string;
  icon: FractionalCategoryIcon;
};

export const FRACTIONAL_CATEGORIES: FractionalCategory[] = [
  { id: "land",        label: "Land",         subLabel: "(for communal residential / hotel)", icon: "land" },
  { id: "hotel",       label: "Hotel",        subLabel: "(existing)",                          icon: "hotel" },
  { id: "residential", label: "Residential",  subLabel: "(existing)",                          icon: "residential" },
  { id: "padel",       label: "Padel club",                                                    icon: "padel" },
  { id: "sports",      label: "Sports clubs", subLabel: "(gym / wellness / yoga)",             icon: "sports" },
];

/* ------------------------------------------------------------------ */
/* Countries — the geo dimension of the fractional roster.              */
/* ------------------------------------------------------------------ */

export type FractionalCountry = {
  id: string;
  country: string;
  /** Editorial sub-label describing the focus location / vibe. */
  location: string;
  /** Image path. Missing files fall back to RegionImage's labelled gradient. */
  image: string;
};

/** Country roster from the PDF. Existing assets in /public/images/regions/ that map cleanly:
 *    Portugal     -> pt-algarve.jpg  ✓
 *    Spain        -> es.jpg          ✓ (Ibiza-specific not in repo)
 *    Germany      -> de.jpg          ✓ (Berlin-specific not in repo)
 *  Missing — listed so design can drop them in later (RegionImage degrades to a gradient
 *  with the country label until they arrive):
 *    /images/regions/za-stellenbosch.jpg
 *    /images/regions/us-miami.jpg
 */
export const FRACTIONAL_COUNTRIES: FractionalCountry[] = [
  { id: "pt", country: "Portugal",     location: "Algarve",                            image: "/images/regions/pt-algarve.jpg" },
  { id: "es", country: "Spain",        location: "Ibiza",                              image: "/images/regions/es.jpg" },
  { id: "de", country: "Germany",      location: "Berlin vibes",                       image: "/images/regions/de.jpg" },
  { id: "za", country: "South Africa", location: "Iconic vineyard in Stellenbosch",    image: "/images/regions/za-stellenbosch.jpg" },
  { id: "us", country: "USA",          location: "Miami",                              image: "/images/regions/us-miami.jpg" },
];

/* ------------------------------------------------------------------ */
/* Fractional listings — the deals the filters act on.                  */
/* ------------------------------------------------------------------ */

/** Three flexibility dimensions surfaced as paired toggles in the params block. Each pair
 *  on a listing carries one of the two sides; the user filter has a third "any" state. */
export type FractionalLeasing  = "non-permitted" | "permitted";
export type FractionalTenure   = "leasehold"     | "freehold";
export type FractionalOperator = "external"      | "own";

/** Audience the opportunity is targeted at — drives the "Type" param. */
export type FractionalAudience = "investor" | "broker";

export type FractionalListing = {
  id: string;
  /** Matches FractionalCategory.id so the category grid can drive filtering. */
  categoryId: string;
  /** Matches FractionalCountry.id so the country grid can drive filtering. */
  countryId: string;
  /** Sub-area / location string surfaced under the asset name. */
  location: string;
  /** Marketing name of the asset. */
  assetName: string;
  /** Total asset value (€). */
  totalAssetValueEur: number;
  /** Minimum entry / per-share ticket (€). */
  minShareEur: number;
  /** Currently sellable shares. */
  availableShares: number;
  /** Total shares the asset is split into. */
  totalShares: number;
  /** Flexibility flags — match the three paired toggles in the params block. */
  leasing:  FractionalLeasing;
  tenure:   FractionalTenure;
  operator: FractionalOperator;
  /** Whom the opportunity is presented to. */
  audience: FractionalAudience;
};

// TODO(data): placeholder fractional listings — variety across categories, countries, and
// flexibility flags so the part-5 filter pipeline has something to demonstrate against.
export const FRACTIONAL_LISTINGS: FractionalListing[] = [
  {
    id: "pt-lisbon-hotel",  categoryId: "hotel",       countryId: "pt", location: "Lisbon",
    assetName: "Lisbon Riverside Hotel", totalAssetValueEur: 24_000_000, minShareEur: 120_000,
    availableShares: 65, totalShares: 200, leasing: "permitted",     tenure: "freehold",  operator: "own",      audience: "investor",
  },
  {
    id: "pt-algarve-villa",  categoryId: "residential", countryId: "pt", location: "Algarve",
    assetName: "Algarve Cliff Villa",    totalAssetValueEur:  6_500_000, minShareEur:  65_000,
    availableShares: 24, totalShares: 100, leasing: "permitted",     tenure: "freehold",  operator: "external", audience: "investor",
  },
  {
    id: "pt-comporta-land",  categoryId: "land",        countryId: "pt", location: "Comporta",
    assetName: "Comporta Coastal Plot",  totalAssetValueEur:  9_800_000, minShareEur:  98_000,
    availableShares: 80, totalShares: 100, leasing: "non-permitted", tenure: "freehold",  operator: "external", audience: "broker",
  },
  {
    id: "pt-algarve-padel",  categoryId: "padel",       countryId: "pt", location: "Algarve",
    assetName: "Algarve Padel Resort",   totalAssetValueEur:  3_200_000, minShareEur:  32_000,
    availableShares: 40, totalShares: 100, leasing: "permitted",     tenure: "leasehold", operator: "own",      audience: "investor",
  },
  {
    id: "es-ibiza-beach-club",  categoryId: "sports",   countryId: "es", location: "Ibiza",
    assetName: "Ibiza Beach Wellness",   totalAssetValueEur:  8_400_000, minShareEur:  84_000,
    availableShares: 30, totalShares: 100, leasing: "non-permitted", tenure: "leasehold", operator: "external", audience: "investor",
  },
  {
    id: "de-berlin-lofts",  categoryId: "residential",  countryId: "de", location: "Berlin Mitte",
    assetName: "Berlin Mitte Lofts",     totalAssetValueEur: 12_000_000, minShareEur:  60_000,
    availableShares: 110, totalShares: 200, leasing: "permitted",    tenure: "freehold",  operator: "own",      audience: "investor",
  },
  {
    id: "za-stellenbosch-vine",  categoryId: "land",   countryId: "za", location: "Stellenbosch",
    assetName: "Stellenbosch Vineyard",  totalAssetValueEur: 18_500_000, minShareEur: 185_000,
    availableShares: 55, totalShares: 100, leasing: "non-permitted", tenure: "freehold",  operator: "own",      audience: "investor",
  },
  {
    id: "us-miami-padel",  categoryId: "padel",         countryId: "us", location: "Miami",
    assetName: "Miami Padel Complex",    totalAssetValueEur:  4_900_000, minShareEur:  49_000,
    availableShares: 70, totalShares: 100, leasing: "permitted",     tenure: "leasehold", operator: "external", audience: "broker",
  },
];
