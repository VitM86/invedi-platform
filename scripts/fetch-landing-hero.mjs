/**
 * fetch-landing-hero.mjs — one-off prototype helper to grab hero candidate photos.
 *
 * Strategy:
 *   1. Try Unsplash source endpoints (keyless). These are frequently dead (503) — best effort.
 *   2. Fall back to Wikimedia Commons keyless API (the same reliable source used for region
 *      images): search → imageinfo → download a ~2400px-wide JPEG thumb.
 *
 * NOTE: prototype-only images. Replace with owned/licensed before production.
 */

import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const OUT = new URL("../public/images/landing/", import.meta.url);
const UA = "InvediPrototype/1.0 (contact: v.malushko@gmail.com)";

// Candidate hero subjects — premium coastal / city / architectural, Portugal & Spain focus.
const CANDIDATES = [
  { file: "hero-comporta", terms: ["Comporta Portugal beach", "Comporta Alentejo"] },
  { file: "hero-algarve", terms: ["Algarve coast Portugal", "Lagos Algarve"] },
  { file: "hero-lisbon", terms: ["Lisbon architecture modern building", "Lisbon waterfront"] },
  { file: "hero-marbella", terms: ["Marbella Spain seafront", "Costa del Sol Marbella"] },
  { file: "hero-balearic", terms: ["Ibiza modern villa", "Mallorca coast"] },
];

async function commonsThumb(term) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    `&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=8` +
    "&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=2400";
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`api ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages ?? {});
  // Prefer wide landscape JPEGs, decent resolution.
  const best = pages
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .filter((ii) => ii.mime === "image/jpeg" && ii.width >= 1600 && ii.width > ii.height)
    .sort((a, b) => b.width - a.width)[0];
  return best?.thumburl ?? null;
}

async function download(url, destBase) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`dl ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 30_000) throw new Error(`too small (${buf.length}b)`);
  const dest = new URL(`${destBase}.jpg`, OUT);
  await writeFile(dest, buf);
  return buf.length;
}

for (const c of CANDIDATES) {
  if (existsSync(new URL(`${c.file}.jpg`, OUT))) {
    console.log(`SKIP  ${c.file} (exists)`);
    continue;
  }
  let done = false;
  for (const term of c.terms) {
    try {
      const thumb = await commonsThumb(term);
      if (!thumb) {
        console.log(`MISS  ${c.file} "${term}" — no match`);
        continue;
      }
      const bytes = await download(thumb, c.file);
      console.log(`OK    ${c.file} ← "${term}" (${Math.round(bytes / 1024)}KB)`);
      done = true;
      break;
    } catch (e) {
      console.log(`FAIL  ${c.file} "${term}" — ${e.message}`);
    }
  }
  if (!done) console.log(`EMPTY ${c.file} — all terms failed`);
}

console.log("done.");
