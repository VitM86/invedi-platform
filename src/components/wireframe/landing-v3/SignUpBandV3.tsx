/**
 * SignUpBandV3 — bottom-of-page conversion strip for /v3.
 *
 * Three audience entry-points: Buyer / Broker · Agent / Group of buyers. Each card is itself
 * the link (no inner button) so the full card surface is the click target — keeps the row
 * lighter than the older UserTypeCta cards (which had eyebrow + serif line + pill button).
 *
 * Sub-label clarifies which Invedi product the audience routes into:
 *   - Buyer, Broker · Agent → Invedi residences (the curated marketplace)
 *   - Group of buyers       → Bulk & fractional  (separate product, not built yet)
 *
 * Background is the warm `#F5F2EC` cream that mirrors AllProjectsGridV3, sitting between the
 * white MarketFocusV2 above and the white footer below to preserve /v3's
 * photo → cream → white → cream → white rhythm.
 *
 * Copy is placeholder pending founder review.
 */

import Link from "next/link";
import type { CSSProperties } from "react";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

type SignUpCard = {
  title: string;
  subLabel: string;
  // TODO(link): Buyer / Broker → Invedi residences route once defined; Group of buyers
  // points at Bulk & fractional (separate product, not built yet — placeholder #).
  href: string;
};

const CARDS: SignUpCard[] = [
  { title: "Buyer",            subLabel: "(Invedi residences)", href: "/explore" },
  { title: "Broker · Agent",   subLabel: "(Invedi residences)", href: "/explore" },
  { title: "Group of buyers",  subLabel: "(Bulk & fractional)", href: "#" },
];

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function SignUpBandV3() {
  return (
    <section style={{ backgroundColor: "#F5F2EC" }}>
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* TODO(copy): founder to refine heading. lg max font tuned so the line stays
              unbroken at desktop widths inside max-w-3xl (text-[44px] forced an awkward
              "a:" orphan onto a second row at 1440px). */}
          <h2
            className="text-[28px] font-light leading-[1.15] tracking-tight text-text sm:text-[34px] lg:text-[40px]"
            style={SERIF}
          >
            I would like to sign up for Invedi as a:
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-16">
          {CARDS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group flex h-full flex-col justify-between gap-10 rounded-2xl border border-[#e6dfd2] bg-white p-7 transition hover:border-text/40 hover:shadow-sm lg:p-8"
            >
              <div>
                <h3
                  className="text-[24px] font-light leading-[1.2] tracking-tight text-text lg:text-[28px]"
                  style={SERIF}
                >
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] font-medium tracking-wide text-text-muted">
                  {c.subLabel}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-text">
                Sign up
                <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
