/**
 * TwoAudienceV2 — editorial dual-entry section for /v2.
 *
 * Same content/structure as TwoAudience on `/`. Visual shifts: warm sand section background,
 * serif headings (Fraunces), generous vertical padding (+~45% vs v1), and softer card framing
 * — broker card on a warm tinted surface, buyer card on white, both with hairline borders
 * instead of v1's heavy teal-tinted block.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { SectionIntroV2 } from "./SectionIntroV2";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

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
      className="mt-1 h-4 w-4 flex-none text-primary"
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

export function TwoAudienceV2() {
  return (
    <section style={{ backgroundColor: "#F5F2EC" }}>
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-36">
        <SectionIntroV2
          overline="One platform, two paths"
          title="Built for both sides of the deal"
          lead="Invedi works whether you sell new-build property or you’re looking to buy and invest. Pick your path."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brokers & agents */}
          <div
            className="flex flex-col rounded-2xl border border-[#e6dfd2] p-9 lg:p-12"
            style={{ backgroundColor: "#EBE6DA" }}
          >
            <span className="inline-flex w-fit items-center text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
              For brokers &amp; agents
            </span>
            <h3
              className="mt-5 text-[28px] font-light leading-[1.15] tracking-tight text-text sm:text-[32px]"
              style={SERIF}
            >
              Bring curated new-builds to your clients
            </h3>
            <p className="mt-3 text-[16px] font-light leading-[1.7] text-text-muted">
              A single, reliable source for the projects worth showing — and the data to back them up.
            </p>
            <ul className="mt-7 space-y-3.5">
              {BROKER_POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] font-light leading-[1.6] text-text">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
              >
                Explore projects
                <Arrow />
              </Link>
              <span className="cursor-default text-[13px] font-medium uppercase tracking-[0.16em] text-primary-dark">
                or request access
              </span>
            </div>
          </div>

          {/* Buyers & investors */}
          <div className="flex flex-col rounded-2xl border border-[#e6dfd2] bg-white p-9 lg:p-12">
            <span className="inline-flex w-fit items-center text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
              For buyers &amp; investors
            </span>
            <h3
              className="mt-5 text-[28px] font-light leading-[1.15] tracking-tight text-text sm:text-[32px]"
              style={SERIF}
            >
              Find the right place to buy or invest
            </h3>
            <p className="mt-3 text-[16px] font-light leading-[1.7] text-text-muted">
              Discover standout developments, compare them on the numbers, and move when it’s right.
            </p>
            <ul className="mt-7 space-y-3.5">
              {BUYER_POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] font-light leading-[1.6] text-text">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-text px-6 text-[14px] font-semibold text-text transition hover:bg-[#f0ebde]"
              >
                Browse developments
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
