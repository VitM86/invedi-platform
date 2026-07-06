"use client";

/**
 * PlatformFeaturesV3 — compact "what the platform does" strip for the homepage.
 *
 * Eight feature tiles (line icon + short label + one-liner), 4×2 on desktop and 2×4 on
 * mobile. Sits after the projects grid, where the hidden "Curated infrastructure" band
 * used to be. Warm palette, consistent with the rest of the page.
 *
 * Per founder feedback each tile carries a "Read more" that expands the full description
 * in place (accordion, no modal/navigation). Multiple tiles can be open at once. The grid
 * uses `items-start` (not the default stretch) so an expanded tile grows on its own without
 * stretching its row neighbours; on mobile the expansion simply pushes the grid down.
 * Height animation is the CSS grid-rows 0fr→1fr trick — no JS measuring.
 *
 * // TODO(copy): the one-line descriptions are ours (optional per brief); labels and the
 * expanded descriptions are the founder's (PDF, verbatim).
 */

import { useId, useState, type ReactNode } from "react";
import { SectionIntroV2 } from "../landing-v2/SectionIntroV2";

type Feature = { label: string; sub: string; more: string; icon: ReactNode };

const S = { fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" } as const;
const cap = { strokeLinecap: "round", strokeLinejoin: "round" } as const;

const FEATURES: Feature[] = [
  {
    label: "Digital interactive process",
    sub: "Browse, compare and reserve in one flow",
    more: "Our end-to-end digital process is designed to protect buyers, increase transparency, create overview and provide confidence at every stage of the transaction.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v9A2.25 2.25 0 0 1 18 17.25H6A2.25 2.25 0 0 1 3.75 15V6Z" />
        <path {...cap} d="M9 20.25h6M12 17.25v3" />
        <path {...cap} d="m10 8.5 3 2-3 2v-4Z" />
      </svg>
    ),
  },
  {
    label: "Independent rating",
    sub: "Every project scored on a public standard",
    more: "Benefit from our independent investment analysis and clear recommendations, explaining why we believe a specific residential project represents an attractive buying opportunity. Like the Michelin star for restaurants, the Invedi star rating is an independent mark of quality and transparency for new developments. We hold every project to a clear, public standard, and only those that meet it earn the star.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="m12 4 2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.9l-4.7 2.46.9-5.23-3.8-3.7 5.25-.77L12 4Z" />
      </svg>
    ),
  },
  {
    label: "Interactive project map",
    sub: "See every development in context",
    more: "Browse all off-plan residential developments in the region using advanced filters tailored to your investment criteria.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M9 3.75 3.75 6v14.25L9 18l6 2.25 5.25-2.25V3.75L15 6 9 3.75Z" />
        <path {...cap} d="M9 3.75V18M15 6v14.25" />
      </svg>
    ),
  },
  {
    label: "Data table overview",
    sub: "Compare units, prices and availability",
    more: "Compare projects by price per m², price per bedroom, monthly service charges, projected rental yields, capital appreciation, payment structures, comparable transactions, and financing scenarios.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M3.75 5.25h16.5v13.5H3.75V5.25Z" />
        <path {...cap} d="M3.75 9.75h16.5M3.75 14.25h16.5M9.75 5.25v13.5" />
      </svg>
    ),
  },
  {
    label: "AI-powered sales agents",
    sub: "Answers 24/7, a human within 12h",
    more: "Get instant answers to legal, financial, and commercial questions, including ownership structures, escrow protection, reservation terms, mortgage options, and jurisdiction-specific regulations. Our AI-driven platform provides personalized experiences, 24/7 multilingual support, and automates the entire sales journey, from marketing and lead qualification to contract signing. There is also a real life Invedi sales agent that will reply within 12 hours.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M4.5 5.25h15A1.5 1.5 0 0 1 21 6.75v8.5a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 3.5v-3.5h0A1.5 1.5 0 0 1 3 15.25v-8.5a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path {...cap} d="m12 8.25.9 1.85 1.85.9-1.85.9L12 13.75l-.9-1.85-1.85-.9 1.85-.9L12 8.25Z" />
      </svg>
    ),
  },
  {
    label: "Reservation & Booking system",
    sub: "Hold a unit for 12–24 hours",
    more: "Once buyers or brokers have created an account and completed our verification process (including agent approval and buyer qualification), they can reserve an available unit for 12-24 hours. A live inventory management system ensures real-time availability and complete transparency.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5v11.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V7.5Z" />
        <path {...cap} d="m9 13.5 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Referral broker network",
    sub: "Work deals with vetted partners",
    more: "We simplify the fragmented broker landscape with transparent commission tracking, centralized oversight, and AI-powered lead qualification. Referral brokers know exactly what they will earn upfront: no hidden fees, no administrative burden, and no surprises. You focus on your clients; we handle the rest.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M7.5 10.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM16.5 10.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
        <path {...cap} d="M3.75 18.75a3.75 3.75 0 0 1 7.5 0M12.75 18.75a3.75 3.75 0 0 1 7.5 0M9.6 9.4l4.8 0" />
      </svg>
    ),
  },
  {
    label: "Realtime market intelligence",
    sub: "Live pricing and absorption data",
    more: "Stay ahead with live insights into buyer behaviour, pricing trends, demographic changes, and market demand. Local market intelligence is continuously monitored, while data remains centralized for accurate benchmarking and informed investment decisions.",
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="M3.75 20.25h16.5M6.75 20.25v-6M11.25 20.25v-9M15.75 20.25v-4.5M20.25 20.25V6.75" />
        <path {...cap} d="m6.75 10.5 4.5-4.5 3 3 5.25-5.25" />
      </svg>
    ),
  },
];

export function PlatformFeaturesV3() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-32">
        <SectionIntroV2
          overline="The platform"
          title="Everything the deal needs, in one place"
          lead="From first browse to reservation — one connected, transparent workflow for brokers, agents and buyers."
        />

        {/* items-start: an expanded tile grows independently instead of stretching its row. */}
        <div className="mt-14 grid grid-cols-2 items-start gap-4 md:grid-cols-4 lg:gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.label} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature: f }: { feature: Feature }) {
  const [open, setOpen] = useState(false);
  const moreId = useId();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#e6dfd2] bg-white p-5 lg:p-6">
      <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-surface-tint text-primary-dark">
        {f.icon}
      </span>
      <div>
        <h3 className="text-[15px] font-semibold leading-snug text-text">{f.label}</h3>
        <p className="mt-1 text-[13px] leading-snug text-text-muted">{f.sub}</p>

        {/* Expandable full description — grid-rows 0fr→1fr animates height without measuring. */}
        <div
          id={moreId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-2.5 text-[13px] leading-relaxed text-text-muted/90">{f.more}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={moreId}
        className="group mt-auto inline-flex items-center gap-1 self-start text-[12px] font-medium text-accent transition-colors hover:text-primary-dark"
      >
        {open ? "Read less" : "Read more"}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
}
