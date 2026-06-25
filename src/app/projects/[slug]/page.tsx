import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProject,
  projects,
  formatPriceRange,
  formatRange,
  type Project,
} from "@/lib/mock-data";
import { AppHeader } from "@/components/wireframe/AppHeader";
import { VerifiedBadge } from "@/components/wireframe/VerifiedBadge";
import { ProjectGallery } from "@/components/wireframe/project/ProjectGallery";
import { ProjectActions } from "@/components/wireframe/project/ProjectActions";
import { RegionOverview } from "@/components/wireframe/project/RegionOverview";
import { EditorialNote } from "@/components/wireframe/project/EditorialNote";
import { StarScore } from "@/components/wireframe/project/StarScore";
import { SalesStatus } from "@/components/wireframe/project/SalesStatus";
import { GatedUnits } from "@/components/wireframe/project/GatedUnits";
import { LightProjectMap } from "@/components/wireframe/project/LightProjectMap";
import { MapPlaceholder } from "@/components/wireframe/project/MapPlaceholder";
import { PhiButton } from "@/components/wireframe/PhiButton";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.name} — Invedi` : "Project — Invedi" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-[1440px] px-6 py-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-text-muted">
          <Link href="/explore" className="hover:text-text">
            Explore
          </Link>
          <span>›</span>
          <span className="text-text">{project.name}</span>
        </nav>

        {/* Title row */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">{project.name}</h1>
            <p className="mt-1 text-base text-text-muted">{project.developer}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {project.city}, {project.region}, {project.countryLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                Completion {project.completion}
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <VerifiedBadge verified={project.verified} size="md" />
          </div>
        </div>

        {/* Two-column body. Right rail is fixed-width 300px so the main content column gets
            visibly more room than the previous 2/3 split — per the founder session,
            content gets priority over the CTA rail. The compact score summary now lives
            INSIDE the right column above Interested (right rail reads: score → Interested);
            the full-width band that briefly sat at the top of the page has been removed. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            <ProjectGallery
              slug={project.slug}
              name={project.name}
              verified={project.verified}
              count={project.heroCount}
            />

            <KeyFacts project={project} />

            <SalesStatus project={project} />

            <Section title="About this project">
              <p className="text-base leading-7 text-text">{project.description}</p>
            </Section>

            <Section title="Amenities">
              <div className="flex flex-wrap gap-2">
                {project.amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-tint px-3 py-1.5 text-sm font-medium text-text"
                  >
                    <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {a}
                  </span>
                ))}
                {project.shortTermLetting && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-muted">
                    Short-term letting allowed
                  </span>
                )}
              </div>
            </Section>

            <Section title="Location">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <LightProjectMap
                  className="aspect-[16/10] w-full"
                  pins={[{ id: project.slug, lng: project.lng, lat: project.lat, primary: true }]}
                  center={[project.lng, project.lat]}
                  zoom={13.5}
                  fallback={<MapPlaceholder className="aspect-[16/10] w-full" />}
                />
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold text-text">Neighbourhood</h3>
                  <p className="text-sm leading-6 text-text-muted">{project.neighbourhood}</p>
                </div>
              </div>
            </Section>

            {/* Market context + editorial perspective — inserted between Location and Units */}
            <RegionOverview project={project} />

            <EditorialNote project={project} />

            <Section title={`Units (${project.totalUnits})`}>
              <GatedUnits project={project} />
            </Section>

            <TrustBlock project={project} />
          </div>

          {/* Sticky right rail. Top-to-bottom order: compact score summary → Interested
              ("Interested in this project") block. Both sticky together so they travel as
              one CTA cluster while the user scrolls the main column. */}
          <aside>
            <div className="space-y-4 lg:sticky lg:top-20">
              <ProjectScoreSummary project={project} />
              <ProjectActions context={project.name} />
            </div>
          </aside>
        </div>
      </main>

      <PhiButton />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-text">{title}</h2>
      {children}
    </section>
  );
}

/** Compact at-a-glance review block — top of the right rail, above the Interested card.
 *  Public teaser only: stars + numeric score + verdict pill + first sentence of the summary.
 *  The full review (strengths / considerations / criteria breakdown) lives lower on the
 *  page inside EditorialNote and is GATED behind signup — this teaser is what convinces
 *  the user there's an assessment worth unlocking. */
function ProjectScoreSummary({ project }: { project: Project }) {
  const r = project.review;
  /** First sentence of the summary as the short verdict caption. The full multi-sentence
   *  summary lives inside EditorialNote further down (behind the signup gate). */
  const headline = r.summary.split(/(?<=[.!?])\s+/, 1)[0] ?? r.summary;
  return (
    <section
      aria-label="Project assessment summary"
      className="rounded border border-border bg-surface p-4"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
        Invedi score
      </p>
      <div className="mt-2">
        <StarScore score={r.score} size="md" />
      </div>
      <p className="mt-3 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary-dark">
        {r.verdict}
      </p>
      <p className="mt-2.5 text-[13px] leading-snug text-text">{headline}</p>
    </section>
  );
}

function KeyFacts({ project }: { project: Project }) {
  const facts = [
    { label: "Price range", value: formatPriceRange(project.priceMin, project.priceMax) },
    { label: "Total units", value: `${project.totalUnits}` },
    { label: "Area range", value: formatRange(project.areaMin, project.areaMax, " m²") },
    { label: "Bedrooms", value: formatRange(project.bedroomsMin, project.bedroomsMax, " bed") },
  ];
  return (
    <div className="grid grid-cols-2 divide-y divide-border rounded border border-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
      {facts.map((f) => (
        <div key={f.label} className="p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">{f.label}</p>
          <p className="mt-1 text-lg font-semibold text-text">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

function TrustBlock({ project }: { project: Project }) {
  // TODO(open-question): Verification criteria are TBD. These bullets are placeholders for the
  // real checks (developer identity, planning permits, sales mandate, etc.).
  const criteria = ["Developer identity", "Planning permits", "Sales mandate"];
  return (
    <section className="rounded border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <VerifiedBadge verified={project.verified} size="md" />
        <h2 className="text-base font-semibold text-text">
          {project.verified ? "Why this project is verified" : "Verification pending"}
        </h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-text-muted">{project.trustNote}</p>
      {project.verified && (
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {criteria.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm text-text">
              <svg className="h-4 w-4 text-verified" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
