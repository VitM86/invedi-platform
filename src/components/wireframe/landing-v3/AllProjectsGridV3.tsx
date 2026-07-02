/**
 * AllProjectsGridV3 — full inventory grid for /v3, sitting directly under the hero.
 *
 * Per the founder feedback: surface actual inventory as early as possible, with less
 * marketing framing. Uses the SAME ProjectCard the Explore grid uses, and the SAME column
 * breakpoints, so visiting /v3 → /explore feels continuous. Minimal section header — a short
 * eyebrow + title + "Browse all developments" link to the full filtered Explore experience.
 */

import Link from "next/link";
import { projects } from "@/lib/mock-data";
import { ProjectCard } from "../ProjectCard";
import { SectionIntroV2 } from "../landing-v2/SectionIntroV2";

export function AllProjectsGridV3() {
  return (
    <section style={{ backgroundColor: "#F5F2EC" }}>
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-32">
        <SectionIntroV2
          overline="Projects"
          title="All developments"
          action={
            <Link
              href="/explore"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[#d8d2c4] bg-white px-5 text-[13px] font-medium uppercase tracking-[0.16em] text-text transition hover:bg-[#f5f2ec]"
            >
              Browse all developments
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            // showScore: /v3 surfaces the Invedi star badge on cards. The shared card stays
            // unchanged on / and /v2 (they don't pass this).
            <ProjectCard key={p.slug} project={p} showScore />
          ))}
        </div>
      </div>
    </section>
  );
}
