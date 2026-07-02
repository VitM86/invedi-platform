/**
 * PlatformFeaturesV3 — compact "what the platform does" strip for /v3.
 *
 * Eight feature tiles (line icon + short label + optional one-liner), 4×2 on desktop and
 * 2×4 on mobile. Sits after the projects grid, where the hidden "Curated infrastructure"
 * band used to be. Warm palette, consistent with the rest of /v3.
 *
 * // TODO(copy): the one-line descriptions are ours (optional per brief); labels are the
 * founder's. The About page carries the full descriptions.
 */

import type { ReactNode } from "react";
import { SectionIntroV2 } from "../landing-v2/SectionIntroV2";

type Feature = { label: string; sub: string; icon: ReactNode };

const S = { fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" } as const;
const cap = { strokeLinecap: "round", strokeLinejoin: "round" } as const;

const FEATURES: Feature[] = [
  {
    label: "Digital interactive process",
    sub: "Browse, compare and reserve in one flow",
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
    icon: (
      <svg className="h-6 w-6" {...S}>
        <path {...cap} d="m12 4 2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.9l-4.7 2.46.9-5.23-3.8-3.7 5.25-.77L12 4Z" />
      </svg>
    ),
  },
  {
    label: "Interactive project map",
    sub: "See every development in context",
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

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex h-full flex-col gap-4 rounded-xl border border-[#e6dfd2] bg-white p-5 lg:p-6"
            >
              <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-surface-tint text-primary-dark">
                {f.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold leading-snug text-text">{f.label}</h3>
                <p className="mt-1 text-[13px] leading-snug text-text-muted">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
