/**
 * UserTypeCtaV3 — compact conversion strip near the bottom of /v3.
 *
 * Three side-by-side cards for the three audiences (Buyer / Agent / Developer). Each card
 * is intentionally tight: one short serif line, one button. This REPLACES the previous large
 * "Built for both sides of the deal" section — the long checkmark lists are gone.
 *
 * Copy is placeholder; founder to refine.
 */

import Link from "next/link";
import type { CSSProperties } from "react";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

type Cta = {
  eyebrow: string;
  line: string;
  buttonLabel: string;
  href: string;
  variant: "primary" | "secondary";
};

const CTAS: Cta[] = [
  {
    eyebrow: "For buyers",
    line: "Find your place in Portugal & Spain",
    buttonLabel: "Browse developments",
    href: "/explore",
    variant: "primary",
  },
  {
    eyebrow: "For agents",
    line: "Bring curated new-builds to your clients",
    buttonLabel: "Explore projects",
    href: "/explore",
    variant: "secondary",
  },
  {
    eyebrow: "For developers",
    line: "List your development on Invedi",
    buttonLabel: "Contact us",
    href: "#",
    variant: "secondary",
  },
];

export function UserTypeCtaV3() {
  return (
    <section style={{ backgroundColor: "#F5F2EC" }}>
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CTAS.map((c) => (
            <div
              key={c.eyebrow}
              className="flex h-full flex-col rounded-2xl border border-[#e6dfd2] bg-white p-7 lg:p-8"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
                {c.eyebrow}
              </span>
              <h3
                className="mt-4 text-[22px] font-light leading-[1.25] tracking-tight text-text lg:text-[24px]"
                style={SERIF}
              >
                {c.line}
              </h3>
              <div className="mt-auto pt-8">
                <Link
                  href={c.href}
                  className={
                    c.variant === "primary"
                      ? "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-white transition hover:bg-primary-hover"
                      : "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-text px-5 text-[13px] font-semibold text-text transition hover:bg-[#f0ebde]"
                  }
                >
                  {c.buttonLabel}
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
