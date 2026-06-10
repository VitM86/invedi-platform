/**
 * HeroV2 — editorial hero for /v2.
 *
 * Same content/structure as Hero on `/` (verified eyebrow chip, headline, subhead, two audience
 * CTAs, trust line). The visual shift is typographic: the headline is set in a light-weight
 * display serif (Fraunces via --font-serif), larger and airier; subhead body weight is lighter
 * and line-height looser. Buttons remain in sans on purpose.
 *
 * Image and onError fallback come from the same RegionImage primitive as v1.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { RegionImage } from "../explore/RegionImage";
import { HEADLINE_OPTIONS, SUBHEAD_OPTIONS } from "../landing/Hero";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

const BROKER_HREF = "/explore";
const BUYER_HREF = "/explore";

export function HeroV2() {
  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      <RegionImage
        src="/images/landing/hero-balearic.jpg"
        label="A premium new-build development on the Mediterranean coast at golden hour"
        loading="eager"
        fetchPriority="high"
        showLabel={false}
        gradientClassName="bg-gradient-to-br from-primary via-accent to-primary-dark"
        className="absolute inset-0 -z-10 h-full w-full"
      />

      {/* Softer scrim than v1 — editorial uses subtler contrast. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/35 to-black/0" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] flex-col justify-center px-6 py-20 lg:px-14 lg:py-28">
        <div className="max-w-3xl">
          {/* Eyebrow chip — kept for consistency; chips/badges aren't part of the section-label restyle. */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-verified" />
            Now live in Portugal &amp; Spain
          </span>

          <h1
            className="mt-8 text-[42px] font-light leading-[1.05] tracking-tight text-white sm:text-[56px] lg:text-[72px]"
            style={SERIF}
          >
            {HEADLINE_OPTIONS[0]}
          </h1>

          <p className="mt-7 max-w-xl text-[17px] font-light leading-[1.7] text-white/90 lg:text-[19px]">
            {SUBHEAD_OPTIONS[0]}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={BROKER_HREF}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-semibold text-white shadow-lg transition hover:bg-primary-hover"
            >
              For brokers &amp; agents
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <Link
              href={BUYER_HREF}
              className="inline-flex h-14 items-center justify-center rounded-full bg-white/95 px-7 text-[15px] font-semibold text-text shadow-lg transition hover:bg-white"
            >
              For buyers &amp; investors
            </Link>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-light tracking-wide text-white/75">
            <span>Verified developments</span>
            <span className="text-white/35">·</span>
            <span>Market data &amp; comparisons</span>
            <span className="text-white/35">·</span>
            <span>A direct path to the deal</span>
          </p>
        </div>
      </div>
    </section>
  );
}
