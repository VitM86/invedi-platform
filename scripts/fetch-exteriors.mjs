/**
 * fetch-exteriors.mjs — one-off prototype helper to grab EXTERIOR / architectural building shots
 * for the project image pool (so every project leads with an exterior, not an interior).
 *
 * Unsplash keyless endpoints are dead (503) / need an API key, so this uses the Wikimedia Commons
 * keyless API (same source used for region + hero images): search → imageinfo → ~2000px JPEG thumb.
 *
 * NOTE: prototype-only images. Replace with owned/licensed renders before production.
 */

import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const OUT = new URL("../public/images/", import.meta.url);
const UA = "InvediPrototype/1.0 (contact: v.malushko@gmail.com)";

const CANDIDATES = [
  { file: "exterior-1", terms: ["modern apartment building facade", "contemporary apartment building"] },
  { file: "exterior-2", terms: ["modern apartment building Amsterdam", "Amsterdam new residential building"] },
  { file: "exterior-3", terms: ["modern apartment building Rotterdam", "Rotterdam residential tower"] },
  { file: "exterior-4", terms: ["modern villa exterior architecture", "contemporary villa facade"] },
  { file: "exterior-5", terms: ["modern apartment building Lisbon", "Lisbon modern architecture building"] },
  { file: "exterior-6", terms: ["modern apartment building wood facade", "contemporary timber residential building"] },
  { file: "exterior-7", terms: ["modern apartment building Madrid", "modern residential building Spain"] },
  { file: "exterior-8", terms: ["modern apartment building Berlin", "Berlin modern residential building"] },
];

async function commonsThumb(term) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    `&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=10` +
    "&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=2000";
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`api ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages ?? {});
  const best = pages
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .filter((ii) => ii.mime === "image/jpeg" && ii.width >= 1400 && ii.width > ii.height)
    .sort((a, b) => b.width - a.width)[0];
  return best?.thumburl ?? null;
}

async function download(url, destBase) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`dl ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 30_000) throw new Error(`too small (${buf.length}b)`);
  await writeFile(new URL(`${destBase}.jpg`, OUT), buf);
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
        console.log(`MISS  ${c.file} "${term}"`);
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
  if (!done) console.log(`EMPTY ${c.file}`);
}
console.log("done.");
