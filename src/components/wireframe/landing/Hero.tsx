/**
 * Hero — the top of the Invedi landing (/). A full-bleed premium exterior shot with a left
 * scrim, one shared value headline, a one-line subheadline, and the two audience entry buttons
 * side by side (brokers/agents primary + first, buyers/investors secondary + second).
 *
 * Copy is PLACEHOLDER for founder review. Option A is rendered live; the alternates are listed
 * in the CopyReviewStrip below so the founder can compare them on the page.
 *
 * NOTE: prototype-only Wikimedia Commons (CC) hero image. Replace with owned/licensed before
 * production. The image lazy/eager-loads via the shared RegionImage primitive and falls back to
 * a brand gradient (onError) so a missing/blocked file never reads as broken.
 */

import Link from "next/link";
import { RegionImage } from "../explore/RegionImage";

// TODO(open-question): final headline + audience copy — placeholder, founder to choose from
// these options. Option A (index 0) is the one rendered in the hero.
export const HEADLINE_OPTIONS = [
  "The curated home for new-build developments in Portugal and Spain.",
  "Find, compare and act on the best new-builds in Portugal and Spain.",
  "Curated new developments — the data behind them, and a clear path to the deal.",
];

export const SUBHEAD_OPTIONS = [
  "Invedi brings the market’s strongest new-build projects into one verified, data-rich place — so brokers and buyers can find the right opportunity and move on it with confidence.",
  "A verified, data-rich view of the new-build market: discover standout projects, compare them on the numbers, and connect straight to the deal.",
];

// TODO(open-question): broker entry currently routes to /explore. It may later go to a
// broker-specific onboarding / request-access flow. Buyer entry routes to /explore (browse).
const BROKER_HREF = "/explore";
const BUYER_HREF = "/explore";

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Full-bleed hero image. Eager + high priority: this is the LCP, so it should NOT lazy. */}
      <RegionImage
        src="/images/landing/hero-balearic.jpg"
        label="A premium new-build development on the Mediterranean coast at golden hour"
        loading="eager"
        fetchPriority="high"
        showLabel={false}
        gradientClassName="bg-gradient-to-br from-primary via-accent to-primary-dark"
        className="absolute inset-0 -z-10 h-full w-full"
      />

      {/* Scrims — left-to-right for text legibility + a soft bottom darken. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] flex-col justify-center px-6 py-16 lg:px-10">
        <div className="max-w-2xl">
          {/* Eyebrow — market focus */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-verified" />
            Now live in Portugal &amp; Spain
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {HEADLINE_OPTIONS[0]}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 lg:text-xl">
            {SUBHEAD_OPTIONS[0]}
          </p>

          {/* Two audience entry buttons — broker primary (first/left), buyer secondary (right) */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={BROKER_HREF}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-white shadow-lg transition hover:bg-primary-hover"
            >
              For brokers &amp; agents
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <Link
              href={BUYER_HREF}
              className="inline-flex h-14 items-center justify-center rounded-full bg-white/95 px-7 text-base font-semibold text-text shadow-lg transition hover:bg-white"
            >
              For buyers &amp; investors
            </Link>
          </div>

          {/* Trust line — curated-infrastructure positioning, concise */}
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-white/75">
            <span>Verified developments</span>
            <span className="text-white/40">·</span>
            <span>Market data &amp; comparisons</span>
            <span className="text-white/40">·</span>
            <span>A direct path to the deal</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * CopyReviewStrip — a clearly-marked, non-design annotation band shown beneath the hero so the
 * founder can pick the headline + subheadline on the live page. Remove before production.
 */
export function CopyReviewStrip() {
  return (
    <section className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="rounded-xl border border-dashed border-amber-300 bg-white p-5 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
            ⚑ Placeholder copy — founder to choose
          </span>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                Headline options
              </p>
              <ol className="space-y-2 text-sm text-text">
                {HEADLINE_OPTIONS.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-amber-700">{String.fromCharCode(65 + i)}.</span>
                    <span>
                      {h}
                      {i === 0 && (
                        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary-dark">
                          live in hero
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                Subheadline options
              </p>
              <ol className="space-y-2 text-sm text-text">
                {SUBHEAD_OPTIONS.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-amber-700">{String.fromCharCode(65 + i)}.</span>
                    <span>
                      {s}
                      {i === 0 && (
                        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary-dark">
                          live in hero
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
