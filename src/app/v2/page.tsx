import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

import { SiteHeader } from "@/components/wireframe/SiteHeader";
import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { HeroV2 } from "@/components/wireframe/landing-v2/HeroV2";
import { TwoAudienceV2 } from "@/components/wireframe/landing-v2/TwoAudienceV2";
import { WhyInvediV2 } from "@/components/wireframe/landing-v2/WhyInvediV2";
import { MarketFocusV2 } from "@/components/wireframe/landing-v2/MarketFocusV2";
import { FeaturedProjectsV2 } from "@/components/wireframe/landing-v2/FeaturedProjectsV2";
import { PhotoBreak } from "@/components/wireframe/landing-v2/PhotoBreak";

/**
 * Display serif scoped to /v2 ONLY.
 *
 * next/font/google injects @font-face globally (which is fine — `/` doesn't reference
 * --font-serif and so renders unchanged), and the `--font-serif` CSS variable is exposed only
 * via the variable className that we attach to this page's root. Other routes never get the
 * variable, so nothing on `/` is affected.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invedi v2 — editorial preview",
  description:
    "Editorial preview of the Invedi landing — same content, refined typography and rhythm. Not linked from the live site.",
  // Avoid surfacing this preview in search while it's an experiment.
  robots: { index: false, follow: false },
};

// /v2 — editorial preview of the landing. Identical content/structure to `/`, redressed with a
// display serif (Fraunces) for large editorial headings, a warm sand background palette, one
// dark contrast band (Why Invedi), and two full-bleed photo breaks. Reachable by direct URL
// only — no nav link points here.
export default function V2Landing() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-white`}>
      <SiteHeader active="home" />
      <main>
        <HeroV2 />
        <TwoAudienceV2 />
        <WhyInvediV2 />
        <PhotoBreak
          src="/images/landing/hero-comporta.jpg"
          alt="Pine forest meeting the Atlantic at Comporta, Portugal"
        />
        <MarketFocusV2 />
        <FeaturedProjectsV2 />
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
