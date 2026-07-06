/**
 * images.ts — render image helper for the hi-fi wireframes.
 *
 * Every project leads with an EXTERIOR / architectural shot (hero on the project page, thumbnail
 * on cards), followed by interior renders in the carousel. Interiors reuse the gallery assets
 * already in the repo; exteriors are a small dedicated pool. Each project gets a deterministic
 * exterior + a rotating interior subset so cards/carousels look distinct but stable across
 * server/client renders.
 *
 * NOTE: prototype-only Wikimedia Commons (CC) exterior images. Replace with owned/licensed
 * renders before production.
 *
 * TODO(open-question): "exterior first" is enforced HERE by always putting a deterministic
 * exterior at index 0. With real data + admin image tooling this should instead be driven by an
 * image-type tag (exterior / interior) on each image plus manual ordering, not this helper.
 */

/** Interior renders (existing repo assets). */
export const GALLERY_IMAGES = [
  "/images/gallery1.jpg",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpg",
];

/** Exterior / architectural shots — always shown first.
 *  Pool of 9 LANDSCAPE building photos (8 projects assigned via `extHash`). Two portrait-framed
 *  originals were dropped so every card slot (4:3 landscape) shows a building in its intended
 *  framing instead of a vertical center-crop. */
export const EXTERIOR_IMAGES = [
  "/images/buildings/building-01.jpg",
  "/images/buildings/building-02.jpg",
  "/images/buildings/building-03.jpg",
  "/images/buildings/building-04.jpg",
  "/images/buildings/building-05.jpg",
  "/images/buildings/building-06.jpg",
  "/images/buildings/building-07.jpg",
  "/images/buildings/building-08.jpeg",
  "/images/buildings/building-09.jpeg",
];

/** Per-project real image sets. Projects listed here bypass the generic exterior/interior
 *  pools entirely — cards and carousels show the project's own (licensed) shots, exterior
 *  first. Everything else keeps the deterministic placeholder behaviour below. */
const PROJECT_IMAGE_OVERRIDES: Record<string, string[]> = {
  "aldeia-da-roca": [
    "/images/aldeia-da-roca/aldeia-6.jpg", // villa exterior with pool — lead shot
    "/images/aldeia-da-roca/aldeia-5.jpg", // aerial over the villas toward the Atlantic
    "/images/aldeia-da-roca/aldeia-7.jpg", // interior — kitchen and stair screen
    "/images/aldeia-da-roca/aldeia-2.jpg", // Praia da Ursa at sunset
    "/images/aldeia-da-roca/aldeia-3.jpg", // Sintra forest
  ],
};

/** Stable hash from a string so image selection is deterministic. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000;
  return h;
}

/** Second hash (different prime) for the exterior pick — spreads the 8 projects evenly across
 * the 9 exteriors instead of clustering, and decorrelates it from the interior rotation. */
function extHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 53 + str.charCodeAt(i)) % 100000;
  return h;
}

/** The deterministic exterior for a project (index 0 of its images + its card thumbnail). */
export function projectExterior(seed: string): string {
  return PROJECT_IMAGE_OVERRIDES[seed]?.[0] ?? EXTERIOR_IMAGES[extHash(seed) % EXTERIOR_IMAGES.length];
}

/** `count` image paths for a project: exterior first, then a rotated run of interiors. */
export function projectImages(seed: string, count = 5): string[] {
  const override = PROJECT_IMAGE_OVERRIDES[seed];
  if (override) return override.slice(0, Math.max(1, count));
  const exterior = projectExterior(seed);
  const start = hash(seed) % GALLERY_IMAGES.length;
  const interiors = Array.from({ length: Math.max(0, count - 1) }, (_, i) =>
    GALLERY_IMAGES[(start + i) % GALLERY_IMAGES.length],
  );
  return [exterior, ...interiors];
}

/** Single deterministic image for compact thumbnails — the project's exterior. */
export function projectThumb(seed: string): string {
  return projectExterior(seed);
}
