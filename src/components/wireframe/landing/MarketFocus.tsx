/**
 * MarketFocus — a visual nod to the initial focus markets. Two large country cards (Portugal,
 * Spain) reusing the Explore region-card visual language (RegionImage + gradient + label),
 * plus a "coming soon" row for the other markets. Cards link to Explore.
 *
 * TODO(open-question): cards currently link to /explore (not yet filtered to the country). Wire
 * a country pre-filter once Explore accepts it via query param.
 */

import Link from "next/link";
import { countriesWithRegions, countryProjectCount, type CountryCode } from "@/lib/mock-data";
import { RegionImage } from "../explore/RegionImage";
import { SectionIntro } from "./SectionIntro";

const LIVE: CountryCode[] = ["PT", "ES"];
const COMING_SOON = ["Netherlands", "France", "Germany", "Greece"];

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function MarketFocus() {
  const live = countriesWithRegions.filter((c) => LIVE.includes(c.code));

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
      <SectionIntro
        overline="Market focus"
        title="Now live in Portugal and Spain"
        lead="We’re starting where the new-build market is most active for international buyers — with more European markets to follow."
        action={
          <Link
            href="/explore"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-5 text-sm font-semibold text-text transition hover:bg-surface"
          >
            Explore all regions <Arrow className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {live.map((c) => {
          const count = countryProjectCount(c.code);
          return (
            <Link
              key={c.code}
              href="/explore"
              className="group relative h-72 overflow-hidden rounded-2xl border border-border"
            >
              <RegionImage
                src={c.image}
                label={c.label}
                className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow">{c.label}</h3>
                  <p className="text-sm font-medium text-white/85 drop-shadow">
                    {count} project{count === 1 ? "" : "s"} · {c.regions.length} regions
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-text shadow-sm">
                  Explore <Arrow className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Coming soon */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-muted">Coming soon:</span>
        {COMING_SOON.map((s) => (
          <span
            key={s}
            className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-text-muted"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
