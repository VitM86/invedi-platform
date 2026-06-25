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
