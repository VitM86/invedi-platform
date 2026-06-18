/**
 * mock-data.ts — single source of placeholder data for the Invedi marketplace wireframes.
 *
 * Scope: WIREFRAME fidelity. All names, copy, prices and locations are placeholder /
 * fictional. No real developers, projects, or marketing copy. Images are not stored here —
 * screens render neutral <Placeholder/> blocks instead of real renders.
 *
 * Model reflects the multi-tenant pivot:
 *   - Project is the first-class entity (Country → Region → Project → Units).
 *   - Units live INSIDE a project (project.units), never at the top level.
 *   - Projects carry a `verified` flag and a consent `tier` (see TODO open-question below).
 *
 * The mortgage widget reused on the Unit page needs `country` ∈ CountryCode, `price`,
 * and `energyLabel`; units carry those so the existing widget keeps working.
 */

export type CountryCode = "NL" | "ES" | "PT" | "FR" | "DE" | "GR";

export type UnitStatus = "available" | "reserved" | "sold";

export interface Unit {
  id: string;
  projectSlug: string;
  name: string; // e.g. "Unit 201"
  type: string; // e.g. "2-bed apartment"
  floor: number;
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  price: number; // EUR
  status: UnitStatus;
  energyLabel: string;
  balconyArea?: number;
  terraceArea?: number;
}

export interface Project {
  slug: string;
  name: string;
  developer: string;
  country: CountryCode;
  countryLabel: string;
  region: string;
  city: string;
  /** Links the project to a RegionDef in the country→region hierarchy (see regionDefs). */
  regionId: string;

  /** Trust signals. */
  verified: boolean;
  // TODO(open-question): Tier 1 = developer has NOT consented to listing yet, Tier 2/3 =
  // consented/managed. Current decision: Tier 1 uses the SAME UI as 2/3 and the verified
  // badge alone carries the distinction. Revisit if Tier 1 needs a stripped-down card.
  tier: 1 | 2 | 3;
  trustNote: string;

  /** Placeholder narrative copy. */
  description: string;
  neighbourhood: string;

  /** Facts used across cards, filters and the project page. */
  completion: string; // display, e.g. "Q4 2026" or "Completed"
  completionYear: number | null; // null = ready now / completed
  priceMin: number;
  priceMax: number;
  areaMin: number;
  areaMax: number;
  bedroomsMin: number;
  bedroomsMax: number;
  totalUnits: number;
  amenities: string[];
  shortTermLetting: boolean;

  /** Static-map pin position as a percentage of the map placeholder box. */
  pin: { x: number; y: number };
  /** Real geographic coordinates for the live Mapbox Explore map. */
  lng: number;
  lat: number;
  /** How many placeholder hero images the carousel should show. */
  heroCount: number;

  units: Unit[];
}

export const AMENITIES = [
  "Pool",
  "Gym",
  "Concierge",
  "Parking",
  "Roof terrace",
  "Garden",
  "Spa",
  "Co-working",
  "EV charging",
  "Storage",
] as const;

/* ------------------------------------------------------------------ */
/* Unit generation                                                     */
/* ------------------------------------------------------------------ */

const ENERGY_LABELS = ["A+", "A", "A", "B", "A+"];
const STATUS_CYCLE: UnitStatus[] = [
  "available",
  "available",
  "reserved",
  "available",
  "sold",
  "available",
  "available",
  "reserved",
];

/**
 * Generate `count` placeholder units for a project. Deterministic (no Math.random) so
 * server and client render identically and slugs/ids stay stable.
 */
