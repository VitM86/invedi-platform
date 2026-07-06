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

/**
 * ProjectReview — the Invedi editorial assessment shown on each project page. All values are
 * HAND-AUTHORED placeholder content — there is no formula, no computation. The verdict label
 * uses one of three controlled strings so the badge color/style can be picked deterministically.
 */
export type ReviewVerdict = "Recommended" | "Recommended with reservations" | "Not recommended";

export interface ProjectReview {
  /** Out of 10, one decimal (e.g. 8.3). Public surfaces show only the 1–3 star tier derived
   *  by `scoreToStars`; this number itself appears only inside the gated full analysis. */
  score: number;
  verdict: ReviewVerdict;
  /** True while the assessment is preliminary (project still in development / developer under
   *  review). Surfaces append a "Preliminary" label wherever the assessment is credited. */
  preliminary?: boolean;
  /** Two-to-three-sentence neutral analytical summary explaining the score. */
  summary: string;
  /** Short positive points. Aim for 3. */
  strengths: string[];
  /** "Points of attention" framing (Independer-style) — neutral, NOT alarmist. Aim for 2. */
  considerations: string[];
  /** Five-criterion breakdown with a per-line score and one-line note. */
  criteria: { label: string; score: number; note: string }[];
}

/**
 * scoreToStars — SINGLE SOURCE OF TRUTH for the public 1/2/3-star rating.
 *
 * Team decision: the public-facing rating is stars, not the numeric score. The numeric
 * `score` above still exists (and drives the per-criteria breakdown), but it is only ever
 * shown inside the gated full analysis. Everywhere public we render stars derived from it.
 *
 * Founder-updated thresholds:
 *   9.0–10.0 → 3 stars
 *   7.5–8.5  → 2 stars
 *   6.0–7.0  → 1 star
 *   < 6.0    → 0 (NO badge at all — callers must render nothing, not a "no star" label)
 *
 * The stated bands leave two gaps (7.0–7.5 and 8.5–9.0). For now those round DOWN to the
 * lower tier: 7.2 → 1★, 8.7 → 2★ (i.e. thresholds are >=9 → 3, >=7.5 → 2, >=6 → 1).
 * // TODO(open-question): gap ranges 7.0-7.5 and 8.5-9.0, founder to confirm exact thresholds.
 *
 * Kept next to the score data on purpose so the mapping can never diverge from the field
 * it reads. Any surface that shows the rating must go through this function.
 */
export function scoreToStars(score: number): 0 | 1 | 2 | 3 {
  if (score >= 9) return 3;
  if (score >= 7.5) return 2;
  if (score >= 6) return 1;
  return 0;
}

/**
 * ProjectStory — the editorial "story" landing content rendered by /story/[slug]. Entirely
 * hand-authored placeholder content (like `review`). OPTIONAL: only projects with a filled
 * `story` get a story page and a card link to it. Adding/removing a story is pure data — the
 * StoryTemplate renders any project from this object alone, so a fourth story needs zero template
 * changes.
 *
 * // TODO(content): placeholder editorial, to be authored per project via admin later.
 */
export interface ProjectStory {
  /** Giant serif statement line, also used in the hero and the statement-line section. */
  tagline: string;
  /** Hero status line, e.g. "Limited release — launching 2027". */
  statusLine: string;
  /** 2–3 sentence emotional intro paragraph. */
  intro: string;
  whyInvedi: {
    heading: string;
    /** 3–4 editorial paragraphs, first-person plural (we visited / we assessed). */
    body: string[];
    /** Signature — a seam for a guest curator later. */
    curator: string;
  };
  /** 4–6 local image paths for the asymmetric editorial collage. */
  collage: string[];
  /** Optional hero slideshow. When present (≥2 slides) the story hero crossfades through these
   *  in order — reusing the /v3 HeroBackground `Slideshow` mechanism — instead of showing the
   *  single `collage[0]` still. Slide 1 should match `collage[0]` for a seamless first paint.
   *  Absent → single-image hero (the default; other projects are unchanged). */
  heroSlides?: { src: string; alt: string }[];
  lifestyle: { heading: string; body: string; highlights: string[] };
  /** Optional large lifestyle image paired with the amenities (a people-in-space shot once
   *  sourced; see the photo shopping list). Falls back to a collage image if absent. */
  lifestyleImage?: string;
  /** Optional full-viewport cinematic image break (mid-page "moment"), with an optional serif
   *  caption. Rendered with a slow parallax drift. */
  fullBleed?: { image: string; caption?: string };
  /** 2–3 teaser residences — reduced info only (name, size range, price from, image).
   *  `priceFrom` absent → the project publishes no prices; cards show "Price on request". */
  sampleUnits: { name: string; sizeRange: string; priceFrom?: number; image: string }[];
  location: { body: string; distances: { label: string; distance: string }[] };
  /** Region development arc — a short timeline of milestones, a neutral takeaway, and a strip of
   *  three quantified proof points. All hand-authored placeholder. */
  trajectory?: {
    intro?: string;
    milestones: { period: string; label: string }[];
    takeaway: string;
    stats: { value: string; label: string }[];
  };
  developer: { body: string; highlights: string[] };
  /** Optional operator (hospitality / management brand running the amenities). If absent, the
   *  developer trust block takes the full width gracefully. */
  operator?: { name: string; body: string; highlights: string[] };
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
  /**
   * Curated = projects the Invedi team can actually sell. Gates the Reserve flow: on curated
   * projects the primary buyer CTA becomes "Reserve" (paid two-step, manually confirmed);
   * non-curated projects keep the lighter CTAs (Speak to advisor / Get sales pack / Request
   * access). Set per-project in the SEEDS array — ~3-4 curated for the demo.
   */
  isCurated: boolean;
  /** Editorial Invedi review — hand-authored, NOT computed. Founder direction: project pages
   *  read as neutral independent assessments (Independer-style verdict) rather than vendor
   *  marketing. See `ProjectReview` for the shape. */
  review: ProjectReview;
  /** Optional editorial story-landing content (/story/[slug]). Only some projects have one. */
  story?: ProjectStory;
  trustNote: string;

  /** Placeholder narrative copy. */
  description: string;
  neighbourhood: string;

