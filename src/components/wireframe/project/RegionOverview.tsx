"use client";

/**
 * RegionOverview — consolidated market-context block on the project page.
 *
 * One region map on top (RegionMapV3: Normal / Satellite / Bird-eye, other-projects toggle,
 * distinct gold current-project pin), then TWO stacked tables below:
 *   - "Projects in the region": the live comparison table (this project + comparables), gated
 *     from the 2nd comparable behind the shared signup gate.
 *   - "Past projects in the region": completed/historical developments (mock), gated from the
 *     2nd row, with a clean empty state when a region has none.
 *
 * Client component so the tables can read useUnlock() — same UnlockProvider flag as every gate.
 */

import {
  getProject,
  projects,
  referencePointsFor,
  pastProjectsFor,
  formatPriceRange,
  type CountryCode,
  type HistoricalProject,
  type Project,
} from "@/lib/mock-data";
import { RegionMapV3 } from "./RegionMapV3";
import { useUnlock } from "../UnlockProvider";
import { SignupCard } from "../SignupBlurGate";

// Top up the comparison set when a country has <4 other projects in the mock data.
const COUNTRY_NEIGHBOURS: Record<CountryCode, CountryCode[]> = {
  NL: ["DE", "FR", "ES", "PT", "GR"],
  DE: ["NL", "FR", "ES", "PT", "GR"],
  FR: ["ES", "NL", "DE", "PT", "GR"],
  ES: ["PT", "FR", "NL", "DE", "GR"],
  PT: ["ES", "FR", "NL", "DE", "GR"],
  GR: ["FR", "ES", "PT", "NL", "DE"],
};

/** Midpoint price ÷ midpoint area, rounded to the nearest €100. */
function pricePerM2(p: Project): number {
  const midPrice = (p.priceMin + p.priceMax) / 2;
  const midArea = (p.areaMin + p.areaMax) / 2;
  return Math.round(midPrice / midArea / 100) * 100;
}

function avgBedrooms(p: Project): string {
  const mean = p.units.reduce((s, u) => s + u.bedrooms, 0) / p.units.length;
  return mean.toFixed(1);
}

/** Current project first, then same-country projects, then nearest countries. Up to 5 rows. */
function comparisonSet(current: Project): Project[] {
  const sameCountry = projects.filter((p) => p.country === current.country && p.slug !== current.slug);
  const fillers = COUNTRY_NEIGHBOURS[current.country].flatMap((cc) => projects.filter((p) => p.country === cc));
  const seen = new Set<string>([current.slug]);
  const others: Project[] = [];
  for (const p of [...sameCountry, ...fillers]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    others.push(p);
  }
  return [current, ...others.slice(0, 4)];
}

/* ------------------------------------------------------------------ */
/* Shared table chrome                                                 */
/* ------------------------------------------------------------------ */

/** Bottom signup overlay covering the blurred (gated) rows. Shared by both tables. */
function GateOverlay({ prompt, sub }: { prompt: string; sub: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-end bg-gradient-to-t from-background via-background/90 to-transparent px-3 pb-4 pt-20">
      <div className="pointer-events-auto w-full max-w-sm">
        <SignupCard prompt={prompt} sub={sub} />
      </div>
    </div>
  );
}

const TH = "px-3 py-2.5";

/* ------------------------------------------------------------------ */
/* Table 1 — Projects in the region (comparison)                       */
/* ------------------------------------------------------------------ */

