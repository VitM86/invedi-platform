/**
 * FeaturedProjectsV2 — editorial featured-projects band for /v2.
 *
 * Same selection and same shared ProjectCard component as v1's FeaturedProjects. Visual shift
 * is purely chrome: warm sand section background, serif section title, generous padding.
 * Cards themselves stay in sans (per brief: editorial serif only on big section/hero headings).
 */

import Link from "next/link";
import { getProject, type Project } from "@/lib/mock-data";
import { ProjectCard } from "../ProjectCard";
import { SectionIntroV2 } from "./SectionIntroV2";

const FEATURED_SLUGS = ["douro-terraces", "olive-grove", "marina-vista", "aegean-heights"];

export function FeaturedProjectsV2() {
  const featured = FEATURED_SLUGS.map((s) => getProject(s)).filter(
    (p): p is Project => Boolean(p),
  );

  return (
    <section style={{ backgroundColor: "#F5F2EC" }}>
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-36">
        <SectionIntroV2
          overline="Featured"
          title="A look at what’s on Invedi"
          lead="A small selection of verified developments. Explore the full marketplace to filter by market, price and more."
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

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