function makeUnits(
  slug: string,
  country: CountryCode,
  count: number,
  basePrice: number,
  baseArea: number,
): Unit[] {
  const units: Unit[] = [];
  for (let i = 0; i < count; i++) {
    const floor = Math.floor(i / 2) + 1;
    const bedrooms = (i % 4) + 1;
    const bathrooms = bedrooms >= 3 ? 2 : 1;
    const area = Math.round(baseArea + bedrooms * 18 + (i % 3) * 6);
    const price = Math.round((basePrice + bedrooms * 95000 + (i % 3) * 30000) / 1000) * 1000;
    const number = floor * 100 + (i % 2) + 1; // 101, 102, 201, ...
    units.push({
      id: `unit-${number}`,
      projectSlug: slug,
      name: `Unit ${number}`,
      type: `${bedrooms}-bed ${bedrooms >= 3 ? "duplex" : "apartment"}`,
      floor,
      area,
      bedrooms,
      bathrooms,
      price,
      status: STATUS_CYCLE[i % STATUS_CYCLE.length],
      energyLabel: ENERGY_LABELS[i % ENERGY_LABELS.length],
      balconyArea: i % 2 === 0 ? 8 + (i % 3) * 2 : undefined,
      terraceArea: i % 3 === 0 ? 14 + (i % 2) * 4 : undefined,
    });
  }
  return units;
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_DESCRIPTION =
  "Placeholder project description. Two or three neutral paragraphs would describe the development, its scale, architectural approach, and delivery phasing here. No marketing copy is used at wireframe stage — this text only reserves the space and sets the reading rhythm of the block.";

const PLACEHOLDER_NEIGHBOURHOOD =
  "Placeholder neighbourhood note. A short paragraph on transport links, schools, retail, and green space would sit beside the static map. Distances and travel times are illustrative only.";

type ProjectSeed = {
  slug: string;
  name: string;
  developer: string;
  country: CountryCode;
  countryLabel: string;
  region: string;
  city: string;
  regionId: string;
  verified: boolean;
  tier: 1 | 2 | 3;
  completion: string;
  completionYear: number | null;
  amenities: string[];
  shortTermLetting: boolean;
  pin: { x: number; y: number };
  lng: number;
  lat: number;
  unitCount: number;
  basePrice: number;
  baseArea: number;
  heroCount: number;
};

const SEEDS: ProjectSeed[] = [
  {
    slug: "maple-court",
    name: "Maple Court",
    developer: "Northstar Developments",
    country: "NL",
    countryLabel: "Netherlands",
    region: "Amsterdam",
    regionId: "nl-amsterdam",
    city: "Amsterdam",
    verified: true,
    tier: 3,
    completion: "Q4 2026",
    completionYear: 2026,
    amenities: ["Concierge", "Gym", "Parking", "Roof terrace", "EV charging"],
    shortTermLetting: false,
    pin: { x: 46, y: 28 },
    lng: 4.9041,
    lat: 52.3676,
    unitCount: 6,
    basePrice: 420000,
    baseArea: 52,
    heroCount: 5,
  },
  {
    slug: "harbour-quarter",
    name: "Harbour Quarter",
    developer: "Atlas Build Group",
    country: "NL",
    countryLabel: "Netherlands",
    region: "Rotterdam–The Hague",
    regionId: "nl-rotterdam",
    city: "Rotterdam",
    verified: true, // founder decision: only verified projects on the platform
    tier: 1,
    completion: "Q2 2027",
    completionYear: 2027,
    amenities: ["Parking", "Storage", "Co-working"],
    shortTermLetting: true,
    pin: { x: 43, y: 34 },
    lng: 4.4777,
    lat: 51.9244,
    unitCount: 8,
    basePrice: 360000,
    baseArea: 48,
    heroCount: 4,
  },
  {
    slug: "olive-grove",
    name: "Olive Grove Residences",
    developer: "Mediterra Estates",
    country: "ES",
    countryLabel: "Spain",
    region: "Costa Blanca",
    regionId: "es-costa-blanca",
    city: "Alicante",
    verified: true,
    tier: 2,
    completion: "Q1 2028",
    completionYear: 2028,
    amenities: ["Pool", "Gym", "Spa", "Garden", "Parking"],
    shortTermLetting: true,
    pin: { x: 40, y: 70 },
    lng: -0.481,
    lat: 38.3452,
    unitCount: 8,
    basePrice: 295000,
    baseArea: 60,
    heroCount: 5,
  },
  {
    slug: "marina-vista",
    name: "Marina Vista",
    developer: "Costa Living S.L.",
    country: "ES",
    countryLabel: "Spain",
    region: "Costa del Sol",
    regionId: "es-costa-del-sol",
    city: "Málaga",
    verified: true, // founder decision: only verified projects on the platform
    tier: 1,
    completion: "Completed",
    completionYear: null,
    amenities: ["Pool", "Garden", "Parking", "Storage"],
    shortTermLetting: true,
    pin: { x: 30, y: 78 },
    lng: -4.4214,
    lat: 36.7213,
    unitCount: 5,
    basePrice: 330000,
    baseArea: 58,
    heroCount: 3,
  },
  {
    slug: "douro-terraces",
    name: "Douro Terraces",
    developer: "Atlantic Homes Lda.",
    country: "PT",
    countryLabel: "Portugal",
    region: "Porto & Douro",
    regionId: "pt-porto-douro",
    city: "Porto",
    verified: true,
    tier: 3,
    completion: "Q3 2027",
    completionYear: 2027,
    amenities: ["Roof terrace", "Concierge", "Gym", "EV charging"],
    shortTermLetting: false,
    pin: { x: 14, y: 58 },
    lng: -8.6291,
    lat: 41.1579,
    unitCount: 6,
    basePrice: 310000,
    baseArea: 55,
    heroCount: 5,
  },
  {
    slug: "lumiere-park",
    name: "Lumière Park",
    developer: "Hexagone Promotion",
    country: "FR",
    countryLabel: "France",
    region: "Île-de-France",
    regionId: "fr-paris",
    city: "Paris",
    verified: true,
    tier: 2,
    completion: "Q4 2027",
    completionYear: 2027,
    amenities: ["Concierge", "Parking", "Co-working", "Storage", "EV charging"],
    shortTermLetting: false,
    pin: { x: 36, y: 40 },
    lng: 2.3522,
    lat: 48.8566,
    unitCount: 7,
    basePrice: 540000,
    baseArea: 50,
    heroCount: 4,
  },
  {
    slug: "spree-lofts",
    name: "Spree Lofts",
    developer: "Baustein Immobilien",
    country: "DE",
    countryLabel: "Germany",
    region: "Berlin",
    regionId: "de-berlin",
    city: "Berlin",
    verified: true, // founder decision: only verified projects on the platform
    tier: 1,
    completion: "Q2 2026",
    completionYear: 2026,
    amenities: ["Gym", "Co-working", "Parking", "EV charging"],
    shortTermLetting: true,
    pin: { x: 58, y: 30 },
    lng: 13.405,
    lat: 52.52,
    unitCount: 6,
    basePrice: 460000,
    baseArea: 54,
    heroCount: 4,
  },
  {
    slug: "aegean-heights",
    name: "Aegean Heights",
    developer: "Helios Property",
    country: "GR",
    countryLabel: "Greece",
    region: "Athens & Attica",
    regionId: "gr-attica",
    city: "Athens",
    verified: true,
    tier: 3,
    completion: "Q1 2027",
    completionYear: 2027,
    amenities: ["Pool", "Spa", "Roof terrace", "Garden", "Parking"],
    shortTermLetting: true,
    pin: { x: 64, y: 74 },
    lng: 23.7275,
    lat: 37.9838,
    unitCount: 7,
    basePrice: 275000,
    baseArea: 62,
    heroCount: 5,
  },
];

function buildProject(seed: ProjectSeed): Project {
  const units = makeUnits(
    seed.slug,
    seed.country,
    seed.unitCount,
    seed.basePrice,
    seed.baseArea,
  );
  const prices = units.map((u) => u.price);
  const areas = units.map((u) => u.area);
  const beds = units.map((u) => u.bedrooms);
  return {
    slug: seed.slug,
    name: seed.name,
    developer: seed.developer,
    country: seed.country,
    countryLabel: seed.countryLabel,
    region: seed.region,
    city: seed.city,
    regionId: seed.regionId,
    verified: seed.verified,
    tier: seed.tier,
    trustNote: seed.verified
      ? "Placeholder trust note. Verified projects pass Invedi's listing checks (developer identity, planning permits, sales mandate). Exact criteria are TBD."
      : "Placeholder note. This project is not yet verified — developer consent and document checks are pending.",
    description: PLACEHOLDER_DESCRIPTION,
    neighbourhood: PLACEHOLDER_NEIGHBOURHOOD,
    completion: seed.completion,
    completionYear: seed.completionYear,
    priceMin: Math.min(...prices),
    priceMax: Math.max(...prices),
    areaMin: Math.min(...areas),
    areaMax: Math.max(...areas),
    bedroomsMin: Math.min(...beds),
    bedroomsMax: Math.max(...beds),
    totalUnits: units.length,
    amenities: seed.amenities,
    shortTermLetting: seed.shortTermLetting,
    pin: seed.pin,
    lng: seed.lng,
    lat: seed.lat,
    heroCount: seed.heroCount,
    units,
  };
}

export const projects: Project[] = SEEDS.map(buildProject);

/* ------------------------------------------------------------------ */
/* Lookups & derived filter options                                    */
/* ------------------------------------------------------------------ */

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getUnit(slug: string, unitId: string): Unit | undefined {
  return getProject(slug)?.units.find((u) => u.id === unitId);
}

export const countryOptions: { code: CountryCode; label: string }[] = Array.from(
  new Map(projects.map((p) => [p.country, p.countryLabel])).entries(),
).map(([code, label]) => ({ code: code as CountryCode, label }));

export function regionsForCountry(country: CountryCode | "all"): string[] {
  const set = new Set(
    projects
      .filter((p) => country === "all" || p.country === country)
      .map((p) => p.region),
  );
  return Array.from(set).sort();
}

/** Region display names for a set of countries (union). Empty list → all regions. */
export function regionsForCountries(codes: CountryCode[]): string[] {
  const set = new Set(
    projects
      .filter((p) => codes.length === 0 || codes.includes(p.country))
      .map((p) => p.region),
  );
  return Array.from(set).sort();
}

/**
 * Price-distribution histogram for the range slider.
 *
 * The shape is a smooth, right-skewed bell spread across the whole €100K–€10M range so it
 * reads like the Airbnb reference; the real project counts are layered on top (as subtle
 * bumps) where they actually fall. The bell DOMINATES so a few clustered mock projects can't
 * collapse the chart into a single spike.
 *
 * TODO(open-question): replace synthetic histogram with real distribution when live data lands
 *
 * Returns `bars`: each bar's height is 0..1 (normalised) over `buckets` linear buckets between
 * floor and ceil; `realCount` is how many project midpoints fall in each bucket.
 */
export function priceHistogram(floor: number, ceil: number, buckets = 30) {
  const width = (ceil - floor) / buckets;
  const real = new Array(buckets).fill(0);
  for (const p of projects) {
    const mid = (p.priceMin + p.priceMax) / 2;
    const i = Math.min(buckets - 1, Math.max(0, Math.floor((mid - floor) / width)));
    real[i]++;
  }
  const maxReal = Math.max(1, ...real);

  // Smooth right-skewed bell across the range (peaks lower-mid, long gentle tail to €10M).
  const bell = new Array(buckets).fill(0).map((_, i) => {
    const x = i / (buckets - 1); // 0..1
    const peak = 0.26;
    const spread = 0.2;
    const g = Math.exp(-((x - peak) ** 2) / (2 * spread * spread));
    const tail = 0.18 * Math.exp(-x * 1.8); // keeps the right side alive, never flat
    return g + tail;
  });
  const maxBell = Math.max(...bell);

  // Bell is the dominant signal (~0.85); real counts add a small bump where projects fall.
  const combined = bell.map((b, i) => 0.85 * (b / maxBell) + 0.25 * (real[i] / maxReal));
  const maxV = Math.max(...combined);

  const bars = combined.map((v, i) => ({
    height: Math.max(0.08, v / maxV),
    from: floor + i * width,
    to: floor + (i + 1) * width,
    realCount: real[i],
  }));
  return { bars, bucketWidth: width };
}

/* ------------------------------------------------------------------ */
/* Region navigator hierarchy (country → regions)                      */
/*                                                                     */
/* Powers the Airbnb-style Regions view. Each country has several      */
/* regions; only some hold projects. Empty regions (0 projects) are    */
/* intentional — they make the structure feel real and render muted /  */
/* non-selectable. Images are local files under /images/regions/.      */
/* NOTE: prototype-only Wikimedia Commons (CC) images. Verify          */
/* licensing / replace before production.                              */
/* ------------------------------------------------------------------ */

export interface RegionDef {
  id: string;
  name: string;
  country: CountryCode;
  /** Local image path (downloaded at setup; falls back to a gradient if missing). */
  image: string;
}

export interface CountryDef {
  code: CountryCode;
  label: string;
  image: string;
  regions: RegionDef[];
}

const img = (file: string) => `/images/regions/${file}.jpg`;

export const countriesWithRegions: CountryDef[] = [
  {
    code: "PT",
    label: "Portugal",
    image: img("pt"),
    regions: [
      { id: "pt-porto-douro", name: "Porto & Douro", country: "PT", image: img("pt-porto-douro") },
      { id: "pt-lisbon", name: "Lisbon", country: "PT", image: img("pt-lisbon") },
      { id: "pt-cascais-sintra", name: "Cascais & Sintra", country: "PT", image: img("pt-cascais-sintra") },
      { id: "pt-comporta", name: "Comporta & Melides", country: "PT", image: img("pt-comporta") },
      { id: "pt-algarve", name: "Algarve", country: "PT", image: img("pt-algarve") },
    ],
  },
  {
    code: "ES",
    label: "Spain",
    image: img("es"),
    regions: [
      { id: "es-costa-del-sol", name: "Costa del Sol / Marbella", country: "ES", image: img("es-costa-del-sol") },
      { id: "es-costa-blanca", name: "Costa Blanca", country: "ES", image: img("es-costa-blanca") },
      { id: "es-balearic", name: "Balearic Islands", country: "ES", image: img("es-balearic") },
      { id: "es-madrid", name: "Madrid", country: "ES", image: img("es-madrid") },
      { id: "es-barcelona", name: "Barcelona", country: "ES", image: img("es-barcelona") },
    ],
  },
  {
    code: "NL",
    label: "Netherlands",
    image: img("nl"),
    regions: [
      { id: "nl-amsterdam", name: "Amsterdam", country: "NL", image: img("nl-amsterdam") },
      { id: "nl-rotterdam", name: "Rotterdam–The Hague", country: "NL", image: img("nl-rotterdam") },
      { id: "nl-utrecht", name: "Utrecht", country: "NL", image: img("nl-utrecht") },
    ],
  },
  {
    code: "FR",
    label: "France",
    image: img("fr"),
    regions: [
      { id: "fr-paris", name: "Paris / Île-de-France", country: "FR", image: img("fr-paris") },
      { id: "fr-cote-azur", name: "Côte d'Azur", country: "FR", image: img("fr-cote-azur") },
      { id: "fr-lyon", name: "Lyon", country: "FR", image: img("fr-lyon") },
    ],
  },
  {
    code: "DE",
    label: "Germany",
    image: img("de"),
    regions: [
      { id: "de-berlin", name: "Berlin", country: "DE", image: img("de-berlin") },
      { id: "de-munich", name: "Munich", country: "DE", image: img("de-munich") },
      { id: "de-hamburg", name: "Hamburg", country: "DE", image: img("de-hamburg") },
    ],
  },
  {
    code: "GR",
    label: "Greece",
    image: img("gr"),
    regions: [
      { id: "gr-attica", name: "Athens & Attica", country: "GR", image: img("gr-attica") },
      { id: "gr-cyclades", name: "Cyclades", country: "GR", image: img("gr-cyclades") },
      { id: "gr-crete", name: "Crete", country: "GR", image: img("gr-crete") },
    ],
  },
];

/** Project count for a region id. */
export function regionProjectCount(regionId: string): number {
  return projects.filter((p) => p.regionId === regionId).length;
}

/** Project count for a country code. */
export function countryProjectCount(code: CountryCode): number {
  return projects.filter((p) => p.country === code).length;
}

/** Other projects in the same country (the map neighbours = comparison-table peers). */
export function neighbourProjects(p: Project, limit = 4): Project[] {
  return projects.filter((x) => x.country === p.country && x.slug !== p.slug).slice(0, limit);
}

export type RefKind = "city" | "airport" | "beach";
export interface ReferencePoint {
  id: string;
  label: string;
  kind: RefKind;
  lng: number;
  lat: number;
  travel: string; // display string only — no live routing
}

/**
 * Reference points (nearest city / airport, + beach for coastal projects) shown as compact
 * pills on the Region overview map. Generated deterministically near the project.
 *
 * TODO(open-question): reference points are hardcoded/placeholder offsets — replace with real
 * geocoded POIs (and real travel times) when live data lands.
 */
export function referencePointsFor(p: Project): ReferencePoint[] {
  const coastal = ["es-costa-del-sol", "es-costa-blanca", "pt-algarve", "gr-attica", "gr-cyclades", "gr-crete"];
  const refs: ReferencePoint[] = [
    {
      id: `${p.slug}-city`,
      label: `${p.city} centre`,
      kind: "city",
      lng: p.lng + 0.013,
      lat: p.lat + 0.006,
      travel: "7 min",
    },
    {
      id: `${p.slug}-airport`,
      label: `${p.city} Airport`,
      kind: "airport",
      lng: p.lng - 0.045,
      lat: p.lat + 0.028,
      travel: "24 min",
    },
  ];
  if (coastal.includes(p.regionId)) {
    refs[1] = {
      id: `${p.slug}-beach`,
      label: "Nearest beach",
      kind: "beach",
      lng: p.lng - 0.02,
      lat: p.lat - 0.018,
      travel: "9 min",
    };
  }
  return refs;
}

/** Projects in any of the selected region ids. */
export function projectsInRegions(regionIds: string[]): Project[] {
  if (regionIds.length === 0) return [];
  const set = new Set(regionIds);
  return projects.filter((p) => set.has(p.regionId));
}

/** Region name lookup for display (e.g. results line). */
export function regionName(regionId: string): string {
  for (const c of countriesWithRegions) {
    const r = c.regions.find((x) => x.id === regionId);
    if (r) return r.name;
  }
  return regionId;
}

/* ------------------------------------------------------------------ */
/* Sales status — public preview summary                               */
/* ------------------------------------------------------------------ */

// TODO(open-question): `salesStarted` and `percentSold` are DISPLAY-ONLY mock values, derived
// deterministically from the slug so they stay stable across renders (no Date / Math.random).
// When real sales data lands, promote these to real fields on Project (and per-unit status) and
// delete this helper. `unitsForSale` / `available` are real (counted from project.units).
const SALES_START_LABELS = [
  "January 2025",
  "March 2025",
  "June 2025",
  "September 2024",
  "November 2024",
];

function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 100000;
  return h;
}

