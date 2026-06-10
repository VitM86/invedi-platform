import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { TwoAudienceV2 } from "@/components/wireframe/landing-v2/TwoAudienceV2";
import { WhyInvediV2 } from "@/components/wireframe/landing-v2/WhyInvediV2";
import { MarketFocusV2 } from "@/components/wireframe/landing-v2/MarketFocusV2";
import { FeaturedProjectsV2 } from "@/components/wireframe/landing-v2/FeaturedProjectsV2";
import { PhotoBreak } from "@/components/wireframe/landing-v2/PhotoBreak";
import { HeroV3 } from "@/components/wireframe/landing-v3/HeroV3";

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
    "Editorial preview v3 — redesigned hero (inset card, frosted glass nav, new Invedi monogram) on top of the approved v2 page below. Not linked from the live site.",
  robots: { index: false, follow: false },
};

// /v3 — same content/structure as /v2 from TwoAudience onwards (reused, not forked); the hero
// is replaced with HeroV3 (inset rounded card, warm-dusk gradient over the photo, glass nav
// with the new logo). HeroV3 owns the fixed light SiteHeader and crossfades it in on scroll,
// so this page intentionally renders NO SiteHeader of its own at the top.
export default function V3Landing() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-white`}>
      <HeroV3 />
      <main>
        {/* Featured moved up to sit directly below the hero (v3-only ordering). The warm-bg
            alternation rhythm is preserved because Featured and TwoAudience share the same
            warm sand background, and the swap keeps Dark (WhyInvedi) + White (MarketFocus)
            sandwiched between them. */}
        <FeaturedProjectsV2 />
        <WhyInvediV2 />
        <PhotoBreak
          src="/images/landing/hero-comporta.jpg"
          alt="Pine forest meeting the Atlantic at Comporta, Portugal"
        />
        <MarketFocusV2 />
        <TwoAudienceV2 />
        <PhotoBreak
          src="/images/landing/hero-lisbon.jpg"
          alt="Lisbon coastline at golden hour"
          height="h-[52vh] min-h-[380px] lg:h-[58vh]"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
