/**
 * regions.ts — data for the terrain bird-view map (/comporta and future regions).
 *
 * This is the white-label seam: ONE Region object fully describes a map experience —
 * camera framing, the developments to pin, points of interest, and edge "gateways"
 * (nearby towns / the airport city). Add another Region and you get another map, no code
 * changes. Coordinates are real [lng, lat] for the Comporta area, Setúbal, Portugal.
 *
 * DEMO DATA: project names/figures mirror the reference mock the client supplied. Treat as
 * placeholder until real developer data is wired in — same posture as lib/mock-data.ts.
 */

export interface RegionProject {
  id: string;
  name: string;
  lng: number;
  lat: number;
  units: number;
  /** Units not yet sold (reserved counts as available — same convention as availabilityOf). */
  available: number;
  completion: number; // delivery year
  priceFrom: number; // EUR
  priceTo: number; // EUR
  driveMin: number; // minutes from the region centre — feeds the drive-time filter
  /** Warm tonal pair for the card's render-placeholder (no real photography at this stage). */
  swatch: [string, string];
}

export type PoiKind = "beach" | "village" | "town";

export interface RegionPoi {
  id: string;
  name: string;
  lng: number;
  lat: number;
  kind: PoiKind;
  driveMin: number;
}

export interface RegionGateway {
  id: string;
  name: string;
  travel: string; // display, e.g. "1h15m" or "20 min"
  /** Which screen edge the chip pins to, and which way its arrow points. */
  edge: "top" | "right" | "left" | "bottom";
  position: number; // 0–1 along that edge (left→right for top/bottom, top→bottom for sides)
}

export interface Region {
  slug: string;
  name: string;
  country: string;
  /** Opening bird-view framing of the Mapbox camera. */
  camera: { center: [number, number]; zoom: number; pitch: number; bearing: number };
  projects: RegionProject[];
  pois: RegionPoi[];
  gateways: RegionGateway[];
  /** Where the locator dot sits on the country minimap, as 0–1 of the SVG viewBox. */
  locator: { x: number; y: number };
  /** Hide the (Portugal-shaped) minimap — set for synthetic regions outside Portugal. */
  hideMinimap?: boolean;
}

export const DRIVE_TIME_BANDS = [
  { id: 5, label: "5 min" },
  { id: 10, label: "10 min" },
  { id: 20, label: "20 min" },
  { id: 999, label: "1h+" },
] as const;

export const comporta: Region = {
  slug: "comporta",
  name: "Comporta",
  country: "Portugal",
  camera: {
    center: [-8.782, 38.372],
    zoom: 12.3,
    pitch: 66,
    bearing: 16,
  },
  projects: [
    {
      id: "pestana-nature",
      name: "Pestana Comporta Nature Residences",
      lng: -8.8045,
      lat: 38.3985,
      units: 74,
      available: 50,
      completion: 2027,
      priceFrom: 1_200_000,
      priceTo: 1_800_000,
      driveMin: 10,
      swatch: ["#8a6a4a", "#cdb38c"],
    },
    {
      id: "spatia-villas",
      name: "Spatia Comporta Villas",
      lng: -8.7585,
      lat: 38.3805,
      units: 28,
      available: 21,
      completion: 2027,
      priceFrom: 1_600_000,
      priceTo: 3_200_000,
      driveMin: 5,
      swatch: ["#6b7d63", "#aebfa0"],
    },
    {
      id: "comporta-dunes",
      name: "Comporta Dunes Residences",
      lng: -8.7855,
      lat: 38.3515,
      units: 41,
      available: 33,
      completion: 2028,
      priceFrom: 950_000,
      priceTo: 2_200_000,
      driveMin: 10,
      swatch: ["#9a8059", "#d8c7a3"],
    },
  ],
  pois: [
    { id: "carvalhal-beach", name: "Carvalhal Beach", lng: -8.7917, lat: 38.3206, kind: "beach", driveMin: 5 },
    { id: "pego-beach", name: "Pego Beach", lng: -8.7889, lat: 38.3458, kind: "beach", driveMin: 7 },
    { id: "comporta-beach", name: "Comporta Beach", lng: -8.7969, lat: 38.3869, kind: "beach", driveMin: 10 },
    { id: "comporta-village", name: "Comporta Village", lng: -8.7906, lat: 38.3772, kind: "village", driveMin: 5 },
    { id: "melides", name: "Melides", lng: -8.7383, lat: 38.1289, kind: "town", driveMin: 10 },
  ],
  gateways: [
    { id: "lisbon", name: "Lisbon", travel: "1h15m", edge: "top", position: 0.5 },
    { id: "grandola", name: "Grândola", travel: "20 min", edge: "right", position: 0.18 },
  ],
  locator: { x: 0.34, y: 0.62 },
};

export const regions: Record<string, Region> = {
  comporta,
};

/**
 * Build a Region for the "Expand → bird-view" of a marketplace project that has no bespoke
 * region data (i.e. all of them except the Comporta demo). Centres the tilted satellite
 * camera on the project, pins the project + its neighbours, and maps reference points to POIs.
 * Graceful — never throws; missing pieces just render empty. Minimap hidden (it's PT-shaped).
 */
import type { Project, ReferencePoint } from "./mock-data";
import { availabilityOf } from "./mock-data";

const SWATCH: [string, string] = ["#8a6a4a", "#cdb38c"];

export function buildRegionForProject(
  project: Project,
  neighbours: Project[],
  refs: ReferencePoint[],
): Region {
  const toRegionProject = (p: Project, driveMin: number): RegionProject => ({
    id: p.slug,
    name: p.name,
    lng: p.lng,
    lat: p.lat,
    units: p.totalUnits,
    available: availabilityOf(p).available,
    completion: p.completionYear ?? 2026,
    priceFrom: p.priceMin,
    priceTo: p.priceMax,
    driveMin,
    swatch: SWATCH,
  });

  const poiKind: Record<ReferencePoint["kind"], PoiKind> = {
    city: "town",
    airport: "town",
    beach: "beach",
  };

  return {
    slug: project.slug,
    name: project.name,
    country: project.countryLabel,
    camera: { center: [project.lng, project.lat], zoom: 12.6, pitch: 62, bearing: 18 },
    projects: [toRegionProject(project, 0), ...neighbours.map((n) => toRegionProject(n, 8))],
    pois: refs.map((r) => ({
      id: r.id,
      name: r.label,
      lng: r.lng,
      lat: r.lat,
      kind: poiKind[r.kind],
      driveMin: parseInt(r.travel, 10) || 10,
    })),
    gateways: [],
    locator: { x: 0.5, y: 0.5 },
    hideMinimap: true,
  };
}

/**
 * Region-scoped re-exports of the canonical EUR formatter from mock-data. Kept under the
 * legacy "M" names so existing terrain-map callsites compile unchanged. Founder convention:
 * NO abbreviations anywhere — these no longer return `€3.4M`/`€405K` but the full amount.
 */
import { formatPriceFull, formatPriceRangeFull } from "./mock-data";

/** @deprecated alias for {@link formatPriceFull}. New code should import directly. */
export function formatPriceM(eur: number): string {
  return formatPriceFull(eur);
}

/** @deprecated alias for {@link formatPriceRangeFull}. New code should import directly. */
export function formatPriceRangeM(from: number, to: number): string {
  // 0/0 = price-on-request project (see Project.priceOnRequest) — no numbers to show.
  return from === 0 && to === 0 ? "Price on request" : formatPriceRangeFull(from, to);
}
