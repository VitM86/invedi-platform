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
 *  Pool of 11 building photos (8 projects assigned randomly via `extHash`). With more images
 *  than projects, adjacency duplicates in the grid are less likely than with the old 5-pool. */
export const EXTERIOR_IMAGES = [
  "/images/buildings/building-01.jpg",
  "/images/buildings/building-02.jpg",
  "/images/buildings/building-03.jpg",
  "/images/buildings/building-04.jpg",
  "/images/buildings/building-05.jpg",
  "/images/buildings/building-06.jpg",
  "/images/buildings/building-07.jpg",
  "/images/buildings/building-08.jpg",
  "/images/buildings/building-09.jpg",
  "/images/buildings/building-10.jpeg",
  "/images/buildings/building-11.jpeg",
];

/** Stable hash from a string so image selection is deterministic. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000;
  return h;
}

/** Second hash (different prime) for the exterior pick — spreads the 8 projects evenly across
 * the 5 exteriors instead of clustering, and decorrelates it from the interior rotation. */
function extHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 53 + str.charCodeAt(i)) % 100000;
  return h;
}

/** The deterministic exterior for a project (index 0 of its images + its card thumbnail). */
export function projectExterior(seed: string): string {
  return EXTERIOR_IMAGES[extHash(seed) % EXTERIOR_IMAGES.length];
}

/** `count` image paths for a project: exterior first, then a rotated run of interiors. */
export function projectImages(seed: string, count = 5): string[] {
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
