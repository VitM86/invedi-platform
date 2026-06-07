/**
 * FeaturedProjects — a small selection of developments to "show the goods" and pull people into
 * Explore. Reuses the existing ProjectCard exactly as the grid uses it. Light grey band.
 */

import Link from "next/link";
import { getProject, type Project } from "@/lib/mock-data";
import { ProjectCard } from "../ProjectCard";
import { SectionIntro } from "./SectionIntro";

// PT/ES-weighted selection that matches the current market focus, plus one to show breadth.
const FEATURED_SLUGS = ["douro-terraces", "olive-grove", "marina-vista", "aegean-heights"];

export function FeaturedProjects() {
  const featured = FEATURED_SLUGS.map((s) => getProject(s)).filter(
    (p): p is Project => Boolean(p),
  );

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
        <SectionIntro
          overline="Featured"
          title="A look at what’s on Invedi"
          lead="A small selection of verified developments. Explore the full marketplace to filter by market, price and more."
          action={
            <Link
              href="/explore"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-background px-5 text-sm font-semibold text-text transition hover:bg-surface-tint"
            >
              Browse all developments
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
