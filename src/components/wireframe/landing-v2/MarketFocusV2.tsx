/**
 * MarketFocusV2 — editorial market-focus section for /v2.
 *
 * Same two-country structure (Portugal + Spain live, others coming soon) and same RegionImage
 * primitive as v1. Visual shift: serif title, generous spacing, and one small muted
 * "travel-feel" line per card listing reference cities/regions in the brief's style
 * (e.g. "Lisbon · Comporta · Algarve"). Falls back to data-derived regions if mapping is missing.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { countriesWithRegions, countryProjectCount, type CountryCode } from "@/lib/mock-data";
import { RegionImage } from "../explore/RegionImage";
import { SectionIntroV2 } from "./SectionIntroV2";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

const LIVE: CountryCode[] = ["PT", "ES"];
/** Default coming-soon set for /v2. /v3 passes its own final set via the `comingSoon` prop
 *  so this shared component can change on /v3 without touching /v2. */
const COMING_SOON = ["Netherlands", "France", "Germany", "Greece"];

/** Editorial "travel-feel" subline per country. Order = south → north / coast → city. */
const DISTANCE_HINT: Partial<Record<CountryCode, string>> = {
  PT: "Lisbon · Comporta · Algarve",
  ES: "Barcelona · Costa Blanca · Costa del Sol",
};

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function MarketFocusV2({ comingSoon = COMING_SOON }: { comingSoon?: string[] } = {}) {
  const live = countriesWithRegions.filter((c) => LIVE.includes(c.code));

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-36">
        <SectionIntroV2
          overline="Market focus"
          title="Now live in Portugal and Spain"
          lead="We’re starting where the new-build market is most active for international buyers — with more European markets to follow."
          action={
            <Link
              href="/explore"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[#d8d2c4] px-5 text-[13px] font-medium uppercase tracking-[0.16em] text-text transition hover:bg-[#f5f2ec]"
            >
              Explore all regions <Arrow className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2">
          {live.map((c) => {
            const count = countryProjectCount(c.code);
            const hint =
              DISTANCE_HINT[c.code] ??
              c.regions.slice(0, 3).map((r) => r.name).join(" · ");
            return (
              <Link
                key={c.code}
                href="/explore"
                className="group relative h-[420px] overflow-hidden rounded-2xl border border-[#e6dfd2]"
              >
                <RegionImage
                  src={c.image}
                  label={c.label}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-8">
                  <div>
                    <h3 className="text-[34px] font-light leading-none tracking-tight text-white drop-shadow" style={SERIF}>
                      {c.label}
                    </h3>
                    {hint && (
                      <p className="mt-2 text-[13px] font-light tracking-wide text-white/80 drop-shadow">
                        {hint}
                      </p>
                    )}
                    <p className="mt-2 text-[13px] font-medium text-white/85 drop-shadow">
                      {count} project{count === 1 ? "" : "s"} · {c.regions.length} regions
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-text shadow-sm">
                    Explore <Arrow className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
            Coming soon
          </span>
          <span className="text-text-muted/40">/</span>
          {comingSoon.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[#e6dfd2] px-3 py-1 text-[13px] font-light text-text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