  /** Facts used across cards, filters and the project page. */
  completion: string; // display, e.g. "Q4 2026" or "Completed"
  completionYear: number | null; // null = ready now / completed
  /** True when the developer publishes no prices. priceMin/priceMax are 0; every price surface
   *  must show "Price on request" instead of amounts and price filters must not exclude the
   *  project. Use `priceRangeLabel()` instead of formatting priceMin/priceMax directly. */
  priceOnRequest?: boolean;
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
  isCurated: boolean;
  review: ProjectReview;
  story?: ProjectStory;
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
  /** No public prices — see Project.priceOnRequest. */
  priceOnRequest?: boolean;
  /** Hand-authored units (e.g. named villas with real specs). When present, `unitCount` /
   *  `basePrice` / `baseArea` are ignored and NO units are generated. */
  customUnits?: Unit[];
};

/* ------------------------------------------------------------------ */
/* Aldeia da Roca — hand-authored units (real developer specs)         */
/* ------------------------------------------------------------------ */

/**
 * Eight villas, two typologies, per the developer's spec sheet. No public prices —
 * price: 0 + the project-level `priceOnRequest` flag make every surface render
 * "Price on request". Areas are gross private area; terraces separate.
 * floor: 0 = whole-villa listing (the units table shows "—" instead of a floor).
 */
const ALDEIA_UNITS: Unit[] = [
  ...(["A1", "A2", "A3", "A4"] as const).map((n) => ({
    id: `villa-${n.toLowerCase()}`,
    projectSlug: "aldeia-da-roca",
    name: `Villa ${n}`,
    type: "T4 villa",
    floor: 0,
    area: 284, // gross private area 284.4 m²; construction area 320.2 m²
    bedrooms: 4,
    bathrooms: 4,
    price: 0, // price on request
    status: "available" as UnitStatus,
    energyLabel: "A",
    terraceArea: 73,
  })),
  ...(["B5", "B6", "B7", "B8"] as const).map((n) => ({
    id: `villa-${n.toLowerCase()}`,
    projectSlug: "aldeia-da-roca",
    name: `Villa ${n}`,
    type: "T5 villa",
    floor: 0,
    area: 302, // gross private area 301.9 m²; construction area 342.1 m²
    bedrooms: 5,
    bathrooms: 5,
    price: 0, // price on request
    status: "available" as UnitStatus,
    energyLabel: "A",
    terraceArea: 83,
  })),
];

