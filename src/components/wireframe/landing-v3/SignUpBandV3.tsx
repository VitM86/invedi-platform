/**
 * SignUpBandV3 — bottom-of-page conversion strip for the homepage.
 *
 * Three audience entry-points: Buyer / Broker / Agent / Group of buyers. Each card is itself
 * the link (no inner button) so the full card surface is the click target — keeps the row
 * lighter than the older UserTypeCta cards (which had eyebrow + serif line + pill button).
 *
 * Per founder feedback the roles are color-coded so they read as distinct at a glance,
 * but with muted tints instead of the raw blue/yellow/green of his reference (they clash
 * with the warm cream palette). Each role carries:
 *   - a small round icon chip in the role tint (top of card)
 *   - product-scope tags pinned to the bottom-right corner in the same tint
 * Card backgrounds stay white; accents are deliberately quiet — luxury, not dashboard.
 *
 * Product routing:
 *   - Buyer                → Invedi residences (the curated marketplace)
 *   - Broker / Agent       → both products (two tags)
 *   - Group of buyers      → Bulk & fractional (separate product, not built yet)
 *
 * Card titles are sans (Roboto) semibold — the old serif titles blended into the serif
 * "I would like…" heading above; the sans weight gives the row its own hierarchy.
 *
 * Background is the warm `#F5F2EC` cream that mirrors AllProjectsGridV3, sitting between the
 * white MarketFocusV2 above and the white footer below to preserve the
 * photo → cream → white → cream → white rhythm.
 */

"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useUnlock } from "../UnlockProvider";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

/** Muted role accents — tints of the founder's blue/yellow/green reference, desaturated
 *  to sit on the warm cream/white palette. `accent` = icon + tag text, `tint` = chip + tag bg. */
type RoleAccent = { accent: string; tint: string };

type SignUpCard = {
  title: string;
  role: RoleAccent;
  icon: "buyer" | "broker" | "group";
  /** Product-scope badges, rendered bottom-right. */
  tags: string[];
  /** Optional secondary in-card link. Broker / Agent routes into BOTH products, so its card's
   *  primary "Sign up" opens the popup and it carries a small secondary link to Bulk & fractional. */
  secondary?: { label: string; href: string };
};

const CARDS: SignUpCard[] = [
  {
    title: "Buyer",
    role: { accent: "#47688C", tint: "#EBF1F6" }, // soft steel blue
    icon: "buyer",
    tags: ["Invedi residences"],
  },
  {
    title: "Broker / Agent",
    role: { accent: "#96763A", tint: "#F5EDDC" }, // soft gold — leans on the logo tone
    icon: "broker",
    tags: ["Invedi residences", "Bulk & fractional"],
    secondary: { label: "Bulk & fractional", href: "/bulk-fractional" },
  },
  {
    title: "Group of buyers",
    role: { accent: "#47755F", tint: "#E9F1EC" }, // soft emerald
    icon: "group",
    tags: ["Bulk & fractional"],
  },
];

const CARD_SHELL =
  "relative flex h-full flex-col justify-between gap-12 rounded-2xl border border-[#e6dfd2] bg-white p-7 pb-6 transition hover:border-text/40 hover:shadow-sm lg:p-8 lg:pb-7";

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function RoleIcon({ kind, className }: { kind: SignUpCard["icon"]; className?: string }) {
  const shared = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.6,
    stroke: "currentColor",
  } as const;
  if (kind === "buyer") {
    return (
      <svg {...shared}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.9 17.9 0 0 1-7.5 1.65c-2.68 0-5.22-.59-7.5-1.65Z"
        />
      </svg>
    );
  }
  if (kind === "broker") {
    return (
      <svg {...shared}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-4.07m16.5-3.9V8.71a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 8.7v1.54m16.5 0a2.25 2.25 0 0 1-1.07 1.92l-5.5 3.03a2.25 2.25 0 0 1-2.36 0l-5.5-3.03a2.25 2.25 0 0 1-1.07-1.92m16.5 0V8.71M15 6.46V5.25A2.25 2.25 0 0 0 12.75 3h-1.5A2.25 2.25 0 0 0 9 5.25v1.21"
        />
      </svg>
    );
  }
  return (
    <svg {...shared}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.09 9.09 0 0 0 3.74-.48 3 3 0 0 0-4.68-2.72M18 18.72V18a5.97 5.97 0 0 0-.94-3.2M18 18.72c0 .08 0 .17-.01.25A12 12 0 0 1 12 20.5c-2.17 0-4.21-.57-5.98-1.58a2 2 0 0 1-.02-.2v-.72m12-3.28a6 6 0 0 0-10.06 0M6 18.72a9.09 9.09 0 0 1-3.74-.48 3 3 0 0 1 4.68-2.72M6 18.72V18c0-1.18.34-2.28.94-3.2M15 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}

/** Product-scope badges, pinned bottom-right. Tinted bg + darker accent text per role. */
function ScopeTags({ card }: { card: SignUpCard }) {
  return (
    <div className="pointer-events-none absolute bottom-5 right-5 flex flex-col items-end gap-1.5 lg:bottom-6 lg:right-6">
      {card.tags.map((t) => (
        <span
          key={t}
          className="rounded-full px-2.5 py-1 text-[10px] font-medium leading-none tracking-[0.06em]"
          style={{ backgroundColor: card.role.tint, color: card.role.accent }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function SignUpBandV3() {
  const { requestUnlock } = useUnlock();
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
          {CARDS.map((c) => {
            const Head = (
              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.role.tint, color: c.role.accent }}
                >
                  <RoleIcon kind={c.icon} className="h-5 w-5" />
                </span>
                <h3 className="text-[19px] font-semibold leading-[1.2] tracking-tight text-text lg:text-[20px]">
                  {c.title}
                </h3>
              </div>
            );

            // Broker / Agent routes into both products → primary "Sign up" opens the popup plus
            // a small secondary link to Bulk & fractional.
            if (c.secondary) {
              return (
                <div key={c.title} className={CARD_SHELL}>
                  {Head}
                  <div className="flex flex-col items-start gap-2.5">
                    <button
                      type="button"
                      onClick={requestUnlock}
                      className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-text"
                    >
                      Sign up
                      <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <Link
                      href={c.secondary.href}
                      className="group inline-flex items-center gap-1 text-[12px] font-medium text-text-muted transition-colors hover:text-text"
                    >
                      {c.secondary.label}
                      <Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                  <ScopeTags card={c} />
                </div>
              );
            }

            return (
              <button
                key={c.title}
                type="button"
                onClick={requestUnlock}
                className={`group text-left ${CARD_SHELL}`}
              >
                {Head}
                <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-text">
                  Sign up
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
                <ScopeTags card={c} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
