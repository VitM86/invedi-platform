import type { Metadata } from "next";
import { SiteHeader } from "@/components/wireframe/SiteHeader";
import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { Hero, CopyReviewStrip } from "@/components/wireframe/landing/Hero";
import { TwoAudience } from "@/components/wireframe/landing/TwoAudience";
import { WhyInvedi } from "@/components/wireframe/landing/WhyInvedi";
import { MarketFocus } from "@/components/wireframe/landing/MarketFocus";
import { FeaturedProjects } from "@/components/wireframe/landing/FeaturedProjects";

export const metadata: Metadata = {
  title: "Invedi — curated new-build developments in Portugal & Spain",
  description:
    "A verified, data-rich marketplace of new-build developments in Portugal and Spain — for the brokers who sell them and the buyers who invest in them.",
};

// Landing (/). Sections, top → bottom: hero (shared value + two audience entries) → two-audience
// split → why-Invedi trust band → market focus → featured projects → footer. Explore stays at
// /explore. The amber CopyReviewStrip is a review-only appendix below the footer (placeholder
// copy for the founder to choose) — remove before production.
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="home" />
      <main>
        <Hero />
        <TwoAudience />
        <WhyInvedi />
        <MarketFocus />
        <FeaturedProjects />
      </main>
      <SiteFooter />
      <CopyReviewStrip />
    </div>
  );
}