const SEEDS: ProjectSeed[] = [
  {
    slug: "aldeia-da-roca",
    name: "Aldeia da Roca",
    developer: "Special Concepts",
    country: "PT",
    countryLabel: "Portugal",
    region: "Cascais & Sintra",
    regionId: "pt-cascais-sintra",
    city: "Azóia, Sintra",
    verified: true,
    tier: 2,
    isCurated: false,
    review: {
      score: 8.5,
      verdict: "Recommended",
      preliminary: true,
      summary:
        "Preliminary assessment — the architectural project is still in development and the developer profile is under Invedi review. What is already clear: eight villas inside the Sintra-Cascais Natural Park, one kilometre from Cabo da Roca, on protected land where new construction of this kind is nearly impossible to repeat. The location and the scarcity carry the case; pricing has not been published yet.",
      strengths: [
        "Protected natural-park setting one kilometre from Cabo da Roca — effectively unrepeatable",
        "Only eight villas, each with private pool, garden and Atlantic views",
        "Green architecture (green roofs, underfloor heating) aimed above the local standard",
      ],
      considerations: [
        "Developer track record not yet verified — profile under Invedi review",
        "Prices on request and project in development — terms may still move",
      ],
      criteria: [
        { label: "Location", score: 9.5, note: "1 km from Cabo da Roca, inside a natural park, with ocean views." },
        { label: "Price & quality", score: 8.0, note: "Spec reads premium; no public pricing yet to benchmark against." },
        { label: "Developer track record", score: 7.5, note: "Special Concepts — profile under Invedi review." },
        { label: "Exit & rental liquidity", score: 8.5, note: "Thin villa supply around Sintra-Cascais supports resale." },
        { label: "Payment plans & terms", score: 7.5, note: "Terms not yet published; project in development phase." },
        { label: "Uniqueness of project", score: 9.5, note: "Only 8 villas on protected park land at Europe's westernmost point." },
      ],
    },
    story: {
      tagline: "The last village before the Atlantic",
      statusLine: "Private release — 8 villas only",
      intro:
        "Aldeia da Roca is eight villas in the village of Azóia, inside the Sintra-Cascais Natural Park, one kilometre from Cabo da Roca — the westernmost point of mainland Europe. The land around it is protected, which means what is being built here is, in practical terms, not going to be built again.",
      whyInvedi: {
        heading: "Why Invedi selected this project",
        body: [
          "We rarely feature a project this early. Aldeia da Roca is still an architectural project in development, the developer profile is under our review, and prices are on request — all of which we say plainly. We selected it anyway, because the setting does not come around twice.",
          "Azóia sits inside the Sintra-Cascais Natural Park, a kilometre from Cabo da Roca and from Praia da Ursa, with around 300 days of sunshine a year. Because the surrounding land is protected, new construction here is nearly impossible to repeat — the eight villas being permitted is the exception, not the pattern.",
          "The project itself is deliberately small: eight villas in a gated condominium, contemporary green architecture with green roofs, each villa with its own pool, garden and Atlantic views. Access is by a centrally controlled electric gate with individual access management; the shared spaces are a communal garden, a vegetable garden and a children's play area.",
          "Two typologies make up the eight: four T4 villas of 284 m² gross private area with 73 m² of terraces, and four T5 villas of 302 m² with 83 m² of terraces, on plots from roughly 490 to 875 m². The specification reads considered rather than showy — microcement floors, lime-based natural paints, oak plank flooring in the bedrooms, Fabri kitchens with Siemens appliances, underfloor heating on both floors, and pool covers included with an optional heated-pool pack. One honest note: with the project in development, materials are subject to substitution at similar quality.",
          "Our reservations are the honest ones for a project at this stage: the track record of Special Concepts is not yet verified, and with no public pricing the value case cannot be fully tested. That is why this assessment is marked preliminary — and why the two-star rating may move as the project firms up.",
        ],
        curator: "The Invedi Team",
      },
      heroSlides: [
        { src: "/images/aldeia-da-roca/aldeia-6.jpg", alt: "Aldeia da Roca — villa with private pool among the pines" },
        { src: "/images/aldeia-da-roca/aldeia-5.jpg", alt: "Aldeia da Roca — aerial view over the villas toward the Atlantic" },
        { src: "/images/aldeia-da-roca/aldeia-2.jpg", alt: "Praia da Ursa at sunset, one kilometre from the village" },
      ],
      collage: [
        "/images/aldeia-da-roca/aldeia-6.jpg",
        "/images/aldeia-da-roca/aldeia-5.jpg",
        "/images/aldeia-da-roca/aldeia-7.jpg",
        "/images/aldeia-da-roca/aldeia-3.jpg",
        "/images/aldeia-da-roca/aldeia-4.jpg",
        "/images/aldeia-da-roca/aldeia-2.jpg",
      ],
      lifestyle: {
        heading: "Daily life at the edge of the map",
        body:
          "The days here are organised by the park and the ocean: surf at Guincho and Praia da Adraga, golf at Oitavos, Quinta da Marinha, Penha Longa and Estoril, sailing out of Cascais Marina. International schools — TASIS Portugal, Carlucci American, King's College — are nearby, and Lisbon is within reach via the A5 and A16.",
        highlights: [
          "Golf at Oitavos, Quinta da Marinha, Penha Longa and Estoril",
          "Surfing at Guincho and Praia da Adraga",
          "TASIS Portugal, Carlucci American and King's College nearby",
          "Cascais Marina a short drive away",
          "Lisbon within reach via the A5 / A16",
        ],
      },
      lifestyleImage: "/images/aldeia-da-roca/aldeia-3.jpg",
      fullBleed: {
        image: "/images/aldeia-da-roca/aldeia-2.jpg",
        caption: "Praia da Ursa, one kilometre from the door.",
      },
      sampleUnits: [
        { name: "Type A — T4 villas (A1–A4)", sizeRange: "284 m² + 73 m² terraces", image: "/images/aldeia-da-roca/aldeia-6.jpg" },
        { name: "Type B — T5 villas (B5–B8)", sizeRange: "302 m² + 83 m² terraces", image: "/images/aldeia-da-roca/aldeia-7.jpg" },
      ],
      location: {
        body:
          "Azóia is the last village before the Atlantic — inside the Sintra-Cascais Natural Park, between the Sintra hills and the ocean, with Cabo da Roca and Praia da Ursa a kilometre away. Cascais and the coast road are a short drive; Lisbon connects via the A5 and A16.",
        distances: [
          { label: "Cabo da Roca", distance: "1 km" },
          { label: "Praia da Ursa", distance: "1 km" },
          { label: "Praia da Adraga", distance: "6 km" },
          { label: "Guincho beach", distance: "8 km" },
          { label: "Cascais Marina", distance: "15 km" },
          { label: "Sintra", distance: "14 km" },
          { label: "Lisbon (A5/A16)", distance: "40 km" },
          { label: "Lisbon airport", distance: "45 min" },
        ],
      },
      developer: {
        // Honest under-review framing — no invented history. Verified facts only.
        body:
          "Special Concepts is the developer behind Aldeia da Roca. Their profile — delivery history, financial standing and references — is currently under Invedi review, and we will publish the assessment when it completes rather than repeat marketing claims in the meantime. Sales are currently run through Athena, Mercator and Porta da Frente.",
        highlights: [
          "Developer profile under Invedi review",
          "Architectural project in development phase",
          "Sales channels: Athena, Mercator, Porta da Frente",
        ],
      },
      trajectory: {
        intro: "The Sintra-Cascais coast has one defining fact: the land is protected. What that means:",
        milestones: [
          { period: "Since 1994", label: "Sintra-Cascais Natural Park protects the coastline between Sintra and Cascais." },
          { period: "2000s–2010s", label: "Cascais and Sintra establish themselves with international buyers; buildable coastal land grows scarce." },
          { period: "Today", label: "New construction inside the park is exceptional — supply is effectively capped by planning, not by demand." },
        ],
        takeaway:
          "Around Cascais and Sintra, protected land — not demand — is the binding constraint. Projects permitted inside the park are the exception, which is precisely what underpins their long-term case.",
        stats: [
          { value: "1 km", label: "To Cabo da Roca" },
          { value: "~300", label: "Days of sunshine a year" },
          { value: "Protected", label: "Natural-park land" },
        ],
      },
    },
    completion: "In development",
    completionYear: 2028, // filter bucket only ("2028+"); the display string stays "In development"
    amenities: [
      "Pool",
      "Garden",
      "Parking",
      "Communal vegetable garden",
      "Children's play area",
      "Gated access",
    ],
    shortTermLetting: false,
    pin: { x: 8, y: 60 },
    lng: -9.4772,
    lat: 38.7838,
    unitCount: 8, // ignored — customUnits below
    basePrice: 0,
    baseArea: 0,
    heroCount: 5,
    priceOnRequest: true,
    customUnits: ALDEIA_UNITS,
  },
  {
    slug: "comporta-dunes",
    name: "Comporta Dunes Residences",
    developer: "Herdade Atlântica",
    country: "PT",
    countryLabel: "Portugal",
    region: "Comporta & Melides",
    regionId: "pt-comporta",
    city: "Comporta",
    verified: true,
    tier: 3,
    isCurated: true,
    // TODO(content): placeholder editorial scores, to be replaced with real assessments.
    review: {
      score: 9.4,
      verdict: "Recommended",
      summary:
        "Comporta Dunes is one of the strongest coastal entries we currently track. Protected dune and rice-paddy land structurally caps supply here, the developer's Alentejo delivery record is clean, and the restraint of the architecture should age well. It is not cheap, but for genuinely scarce Atlantic land the case is defensible.",
      strengths: [
        "Structurally supply-constrained location — protected dune and paddy land",
        "Verified developer with an on-time Alentejo delivery record",
        "Low-density, single-storey architecture designed to weather rather than date",
      ],
      considerations: [
        "Q2 2027 delivery rewards holding, not a quick resale",
        "Entry pricing reflects the scarcity — premium, though defensible",
      ],
      criteria: [
        { label: "Location", score: 9.5, note: "Protected Comporta dune belt; a four-minute walk to an unspoilt Atlantic beach." },
        { label: "Price vs area", score: 8.5, note: "A scarcity premium, but in line with genuinely limited coastal land." },
        { label: "Developer track record", score: 9.0, note: "Herdade Atlântica: two prior Alentejo schemes delivered on time." },
        { label: "Build quality & energy", score: 9.0, note: "Passive-first design, natural materials, A-rated energy spec." },
        { label: "Liquidity & resale", score: 9.0, note: "Thin supply and durable demand support resale in a patient market." },
      ],
    },
    story: {
      tagline: "Where the pines meet the Atlantic",
      statusLine: "Limited release — launching 2027",
      intro:
        "Set between umbrella pines and the open Atlantic, Comporta Dunes is a quiet counterpoint to the Algarve's crowds. Low, sand-toned villas sit lightly on the dunes; the ocean is a four-minute walk through the trees. This is the Comporta that architects and gallerists have kept to themselves for a decade.",
      whyInvedi: {
        heading: "Why Invedi selected this project",
        body: [
          "We visit every project we choose to feature, and Comporta Dunes is one of the few that reads better in person than on paper. We walked the site at low sun with the developer's project lead, and what stood out was restraint — single-storey volumes, nothing taller than the pines, materials chosen to weather rather than date.",
          "We spoke at length with Herdade Atlântica about delivery. Their two previous Alentejo schemes completed on schedule and are holding value on resale, which is rare for the region. Planning permits are in place and the sales mandate is clean — both of which we verified directly rather than taking on trust.",
          "On the numbers, Comporta remains structurally supply-constrained: protected dune and rice-paddy land caps how much can ever be built here. We think that scarcity, more than any single amenity, is what underpins the case. The pricing is not cheap, but for genuinely limited coastal land it is defensible.",
          "Our one reservation is patience. This is a 2027 delivery in a market that rewards holding, not flipping. If you need liquidity inside three years, this is not the project. If you are buying the place, it is one of the strongest coastal entries we track.",
        ],
        curator: "The Invedi Team",
      },
      // Hero slideshow: the existing still first (matches collage[0]), then two new Comporta
      // villa renders. Crossfades every 10s via the shared HeroBackground Slideshow.
      heroSlides: [
        { src: "/images/exterior-2.jpg", alt: "Comporta Dunes — modern villa among the pines" },
        { src: "/images/story/comporta-dunes-hero2.jpg", alt: "Comporta Dunes — glass villa and pool terrace" },
        { src: "/images/story/comporta-dunes-hero3.jpg", alt: "Comporta Dunes — poolside courtyard living" },
      ],
      collage: [
        // collage[0] is also the story hero. A low-rise modern villa in a warm, dune-like natural
        // setting fits Comporta's character far better than the empty-beach shot.
        "/images/exterior-2.jpg",
        // Two new Comporta interior/exterior renders replace the earlier empty-sand shots.
        "/images/story/comporta-dunes.jpg",
        "/images/story/comporta-dunes2.jpg",
        "/images/regions/pt-algarve.jpg",
        "/images/gallery2.jpg",
        "/images/regions/pt-cascais-sintra.jpg",
      ],
      lifestyle: {
        heading: "A slower kind of coast",
        body:
          "Life here is organised around the walk to the beach and the light coming back through the pines. The shared spaces are deliberately understated — a garden that runs into the dune landscape, a spa built for after the sea rather than instead of it, a pool that sits below the treeline.",
        highlights: [
          "1,500 m² of communal pine gardens",
          "Four-minute walk to an unspoilt Atlantic beach",
          "Outdoor spa and 25 m saltwater pool",
          "On-site concierge and beach service",
          "Secure parking and EV charging",
        ],
      },
      sampleUnits: [
        { name: "Two-bedroom dune residences", sizeRange: "96–128 m²", priceFrom: 685000, image: "/images/gallery1.jpg" },
        { name: "Three-bedroom pine villas", sizeRange: "142–176 m²", priceFrom: 1150000, image: "/images/gallery2.jpg" },
        { name: "Four-bedroom Atlantic villas", sizeRange: "205–240 m²", priceFrom: 1980000, image: "/images/gallery3.jpg" },
      ],
      location: {
        body:
          "Comporta sits an hour south of Lisbon, across the Sado estuary — close enough for a weekend, far enough to feel like elsewhere. Everything day-to-day is a short drive; everything else is a walk.",
        distances: [
          { label: "Atlantic beach", distance: "400 m" },
          { label: "Comporta village", distance: "1.2 km" },
          { label: "Comporta beach club", distance: "2.5 km" },
          { label: "Melides", distance: "18 km" },
          { label: "Grândola", distance: "22 km" },
          { label: "Troia ferry", distance: "28 km" },
          { label: "Lisbon (drive)", distance: "1 h 10" },
          { label: "Lisbon airport", distance: "1 h 20" },
        ],
      },
      developer: {
        body:
          "Herdade Atlântica is an Alentejo developer with a decade of low-density coastal work behind it. Their approach is unusually patient for the sector — small releases, long build windows, and a preference for landscape architects over marketing. Two prior schemes delivered on time and are holding value on resale.",
        highlights: ["10+ years in the Alentejo", "2 coastal schemes delivered", "On-time delivery record"],
      },
      operator: {
        name: "Atlântica Living",
        body:
          "The estate is run by Atlântica Living, the developer's in-house hospitality and management arm. They handle the spa, concierge and beach service, and — for owners who want it — a managed rental programme for the weeks a residence sits empty.",
        highlights: ["Estate & rental management", "On-site concierge and spa", "8 properties under management"],
      },
      trajectory: {
        intro: "Comporta has changed slowly, and on purpose. The short version:",
        milestones: [
          { period: "2015–2019", label: "Discovered by architects, designers and a quiet creative set." },
          { period: "2020–2024", label: "Flagship hospitality and design-led estates arrive." },
          { period: "2025 onward", label: "Protected coastline; new supply released slowly, in small numbers." },
        ],
        takeaway:
          "Comporta sits early in a long, deliberately slow build-out — the scarcity here is a planning fact, not a sales line.",
        stats: [
          { value: "1h15", label: "From Lisbon" },
          { value: "Protected", label: "Natural reserve coastline" },
          { value: "12", label: "Hospitality openings since 2020" },
        ],
      },
      fullBleed: { image: "/images/landing/hero-comporta.jpg", caption: "The dunes, four minutes from the door." },
      lifestyleImage: "/images/regions/pt-comporta.jpg",
    },
    completion: "Q2 2027",
    completionYear: 2027,
    amenities: ["Pool", "Spa", "Garden", "Concierge", "Parking"],
    shortTermLetting: true,
    pin: { x: 12, y: 62 },
    lng: -8.792,
    lat: 38.3803,
    unitCount: 5,
    basePrice: 620000,
    baseArea: 90,
    heroCount: 5,
  },
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
    isCurated: true,
    // TODO(content): placeholder editorial scores, to be replaced with real assessments.
    review: {
      score: 8.4,
      verdict: "Recommended",
      summary:
        "Strong fundamentals on every measurable axis: a credible developer, an established Amsterdam location with reliable demand, and pricing that aligns with comparable new-builds. The block is best described as solid rather than exceptional — there's no edge that screams 'underpriced' but very little downside risk either.",
      strengths: [
        "Established developer with prior on-time delivery in the region",
        "Strong rental demand fundamentals in central Amsterdam",
        "EV charging, concierge and roof terrace lift the long-term resale story",
      ],
      considerations: [
        "Asking price sits at the higher end of comparable Q4 2026 deliveries",
        "Service-cost structure not yet finalised — flag with the developer",
      ],
      criteria: [
        { label: "Location", score: 9.0, note: "Central Amsterdam, walkable to the canals and well-served by tram and metro." },
        { label: "Price vs area", score: 7.5, note: "Roughly in line with the area; a small premium for the brand." },
        { label: "Developer track record", score: 8.5, note: "Three prior schemes delivered within budget and schedule." },
        { label: "Build quality & energy", score: 8.0, note: "A-rated energy label and a heat-pump spec for all units." },
        { label: "Liquidity & resale", score: 8.5, note: "Highly liquid Amsterdam segment; strong renter demand." },
      ],
    },
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
    isCurated: false,
    review: {
      score: 6.7,
      verdict: "Recommended with reservations",
      summary:
        "A respectable but unverified Rotterdam-South entry. Sales mandate documents are still pending so the project sits behind Invedi's Tier-1 disclosure and we cannot independently confirm the developer's planning permits or financial standing. Worth a closer look once Tier-2 verification clears.",
      strengths: [
        "Competitive entry pricing for the Rotterdam new-build segment",
        "Short-term letting permitted — opens up rental flexibility",
        "Co-working amenity reflects a measured-but-modern programme",
      ],
      considerations: [
        "Developer identity and sales mandate not yet verified by the Invedi team",
        "Co-working as the lead amenity reads modest for a Q2 2027 listing",
      ],
      criteria: [
        { label: "Location", score: 7.0, note: "Rotterdam-South: emerging area, infrastructure improving but not central." },
        { label: "Price vs area", score: 7.5, note: "Below the regional median — meaningful but not extraordinary." },
        { label: "Developer track record", score: 5.0, note: "Tier-1 status; no public history to verify against." },
        { label: "Build quality & energy", score: 6.5, note: "Energy spec aligned with code; nothing above." },
        { label: "Liquidity & resale", score: 7.0, note: "Rotterdam liquidity is improving but still thinner than Amsterdam." },
      ],
    },
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
    isCurated: true,
    review: {
      // Bumped 8.8 → 9.2 so the demo set spans all three tiers (this is the sole 3★ project).
      score: 9.2,
      verdict: "Recommended",
      summary:
        "Olive Grove is one of the strongest Costa-Blanca entries we currently track. The pool, gym and spa programme is genuinely premium for the price range, the developer has a clean delivery record, and Alicante's rental market remains robust year-round. Short-term letting adds optionality for a yield-focused buyer.",
      strengths: [
        "Premium amenity programme (pool, spa, gym) at a Costa Blanca entry price",
        "Short-term letting permitted — supports yield-focused buyers",
        "Verified developer with consistent delivery history",
      ],
      considerations: [
        "Delivery in Q1 2028 — a longer wait than peer projects in the area",
        "Pricing premium above the local mean is justified but not bargain-territory",
      ],
      criteria: [
        { label: "Location", score: 9.0, note: "Alicante coastline: strong year-round rental demand." },
        { label: "Price vs area", score: 8.0, note: "Mid-range for the spec — fair, not a bargain." },
        { label: "Developer track record", score: 9.0, note: "Mediterra Estates: clean, multi-cycle record." },
        { label: "Build quality & energy", score: 8.5, note: "Spec sheet exceeds local code on insulation and glazing." },
        { label: "Liquidity & resale", score: 8.5, note: "Short-term-let permission widens the buyer pool." },
      ],
    },
    story: {
      tagline: "Mornings that smell of sea and citrus",
      statusLine: "Now selling — first release",
      intro:
        "Olive Grove sits where the Costa Blanca stops being a postcard and starts being a place to live. Terraced apartments open onto shared gardens of olive and citrus; the Mediterranean is fifteen minutes down the hill. It is built for the long, slow Alicante year, not just the summer.",
      whyInvedi: {
        heading: "Why Invedi selected this project",
        body: [
          "We assessed Olive Grove against every other Costa Blanca entry we currently track, and it came out at the top of the group. We met Mediterra Estates on site and reviewed their delivery history line by line — a clean, multi-cycle record that is more the exception than the rule on this coast.",
          "The amenity programme is where the value shows. A genuine spa, a proper gym and a resort-grade pool at this entry price is unusual, and it is the kind of thing that protects resale value long after the first owners move on.",
          "Alicante's rental market holds up year-round rather than collapsing out of season, and short-term letting here is permitted — so the yield case is real, not theoretical. That combination is why this is the sole three-star project in our current set.",
          "Our one reservation is time: delivery is Q1 2028, a longer wait than some peers. For a buyer who can hold, we think the wait is worth it.",
        ],
        curator: "The Invedi Team",
      },
      collage: [
        "/images/regions/es-costa-blanca.jpg",
        "/images/gallery3.jpg",
        "/images/regions/es-costa-del-sol.jpg",
        "/images/gallery4.jpg",
        "/images/landing/hero-marbella.jpg",
        "/images/gallery5.jpg",
      ],
      lifestyle: {
        heading: "Resort living, priced for real life",
        body:
          "The shared spaces do the heavy lifting: a spa and gym for the off-season, gardens that stay green year-round, and a pool that anchors the summer. It is the amenity mix of a resort at the price of an apartment.",
        highlights: [
          "Resort-grade outdoor pool",
          "Full spa and fitness suite",
          "Landscaped olive-and-citrus gardens",
          "Secure residents' parking",
          "Short-term letting permitted",
        ],
      },
      sampleUnits: [
        { name: "One-bedroom garden apartments", sizeRange: "62–74 m²", priceFrom: 295000, image: "/images/gallery3.jpg" },
        { name: "Two-bedroom terraces", sizeRange: "88–110 m²", priceFrom: 420000, image: "/images/gallery4.jpg" },
        { name: "Three-bedroom penthouses", sizeRange: "126–150 m²", priceFrom: 680000, image: "/images/gallery5.jpg" },
      ],
      location: {
        body:
          "Set in the hills above Alicante, Olive Grove keeps the coast close and the city closer — beaches, marina and old town are all a short drive, with the airport under half an hour away.",
        distances: [
          { label: "Nearest beach", distance: "4.5 km" },
          { label: "Alicante centre", distance: "12 km" },
          { label: "Marina & port", distance: "13 km" },
          { label: "Golf course", distance: "6 km" },
          { label: "Santa Pola", distance: "18 km" },
          { label: "Alicante airport", distance: "22 km" },
        ],
      },
      developer: {
        body:
          "Mediterra Estates has built along the Costa Blanca for over two decades, with a delivery record we were able to verify across several completed schemes. Their programmes lean amenity-heavy and finish above local code — a profile that has held resale value well.",
        highlights: ["20+ years on the Costa Blanca", "Verified delivery record", "Above-code build spec"],
      },
      operator: {
        name: "Mediterra Hospitality",
        body:
          "Day-to-day, the resort amenities are run by Mediterra Hospitality, the developer's operations team. They keep the spa, pool and gardens running year-round and offer owners an optional short-let and concierge programme.",
        highlights: ["Spa & wellness operations", "Optional short-let programme", "Year-round on-site team"],
      },
      trajectory: {
        intro: "The Costa Blanca has moved from volume to quality. Where it's heading:",
        milestones: [
          { period: "2012–2018", label: "Steady international demand returns after the downturn." },
          { period: "2019–2024", label: "Branded, amenity-led new-builds raise the local benchmark." },
          { period: "2025 onward", label: "Prime coastal plots tighten; premium supply stays limited." },
        ],
        takeaway:
          "Alicante's premium segment is maturing rather than peaking — steady demand against thinning prime supply.",
        stats: [
          { value: "22 km", label: "To Alicante airport" },
          { value: "Year-round", label: "Rental demand" },
          { value: "320+", label: "Days of sun a year" },
        ],
      },
      fullBleed: { image: "/images/landing/hero-marbella.jpg", caption: "Fifteen minutes from the Mediterranean." },
      lifestyleImage: "/images/regions/es-costa-del-sol.jpg",
    },
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
    isCurated: false,
    review: {
      score: 5.9,
      verdict: "Not recommended",
      summary:
        "Although technically a new-build inventory listing, Marina Vista is already complete and the remaining units have been on the market for a while. Documentation is incomplete (Tier 1) and pricing has not been adjusted downward despite the lengthening time-on-market. We're more cautious than not.",
      strengths: [
        "Completed building — buyers can inspect and move quickly",
        "Pool and garden amenities are present and finished",
        "Short-term-letting permitted in the building",
      ],
      considerations: [
        "Project has been on the market for an extended period without price adjustments",
        "Tier 1: developer and listing documents not yet verified by Invedi",
      ],
      criteria: [
        { label: "Location", score: 7.0, note: "Costa del Sol: established but pricing competition is intense." },
        { label: "Price vs area", score: 5.5, note: "Asking price out of line with the current absorption rate." },
        { label: "Developer track record", score: 4.5, note: "Limited track record; no public delivery history." },
        { label: "Build quality & energy", score: 6.5, note: "Build is finished; energy spec is to-code, not above." },
        { label: "Liquidity & resale", score: 6.0, note: "Slower absorption than other Costa-del-Sol new-builds." },
      ],
    },
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
    isCurated: true,
    review: {
      score: 8.1,
      verdict: "Recommended",
      summary:
        "Solid Porto entry with a verified developer and an appealing river-valley location. The amenity mix is appropriate (concierge, gym, roof terrace, EV charging) rather than show-off, and pricing sits cleanly with peer projects. A strong default choice for a Porto-area buyer.",
      strengths: [
        "Verified Tier-3 developer with three previous Porto schemes delivered",
        "Douro Valley location offers premium views and walkable access to the city",
        "Roof terrace and concierge tier expected of the price band",
      ],
      considerations: [
        "Short-term letting NOT permitted — limits investor appeal",
        "No spa or pool — depending on buyer profile, this may matter",
      ],
      criteria: [
        { label: "Location", score: 8.5, note: "Porto with river-valley views; well-connected centrally." },
        { label: "Price vs area", score: 8.0, note: "On-mark with comparable Porto new-builds." },
        { label: "Developer track record", score: 9.0, note: "Three previous Porto schemes, all on-time delivery." },
        { label: "Build quality & energy", score: 8.0, note: "Energy label A throughout; reasonable insulation spec." },
        { label: "Liquidity & resale", score: 7.0, note: "No short-term-let permit narrows the resale audience." },
      ],
    },
    story: {
      tagline: "The river, the light, and the city just above",
      statusLine: "Final phase — delivering 2027",
      intro:
        "Douro Terraces steps down the valley toward the river, every apartment turned to the water and the evening light. Porto's old centre is a walk up the hill; the Douro is a glass of wine away. It is a project about a view, and about a city that has quietly become one of Europe's best places to own.",
      whyInvedi: {
        heading: "Why Invedi selected this project",
        body: [
          "We chose Douro Terraces as our default recommendation for a Porto-area buyer, and the site visit confirmed it. Atlantic Homes walked us through the build with the confidence of a developer that has delivered three Porto schemes on time — a track record we verified independently.",
          "The location does most of the work. River-valley views this close to the centre are genuinely scarce, and the walkable access to the old town means the flat works as a home, a rental, or both.",
          "The amenity mix — concierge, gym, roof terrace, EV charging — is appropriate rather than show-off, which we prefer. It reads as a project that spent its budget on the building, not the brochure.",
          "Our reservation is investor-specific: short-term letting is not permitted here, which narrows the resale audience. For an owner-occupier or a long-let landlord, that is a non-issue.",
        ],
        curator: "The Invedi Team",
      },
      collage: [
        "/images/regions/pt-porto-douro.jpg",
        "/images/gallery2.jpg",
        "/images/regions/pt-lisbon.jpg",
        "/images/gallery1.jpg",
        "/images/landing/hero-lisbon.jpg",
        "/images/gallery4.jpg",
      ],
      lifestyle: {
        heading: "A city built for walking, and staying in",
        body:
          "The building is organised around the view and the roof: a terrace for the long Porto evenings, a concierge for the practical side of ownership, and a gym for the days you don't feel like the hills. Everything else is a walk away.",
        highlights: [
          "Rooftop terrace over the Douro valley",
          "Resident concierge",
          "Fitness suite",
          "EV charging and secure parking",
          "Energy label A throughout",
        ],
      },
      sampleUnits: [
        { name: "One-bedroom river apartments", sizeRange: "58–72 m²", priceFrom: 310000, image: "/images/gallery2.jpg" },
        { name: "Two-bedroom terraces", sizeRange: "84–104 m²", priceFrom: 465000, image: "/images/gallery1.jpg" },
        { name: "Three-bedroom duplexes", sizeRange: "128–150 m²", priceFrom: 720000, image: "/images/gallery4.jpg" },
      ],
      location: {
        body:
          "Douro Terraces sits on the valley side just below the historic centre — the river at the foot of the hill, the old town at the top, and everything in between within a short walk.",
        distances: [
          { label: "Douro riverside", distance: "600 m" },
          { label: "Metro", distance: "700 m" },
          { label: "Historic centre", distance: "1.4 km" },
          { label: "São Bento station", distance: "1.8 km" },
          { label: "Ribeira", distance: "2 km" },
          { label: "Foz beaches", distance: "6 km" },
          { label: "Porto airport", distance: "13 km" },
        ],
      },
      developer: {
        body:
          "Atlantic Homes Lda. is a Porto developer with three completed schemes in the metro area, all delivered on schedule. Their work is characterised by restrained, view-led design and an energy spec that runs at label A across the board.",
        highlights: ["3 Porto schemes delivered", "On-time delivery record", "Energy label A throughout"],
      },
      // No operator here — Douro is owner-occupier led (short-term letting isn't permitted), so
      // the developer trust block below takes the full width. Demonstrates the graceful fallback.
      trajectory: {
        intro: "Porto's decade of regeneration, in three chapters:",
        milestones: [
          { period: "2013–2018", label: "Porto emerges as a design and food destination; regeneration begins." },
          { period: "2019–2024", label: "Riverfront renewal and new-build quality accelerate." },
          { period: "2025 onward", label: "Central river-view plots are scarce; delivery pipelines lengthen." },
        ],
        takeaway:
          "Porto's centre has re-rated over a decade; river-view supply is now the binding constraint.",
        stats: [
          { value: "13 km", label: "To Porto airport" },
          { value: "UNESCO", label: "World Heritage centre" },
          { value: "600 m", label: "To the Douro riverside" },
        ],
      },
      fullBleed: { image: "/images/regions/pt-porto-douro.jpg", caption: "The river at the foot of the hill." },
      lifestyleImage: "/images/gallery1.jpg",
    },
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
    isCurated: false,
    review: {
      score: 7.6,
      verdict: "Recommended",
      summary:
        "A solid Île-de-France development in a non-curated market for Invedi. The developer is verified at Tier 2 and the programme reflects mature Parisian expectations — concierge, parking, co-working, EV charging. Pricing is at the upper end of the segment but justifiable given the location.",
      strengths: [
        "Verified Tier-2 developer with multi-cycle Paris delivery record",
        "Concierge + co-working programme aligns with the urban professional buyer",
        "EV charging and storage allocations are sensibly spec'd",
      ],
      considerations: [
        "Pricing at the upper end of comparable Île-de-France new-builds",
        "France is not yet an Invedi focus market — fewer reference points",
      ],
      criteria: [
        { label: "Location", score: 8.5, note: "Île-de-France: strong fundamentals, slow growth." },
        { label: "Price vs area", score: 7.0, note: "Above the segment median by 5–8% on €/m²." },
        { label: "Developer track record", score: 8.0, note: "Hexagone Promotion: clean public record." },
        { label: "Build quality & energy", score: 8.0, note: "A-rated, to French RE-2020 spec." },
        { label: "Liquidity & resale", score: 7.5, note: "Liquid Paris market; long absorption window." },
      ],
    },
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
    isCurated: false,
    review: {
      score: 6.8,
      verdict: "Recommended with reservations",
      summary:
        "Berlin loft conversion at an attractive sticker price, but the developer is unverified at Tier 1 and the project's planning approvals are still being publicly confirmed. The amenity programme is functional rather than premium. Worth revisiting once Tier-2 status clears.",
      strengths: [
        "Competitive Berlin entry price for the loft segment",
        "Co-working and gym programmes reflect Berlin's renter profile",
        "EV charging and parking lift the long-term spec",
      ],
      considerations: [
        "Developer identity and sales mandate not yet verified",
        "Loft conversion rather than ground-up build — finishing quality varies",
      ],
      criteria: [
        { label: "Location", score: 7.5, note: "Mitte-adjacent: strong renter profile, modest premium." },
        { label: "Price vs area", score: 7.5, note: "Below Berlin median for the loft segment." },
        { label: "Developer track record", score: 5.0, note: "Tier-1; no public delivery history to verify." },
        { label: "Build quality & energy", score: 6.5, note: "Conversion-build; insulation upgrades partial." },
        { label: "Liquidity & resale", score: 7.5, note: "Berlin loft segment is liquid; resale window short." },
      ],
    },
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
    isCurated: true,
    review: {
      score: 8.5,
      verdict: "Recommended",
      summary:
        "Strong Athens entry from a verified Tier-3 developer. The pool-and-spa amenity profile is genuinely premium for the price range and the short-term-letting permission adds investor optionality. Athens fundamentals are improving and inventory at this price-and-spec tier remains thin.",
      strengths: [
        "Verified Tier-3 developer with clean Athens delivery record",
        "Pool, spa, roof terrace + garden mix is premium for the price band",
        "Short-term letting permitted — supports income-focused buyers",
      ],
      considerations: [
        "Greek property tax framework is changing — stay informed pre-closing",
        "Athens liquidity is rising but still thinner than NL/PT comparables",
      ],
      criteria: [
        { label: "Location", score: 8.5, note: "Attica coast: strong tourism flow, walkable to the centre." },
        { label: "Price vs area", score: 8.5, note: "Below regional median for the spec." },
        { label: "Developer track record", score: 8.5, note: "Multiple successful Attica schemes." },
        { label: "Build quality & energy", score: 8.0, note: "A-rated, with insulation above local code." },
        { label: "Liquidity & resale", score: 8.5, note: "Short-term-let permission expands the buyer pool." },
      ],
    },
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
  const units =
    seed.customUnits ??
    makeUnits(seed.slug, seed.country, seed.unitCount, seed.basePrice, seed.baseArea);
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
    isCurated: seed.isCurated,
    review: seed.review,
    story: seed.story,
    trustNote: seed.verified
      ? "Placeholder trust note. Verified projects pass Invedi's listing checks (developer identity, planning permits, sales mandate). Exact criteria are TBD."
      : "Placeholder note. This project is not yet verified — developer consent and document checks are pending.",
    description: PLACEHOLDER_DESCRIPTION,
    neighbourhood: PLACEHOLDER_NEIGHBOURHOOD,
    completion: seed.completion,
    completionYear: seed.completionYear,
    priceOnRequest: seed.priceOnRequest,
    priceMin: seed.priceOnRequest ? 0 : Math.min(...prices),
    priceMax: seed.priceOnRequest ? 0 : Math.max(...prices),
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

/* ------------------------------------------------------------------ */
/* Past / completed projects — historical market context                */
/* ------------------------------------------------------------------ */

export interface HistoricalProject {
  id: string;
  name: string;
  developer: string;
  country: CountryCode;
  region: string;
  completedYear: number;
  units: number;
  /** Asking price range at time of sale, EUR. Optional — some records are price-unknown. */
  priceRangeAtSale?: [number, number];
}

// TODO(data): placeholder historical projects. Mock completed developments per country, shown in
// the "Past projects in the region" table. Counts vary on purpose — Spain has several, France one,
// and Germany/Greece none — so the table's flexible layout + empty state are both exercised.
export const historicalProjects: HistoricalProject[] = [
  // Spain
  { id: "es-hist-1", name: "Alba Marina", developer: "Mediterra Estates", country: "ES", region: "Costa Blanca", completedYear: 2023, units: 48, priceRangeAtSale: [285000, 540000] },
  { id: "es-hist-2", name: "Sierra Blanca Villas", developer: "Costa Living S.L.", country: "ES", region: "Costa del Sol", completedYear: 2022, units: 22, priceRangeAtSale: [640000, 1250000] },
  { id: "es-hist-3", name: "Puerto Azul", developer: "Levante Homes", country: "ES", region: "Costa Blanca", completedYear: 2021, units: 60, priceRangeAtSale: [230000, 415000] },
  { id: "es-hist-4", name: "Jardines del Mar", developer: "Mediterra Estates", country: "ES", region: "Costa Blanca", completedYear: 2020, units: 34 },
  { id: "es-hist-5", name: "Mirador Alicante", developer: "Levante Homes", country: "ES", region: "Alicante", completedYear: 2019, units: 41, priceRangeAtSale: [210000, 380000] },
  // Portugal
  { id: "pt-hist-1", name: "Douro Riverside I", developer: "Northstar Developments", country: "PT", region: "Porto & Douro", completedYear: 2022, units: 30, priceRangeAtSale: [320000, 690000] },
  { id: "pt-hist-2", name: "Foz Atlântico", developer: "Atlantic Living", country: "PT", region: "Porto & Douro", completedYear: 2021, units: 26, priceRangeAtSale: [410000, 880000] },
  { id: "pt-hist-3", name: "Ribeira Lofts", developer: "Atlantic Living", country: "PT", region: "Porto & Douro", completedYear: 2019, units: 18 },
  // Netherlands
  { id: "nl-hist-1", name: "Havenkwartier Fase 1", developer: "Northstar Developments", country: "NL", region: "Randstad", completedYear: 2022, units: 72, priceRangeAtSale: [345000, 610000] },
  { id: "nl-hist-2", name: "Kanaaloevers", developer: "Atlas Build Group", country: "NL", region: "Randstad", completedYear: 2020, units: 54, priceRangeAtSale: [298000, 520000] },
  // France — deliberately a single row (few-comparables layout check)
  { id: "fr-hist-1", name: "Les Terrasses du Parc", developer: "Hexagone Promotion", country: "FR", region: "Île-de-France", completedYear: 2021, units: 38, priceRangeAtSale: [360000, 720000] },
  // Germany / Greece: none → empty state
];

/** Past/completed projects for the current project's region (country-scoped). An empty result
 *  is valid — the table renders a clean "no completed projects" state. */
export function pastProjectsFor(p: Project): HistoricalProject[] {
  return historicalProjects.filter((h) => h.country === p.country);
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
  // Price-on-request projects have no meaningful midpoint — they stay out of the histogram.
  for (const p of projects.filter((x) => !x.priceOnRequest)) {
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

/** The ONE way to render a project's price range — returns "Price on request" for projects
 *  that publish no prices, the formatted range otherwise. */
export function priceRangeLabel(p: Project): string {
  return p.priceOnRequest ? "Price on request" : formatPriceRangeFull(p.priceMin, p.priceMax);
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