function ComparisonTable({ current, rows }: { current: Project; rows: Project[] }) {
  const { unlocked } = useUnlock();
  const TEASER_VISIBLE = 2; // this project + first comparable
  const gateFrom = unlocked ? rows.length : Math.min(TEASER_VISIBLE, rows.length);

  return (
    <div>
      <div className="relative overflow-hidden rounded border border-border">
        <table className="w-full min-w-[360px] table-fixed border-collapse text-[13px]">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[14%]" />
            <col className="w-[9%]" />
            <col className="w-[11%]" />
            <col className="w-[22%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-surface text-left text-[10px] font-semibold uppercase text-text-muted [&>th]:overflow-hidden [&>th]:whitespace-nowrap">
              <th className={TH}>Project</th>
              <th className={`${TH} text-right`}>€/m²</th>
              <th className={`${TH} text-right`}>Units</th>
              <th className={`${TH} text-right`}>Beds</th>
              <th className={TH}>Completion</th>
              <th className={`${TH} text-center`} aria-label="Verified">
                <svg aria-hidden className="mx-auto h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const isCurrent = p.slug === current.slug;
              const isGated = i >= gateFrom;
              return (
                <tr
                  key={p.slug}
                  aria-hidden={isGated || undefined}
                  className={`border-t border-border ${isCurrent ? "bg-surface-tint" : ""} ${isGated ? "pointer-events-none select-none [filter:blur(5px)]" : ""}`}
                >
                  <td className={`px-2.5 py-3 ${isCurrent ? "border-l-2 border-primary" : ""}`}>
                    <div className="font-semibold text-text">{p.name}</div>
                    {isCurrent && (
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">This project</div>
                    )}
                    <div className="text-xs text-text-muted">{p.developer} · {p.city}</div>
                  </td>
                  {/* Price-on-request projects have no comparable €/m² — show a dash. */}
                  <td className="px-2.5 py-3 text-right font-medium text-text">
                    {p.priceOnRequest ? "—" : `€${pricePerM2(p).toLocaleString("nl-NL")}`}
                  </td>
                  <td className="px-2.5 py-3 text-right text-text">{p.totalUnits}</td>
                  <td className="px-2.5 py-3 text-right text-text">{avgBedrooms(p)}</td>
                  <td className="px-2.5 py-3 text-text-muted">{p.completion}</td>
                  <td className="px-2.5 py-3 text-center">
                    {p.verified ? (
                      <span title="Verified" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-verified-bg text-verified">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!unlocked && rows.length > TEASER_VISIBLE && (
          <GateOverlay prompt="Sign up to see the full comparison" sub={`See all ${rows.length} projects in this market.`} />
        )}
      </div>
      <p className="mt-2 text-xs italic text-text-muted">
        Comparison based on listed asking prices. Includes both verified and unverified projects for market context.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table 2 — Past projects in the region (historical)                  */
/* ------------------------------------------------------------------ */

function PastProjectsTable({ rows }: { rows: HistoricalProject[] }) {
  const { unlocked } = useUnlock();

  if (rows.length === 0) {
    return (
      <div className="rounded border border-dashed border-border bg-surface/40 px-6 py-10 text-center">
        <p className="text-sm font-semibold text-text">No completed projects tracked in this region yet</p>
        <p className="mt-1 text-sm text-text-muted">As developments complete, they’ll appear here for historical context.</p>
      </div>
    );
  }

  const TEASER_VISIBLE = 1; // first row public, rest gated
  const gateFrom = unlocked ? rows.length : Math.min(TEASER_VISIBLE, rows.length);

  return (
    <div>
      <div className="relative overflow-hidden rounded border border-border">
        <table className="w-full min-w-[360px] table-fixed border-collapse text-[13px]">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[32%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-surface text-left text-[10px] font-semibold uppercase text-text-muted [&>th]:overflow-hidden [&>th]:whitespace-nowrap">
              <th className={TH}>Project</th>
              <th className={`${TH} text-right`}>Completed</th>
              <th className={`${TH} text-right`}>Units</th>
              <th className={`${TH} text-right`}>Price at sale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h, i) => {
              const isGated = i >= gateFrom;
              return (
                <tr
                  key={h.id}
                  aria-hidden={isGated || undefined}
                  className={`border-t border-border ${isGated ? "pointer-events-none select-none [filter:blur(5px)]" : ""}`}
                >
                  <td className="px-2.5 py-3">
                    <div className="font-semibold text-text">{h.name}</div>
                    <div className="text-xs text-text-muted">{h.developer} · {h.region}</div>
                  </td>
                  <td className="px-2.5 py-3 text-right text-text">{h.completedYear}</td>
                  <td className="px-2.5 py-3 text-right text-text">{h.units}</td>
                  <td className="px-2.5 py-3 text-right text-text-muted">
                    {h.priceRangeAtSale ? formatPriceRange(h.priceRangeAtSale[0], h.priceRangeAtSale[1]) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!unlocked && rows.length > TEASER_VISIBLE && (
          <GateOverlay prompt="Sign up to see past projects" sub={`See all ${rows.length} completed projects in this region.`} />
        )}
      </div>
      <p className="mt-2 text-xs italic text-text-muted">
        {/* TODO(data): placeholder historical projects. */}
        Completed developments tracked for market context. Prices reflect asking ranges at time of sale.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function RegionOverview({ project }: { project: Project }) {
  if (!getProject(project.slug)) return null;

  const sameCountry = projects.filter((p) => p.country === project.country && p.slug !== project.slug);
  const rows = comparisonSet(project);
  const past = pastProjectsFor(project);

  return (
    <section id="region-overview">
      <h2 className="mb-1 text-xl font-semibold text-text">Region overview</h2>
      <p className="mb-4 text-sm text-text-muted">
        A wider lens on {project.city} and nearby new-build developments.
      </p>

      {/* One map, full width */}
      <RegionMapV3 project={project} others={sameCountry} refs={referencePointsFor(project)} />

      {/* Two tables, stacked below */}
      <div className="mt-8 space-y-9">
        <div>
          <h3 className="text-base font-semibold text-text">Projects in the region</h3>
          <p className="mb-3 text-sm text-text-muted">How {project.name} compares to other new-builds in {project.region}.</p>
          <ComparisonTable current={project} rows={rows} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-text">Past projects in the region</h3>
          <p className="mb-3 text-sm text-text-muted">Completed developments in {project.region} for historical context.</p>
          <PastProjectsTable rows={past} />
        </div>
      </div>
    </section>
  );
}