export interface SalesStatusInfo {
  unitsForSale: number;
  available: number;
  percentSold: number; // 0–100 (mock)
  salesStarted: string; // display label (mock)
}

export function salesStatusFor(p: Project): SalesStatusInfo {
  const h = slugHash(p.slug);
  const available = p.units.filter((u) => u.status !== "sold").length;
  return {
    unitsForSale: p.totalUnits,
    available,
    percentSold: 40 + (h % 33), // 40–72%, stable per project
    salesStarted: SALES_START_LABELS[h % SALES_START_LABELS.length],
  };
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

/**
 * Canonical EUR formatter. ONE utility used everywhere — anything new that displays a price
 * should call this directly. Founder conventions, both at once:
 *   - NO abbreviations ("€3.390.000", never "€3.4M") — luxury real estate credibility.
 *   - Period as thousands separator ("€3.390.000", not "€3,390,000") — European/Dutch/PT/ES
 *     convention for the platform's target audience. Whole euros only, no decimal portion.
 * `nl-NL` is used because the platform originated in the Netherlands and `.` thousands is
 * shared across NL/DE/PT/ES locales — swap if the audience focus shifts.
 */
export function formatPriceFull(eur: number): string {
  return `€${eur.toLocaleString("nl-NL")}`;
}

/** Range form of formatPriceFull. Equal min/max collapses to a single amount. */
export function formatPriceRangeFull(min: number, max: number): string {
  return min === max ? formatPriceFull(min) : `${formatPriceFull(min)} – ${formatPriceFull(max)}`;
}

/**
 * @deprecated kept as a thin wrapper over {@link formatPriceFull} for backwards-compat with
 * existing callsites. Previously returned abbreviated form (`€3.4M` / `€405K`) — the founder
 * mandated full amounts everywhere. New code should use `formatPriceFull`.
 */
export function formatPrice(eur: number): string {
  return formatPriceFull(eur);
}

/** @deprecated wrapper over {@link formatPriceRangeFull}. New code: prefer the explicit name. */
export function formatPriceRange(min: number, max: number): string {
  return formatPriceRangeFull(min, max);
}

export function formatRange(min: number, max: number, suffix: string): string {
  return min === max ? `${min}${suffix}` : `${min}–${max}${suffix}`;
}

/**
 * Founder convention: "available" = NOT sold (so reserved units count as still available).
 * Used by ProjectCard and any bulk module to render "X of N units available".
 */
export function availabilityOf(p: Project): { available: number; total: number } {
  const sold = p.units.filter((u) => u.status === "sold").length;
  return { available: p.totalUnits - sold, total: p.totalUnits };
}

/* ------------------------------------------------------------------ */
/* Unit spec tables — built on demand for the Unit page so we don't    */
/* hand-author specs for every generated unit.                         */
/* ------------------------------------------------------------------ */

export function buildUnitSpecs(unit: Unit, project: Project) {
  return {
    general: {
      Status: unit.status === "available" ? "Available" : unit.status === "reserved" ? "Reserved" : "Sold",
      Price: formatPriceFull(unit.price),
      "Usable surface area": `${unit.area} m²`,
      "Price / m²": formatPriceFull(Math.round(unit.price / unit.area)),
      "Floor number": `${unit.floor}`,
      Tenure: "Freehold",
      "Service costs / month": "€—  (placeholder)",
    },
    specs: {
      "Finish level": "Turn-key (placeholder)",
      Bedrooms: `${unit.bedrooms}`,
      Bathrooms: `${unit.bathrooms}`,
      Kitchen: "Open-plan fitted kitchen (placeholder)",
      "Parking spaces": project.amenities.includes("Parking") ? "1" : "0",
      Outdoor: [
        unit.balconyArea ? `${unit.balconyArea} m² balcony` : null,
        unit.terraceArea ? `${unit.terraceArea} m² terrace` : null,
      ]
        .filter(Boolean)
        .join(" · ") || "—",
    },
    optionalCosts: {
      "Furniture pack": "€—  (placeholder)",
      "Parking space": project.amenities.includes("Parking") ? "€—  (placeholder)" : "n/a",
    },
    energy: {
      "Energy label": unit.energyLabel,
      Heating: "Placeholder — heat pump / underfloor",
    },
    timeline: {
      "Payment plan": "Placeholder — staged on milestones",
      "Expected delivery": project.completion,
    },
  };
}
