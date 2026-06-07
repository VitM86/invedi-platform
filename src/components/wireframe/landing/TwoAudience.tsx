/**
 * TwoAudience — the core of the dual-entry approach. Two columns (stacked on mobile): brokers &
 * agents lead (left, teal-tinted, the primary audience) and buyers & investors (right, neutral).
 * Each: eyebrow + heading + value points framed for that audience + a CTA.
 *
 * Copy is PLACEHOLDER, written in each audience's voice — founder to refine.
 */

import Link from "next/link";
import { SectionIntro } from "./SectionIntro";

// TODO(open-question): broker CTA currently routes to /explore. It may later go to a
// broker-specific onboarding / request-access flow. Buyer CTA routes to /explore (browse).
const BROKER_POINTS = [
  "Access a curated shortlist of verified new-build projects",
  "Present them to your clients with clean, consistent data",
  "One central source for plans, prices and availability",
  "Bring new deals into your pipeline",
];

const BUYER_POINTS = [
  "Discover the best new developments in Portugal & Spain",
  "Compare projects and prices side by side",
  "Understand what makes a sound investment",
  "Talk to an advisor when you’re ready",
];

function Check() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-none text-primary"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function TwoAudience() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
      <SectionIntro
        overline="One platform, two paths"
        title="Built for both sides of the deal"
        lead="Invedi works whether you sell new-build property or you’re looking to buy and invest. Pick your path."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brokers & agents — lead (primary audience) */}
        <div className="flex flex-col rounded-2xl border border-primary/25 bg-surface-tint p-7 lg:p-9">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">
            For brokers &amp; agents
          </span>
          <h3 className="mt-4 text-2xl font-bold text-text">
            Bring curated new-builds to your clients
          </h3>
          <p className="mt-2 text-base leading-relaxed text-text-muted">
            A single, reliable source for the projects worth showing — and the data to back them up.
          </p>
          <ul className="mt-6 space-y-3">
            {BROKER_POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] leading-snug text-text">
                <Check />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/explore"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-white transition hover:bg-primary-hover"
            >
              Explore projects
              <Arrow />
            </Link>
            {/* TODO(open-question): "Request access" is a placeholder with no route yet. */}
            <span className="cursor-default text-sm font-semibold text-primary-dark">
              or request access
            </span>
          </div>
        </div>

        {/* Buyers & investors */}
        <div className="flex flex-col rounded-2xl border border-border bg-background p-7 lg:p-9">
          <span className="inline-flex w-fit items-center rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-text-muted">
            For buyers &amp; investors
          </span>
          <h3 className="mt-4 text-2xl font-bold text-text">
            Find the right place to buy or invest
          </h3>
          <p className="mt-2 text-base leading-relaxed text-text-muted">
            Discover standout developments, compare them on the numbers, and move when it’s right.
          </p>
          <ul className="mt-6 space-y-3">
            {BUYER_POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] leading-snug text-text">
                <Check />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/explore"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-text px-6 text-base font-semibold text-text transition hover:bg-surface"
            >
              Browse developments
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
