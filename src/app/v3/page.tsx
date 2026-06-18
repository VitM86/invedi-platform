import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { WhyInvediV2 } from "@/components/wireframe/landing-v2/WhyInvediV2";
import { MarketFocusV2 } from "@/components/wireframe/landing-v2/MarketFocusV2";
import { HeroV3 } from "@/components/wireframe/landing-v3/HeroV3";
import { AllProjectsGridV3 } from "@/components/wireframe/landing-v3/AllProjectsGridV3";

/** Display serif scoped to /v3 (same approach as /v2). */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

// TEMP: hidden per founder, do not delete — the "Curated infrastructure for new-build real
// estate" band (WhyInvediV2 component) is intentionally kept in the bundle so we can flip
// this flag back to `true` to bring it back without a code rewrite. The component, copy,
// and styling are unchanged; only its render on /v3 is gated.
const SHOW_CURATED_INFRA = false;

export const metadata: Metadata = {
  title: "Invedi v3 — editorial preview",
  description:
    "Editorial preview v3 — inventory-first homepage: hero, full projects grid, regions.",
  robots: { index: false, follow: false },
};

// /v3 — inventory-first ordering per founder feedback. Top to bottom:
//   1. Hero (kept; HeroBackground stays swappable for future video/slideshow).
//   2. Full projects grid directly below the hero (NOT a 4-card featured selection).
//   3. Country/region cards (MarketFocus) — entry points into Explore filtered by market.
//   4. Why Invedi — gated behind SHOW_CURATED_INFRA (currently false, per founder).
//   5. Footer.
//
// The audience CTA band (Buyer / Agent / Developer) was removed at this revision — the
// founder felt it overcomplicated the page. UserTypeCtaV3 component still exists so it
// can be reused later without rewriting it; it's just no longer rendered here.
//
// Background rhythm: hero (photo) → warm → white → footer.
export default function V3Landing() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-white`}>
      <HeroV3 />
      <main>
        <AllProjectsGridV3 />
        <MarketFocusV2 />
        {SHOW_CURATED_INFRA && <WhyInvediV2 />}
      </main>
      <SiteFooter />
    </div>
  );
}
