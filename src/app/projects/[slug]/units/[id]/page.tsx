import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProject,
  getUnit,
  buildUnitSpecs,
  projects,
  formatPriceFull,
  type UnitStatus,
} from "@/lib/mock-data";
import { ImageGallery } from "@/components/ImageGallery";
import { MortgageWidget } from "@/components/MortgageWidget";
import { AppHeader } from "@/components/wireframe/AppHeader";
import { SalesSheetProvider } from "@/components/wireframe/SalesSheetProvider";
import { UnitHeroCtas, AdvisorCard } from "@/components/wireframe/unit/UnitCtas";
import { ReserveCtas } from "@/components/wireframe/reserve/ReserveCtas";
import { PhiButton } from "@/components/wireframe/PhiButton";
import { projectImages } from "@/lib/images";

export function generateStaticParams() {
  return projects.flatMap((p) => p.units.map((u) => ({ slug: p.slug, id: u.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  const project = getProject(slug);
  const unit = getUnit(slug, id);
  return {
    title: project && unit ? `${unit.name} · ${project.name} — Invedi` : "Unit — Invedi",
  };
}

const STATUS_STYLES: Record<UnitStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-surface-tint text-primary-dark" },
  reserved: { label: "Reserved", className: "bg-orange/10 text-orange" },
  sold: { label: "Sold", className: "bg-surface text-text-muted" },
};

// TODO(open-question): should individual unit pages also require unlock? Currently accessible —
// the units gate (GatedUnits + UnlockProvider) only obscures the project-page units table; direct
// navigation to a unit page is not blocked. Revisit once the gating model is finalised.
export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const project = getProject(slug);
  const unit = project ? getUnit(slug, id) : undefined;
  if (!project || !unit) notFound();

  const specs = buildUnitSpecs(unit, project);
  const status = STATUS_STYLES[unit.status];
  const description = `${unit.type} on floor ${unit.floor}. ${unit.area} m² with ${unit.bedrooms} bedroom${unit.bedrooms > 1 ? "s" : ""} and ${unit.bathrooms} bathroom${unit.bathrooms > 1 ? "s" : ""}. Energy label ${unit.energyLabel}. (Placeholder description.)`;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <SalesSheetProvider context={`${project.name} › ${unit.name}`}>
        <main className="mx-auto max-w-[1440px] px-6 py-6 lg:px-16">
          {/* Breadcrumb — shows project context */}
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-text-muted">
            <Link href="/explore" className="hover:text-text">
              Explore
            </Link>
            <span>›</span>
            <Link href={`/projects/${project.slug}`} className="hover:text-text">
              {project.name}
            </Link>
            <span>›</span>
            <span className="text-text">{unit.name}</span>
          </nav>

          {/* Hero: gallery + summary */}
          <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ImageGallery images={projectImages(project.slug, 5)} unitName={unit.name} />

            <div>
              <div className="mb-1 flex items-start justify-between gap-3">
                <h1 className="text-4xl font-bold leading-10 text-text">{unit.name}</h1>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <p className="mb-3 text-sm text-text-muted">
                {project.name} · {unit.floor > 0 ? `Floor ${unit.floor}` : unit.type} · {project.city}, {project.countryLabel}
              </p>

              <div className="mb-4">
                <span className="text-4xl font-semibold text-primary-dark">
                  {unit.price > 0 ? formatPriceFull(unit.price) : "Price on request"}
                </span>
              </div>

              <p className="mb-5 text-lg leading-7 text-text">{description}</p>

              {/* Property chips */}
              <div className="mb-6 grid grid-cols-3 gap-2">
                <Chip icon="bed" label={`${unit.bedrooms} bedrooms`} />
                <Chip icon="bath" label={`${unit.bathrooms} bathrooms`} />
                <Chip icon="area" label={`${unit.area} m²`} />
                {unit.floor > 0 && <Chip icon="floors" label={`Floor ${unit.floor}`} />}
                {unit.balconyArea && <Chip icon="balcony" label={`${unit.balconyArea} m² balcony`} />}
                {unit.terraceArea && <Chip icon="terrace" label={`${unit.terraceArea} m² terrace`} />}
              </div>

              {/* CTAs — branch on `project.isCurated`. Curated units lead with Reserve
                  (the two-step paid flow); non-curated keep the legacy advisor/pack pair. */}
              {project.isCurated ? (
                <ReserveCtas project={project} unit={unit} />
              ) : (
                <UnitHeroCtas />
              )}
            </div>
          </div>

          {/* Specifications */}
          <section className="mb-10">
            <h2 className="mb-6 text-2xl font-medium text-text">Specifications</h2>
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              <div className="space-y-8">
                <SpecTable title="General" data={specs.general} />
                <SpecTable title="Energy" data={specs.energy} />
              </div>
              <div className="space-y-8">
                <SpecTable title="Specs" data={specs.specs} />
                <SpecTable title="Optional costs" data={specs.optionalCosts} />
                <SpecTable title="Timeline" data={specs.timeline} />
              </div>
            </div>
          </section>

          {/* Mortgage calculator (buyer-side tool) + advisor card. Price-on-request units have
              no number to calculate against — the widget is hidden, the advisor card stays. */}
          <section className="mb-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {unit.price > 0 && (
              <MortgageWidget
                propertyPrice={unit.price}
                country={project.country}
                energyLabel={unit.energyLabel}
              />
            )}
            <AdvisorCard />
          </section>
        </main>
      </SalesSheetProvider>

      <PhiButton />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded bg-surface px-3 py-2 text-sm font-medium text-text">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/icon-${icon}.svg`} alt="" className="h-4 w-4 flex-shrink-0" />
      {label}
    </span>
  );
}

function SpecTable({ title, data }: { title: string; data: Record<string, string> }) {
  return (
    <div>
      <h3 className="mb-0 text-base font-semibold text-text">{title}</h3>
      {/* Teal divider under section title */}
      <div className="mb-3 mt-1 h-0.5 bg-primary" />
      <div className="space-y-0">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="flex items-start justify-between border-b border-border py-2 text-sm font-semibold"
          >
            <span className="text-text-muted">{key}</span>
            <span className="max-w-[55%] text-right text-text">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
