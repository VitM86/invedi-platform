import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { WhyInvediV2 } from "@/components/wireframe/landing-v2/WhyInvediV2";
import { MarketFocusV2 } from "@/components/wireframe/landing-v2/MarketFocusV2";
import { HeroV3 } from "@/components/wireframe/landing-v3/HeroV3";
import { AllProjectsGridV3 } from "@/components/wireframe/landing-v3/AllProjectsGridV3";
import { PlatformFeaturesV3 } from "@/components/wireframe/landing-v3/PlatformFeaturesV3";
import { SignUpBandV3 } from "@/components/wireframe/landing-v3/SignUpBandV3";

// The former /v3 is now the single homepage (the old / and /v2 were removed to stop the founder
// reviewing stale versions). /v3 and /v2 301-redirect here (see next.config.ts).

// Coming-soon markets, passed to the shared MarketFocusV2.
const V3_COMING_SOON = ["The Netherlands", "UAE", "Germany", "London / UK", "South Florida / USA"];

/** Display serif for the editorial headings, scoped to this page via `fraunces.variable`. */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

// TEMP: hidden per founder, do not delete — the "Curated infrastructure for new-build real
// estate" band (WhyInvediV2 component) is intentionally kept in the bundle so we can flip this
// flag back to `true` to bring it back without a code rewrite.
const SHOW_CURATED_INFRA = false;

export const metadata: Metadata = {
  title: "Invedi — curated new-build developments in Portugal & Spain",
  description:
    "An inventory-first marketplace of verified new-build developments in Portugal and Spain, with the data and clarity to act on them.",
};

// Homepage — inventory-first ordering. Top to bottom:
//   1. Hero (single "Explore residences" CTA).
//   2. Full projects grid directly below the hero.
//   2b. Platform features strip — compact tiles, what the platform does.
//   3. Country/region cards (MarketFocus) — entry points into Explore filtered by market.
//   4. Why Invedi — gated behind SHOW_CURATED_INFRA (currently false, per founder).
//   5. Sign-up band — audience entry points.
//   6. Footer — with Instagram + LinkedIn icons (showSocials).
//
// Background rhythm: hero (photo) → cream → white → cream → white footer.
export default function Home() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-white`}>
      <HeroV3 />
      <main>
        <AllProjectsGridV3 />
        <PlatformFeaturesV3 />
        <MarketFocusV2 comingSoon={V3_COMING_SOON} />
        {SHOW_CURATED_INFRA && <WhyInvediV2 />}
        <SignUpBandV3 />
      </main>
      <SiteFooter showSocials />
    </div>
  );
}
