import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { WhyInvediV2 } from "@/components/wireframe/landing-v2/WhyInvediV2";
import { MarketFocusV2 } from "@/components/wireframe/landing-v2/MarketFocusV2";
import { HeroV3 } from "@/components/wireframe/landing-v3/HeroV3";
import { AllProjectsGridV3 } from "@/components/wireframe/landing-v3/AllProjectsGridV3";
import { UserTypeCtaV3 } from "@/components/wireframe/landing-v3/UserTypeCtaV3";

/** Display serif scoped to /v3 (same approach as /v2). */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invedi v3 — editorial preview",
  description:
    "Editorial preview v3 — inventory-first homepage: hero, full projects grid, regions, why Invedi, audience CTAs.",
  robots: { index: false, follow: false },
};

// /v3 — inventory-first ordering per founder feedback. Top to bottom:
//   1. Hero (kept; HeroBackground stays swappable for future video/slideshow).
//   2. Full projects grid directly below the hero (NOT a 4-card featured selection).
//   3. Country/region cards (MarketFocus) — entry points into Explore filtered by market.
//   4. Why Invedi (kept).
//   5. Compact audience CTA band (Buyer / Agent / Developer) — replaces the old TwoAudience.
//   6. Footer.
//
// Background rhythm: hero (photo) → warm → white → dark slate → warm → footer.
// Photo-break interludes from the prior /v3 are intentionally removed — the inventory takes
// their visual weight now.
export default function V3Landing() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-white`}>
      <HeroV3 />
      <main>
        <AllProjectsGridV3 />
        <MarketFocusV2 />
        <WhyInvediV2 />
        <UserTypeCtaV3 />
      </main>
      <SiteFooter />
    </div>
  );
}
