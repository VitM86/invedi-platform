"use client";

/**
 * RegionOverview — market-context layer for the project page (inserted between Location and
 * Units). Left: a LIVE light Mapbox map (RegionMapLive) with the project + same-country
 * neighbours + reference pills, and an Expand → dark bird-view. Right: a comparison table of
 * nearby new-builds.
 *
 * Now a client component (was a server component) so the ComparisonTable can read
 * useUnlock() — the gated rows (project + first comparable visible, rest blurred behind
 * a signup prompt) share the same UnlockProvider flag as the rest of the platform's
 * signup-style gates. Data prep is pure mock-data lookup, no SSR-only APIs needed.
 */

import { getProject, projects, referencePointsFor, type CountryCode, type Project } from "@/lib/mock-data";
import { RegionMapLive } from "./RegionMapLive";
import { useUnlock } from "../UnlockProvider";
import { SignupCard } from "../SignupBlurGate";

// Rough geographic ordering used only to top up the comparison set when a country has <3
// other projects in the mock data.
// TODO(open-question): region scoping currently uses COUNTRY. Should it be city / radius
// instead? The map shows same-country pins; the table tops up from nearest countries.
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

/** Current project first (highlighted), then same-country projects, then nearest countries. */
function comparisonSet(current: Project): Project[] {
  const sameCountry = projects.filter((p) => p.country === current.country && p.slug !== current.slug);
  const fillers = COUNTRY_NEIGHBOURS[current.country].flatMap((cc) =>
    projects.filter((p) => p.country === cc),
  );
  const seen = new Set<string>([current.slug]);
  const others: Project[] = [];
  for (const p of [...sameCountry, ...fillers]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    others.push(p);
  }
  return [current, ...others.slice(0, 4)]; // 5 rows total
}

function ComparisonTable({ current, rows }: { current: Project; rows: Project[] }) {
  const { unlocked } = useUnlock();
  // First TEASER_VISIBLE rows are always public: the project's own row + the first
  // comparable. Everything after is gated behind the signup overlay until the session
  // is unlocked — Crunchbase / PitchBook style "show enough to demonstrate value".
  const TEASER_VISIBLE = 2;
  const gateFrom = unlocked ? rows.length : TEASER_VISIBLE;

  return (
    <div>
      {/* `relative` lets the absolute overlay sit on the lower (blurred) rows. `overflow-
          hidden` lets the gradient/card respect the rounded corners cleanly. */}
      <div className="relative overflow-hidden rounded border border-border">
        <table className="w-full min-w-[380px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-2.5 py-2.5">Project</th>
              <th className="px-2 py-2.5 text-right">€/m²</th>
              <th className="px-2 py-2.5 text-right">Units</th>
              <th className="px-2 py-2.5 text-right">Avg&nbsp;beds</th>
              <th className="px-2 py-2.5">Completion</th>
              <th className="px-2 py-2.5 text-center">Verified</th>
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
                  className={`border-t border-border ${isCurrent ? "bg-surface-tint" : ""} ${
                    isGated ? "pointer-events-none select-none [filter:blur(5px)]" : ""
                  }`}
                >
                  <td className={`px-2.5 py-3 ${isCurrent ? "border-l-2 border-primary" : ""}`}>
                    <div className="font-semibold text-text">{p.name}</div>
                    {isCurrent && (
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                        This project
                      </div>
                    )}
                    <div className="text-xs text-text-muted">
                      {p.developer} · {p.city}
                    </div>
                  </td>
                  <td className="px-2.5 py-3 text-right font-medium text-text">
                    €{pricePerM2(p).toLocaleString("nl-NL")}
                  </td>
                  <td className="px-2.5 py-3 text-right text-text">{p.totalUnits}</td>
                  <td className="px-2.5 py-3 text-right text-text">{avgBedrooms(p)}</td>
                  <td className="px-2.5 py-3 text-text-muted">{p.completion}</td>
                  <td className="px-2.5 py-3 text-center">
                    {p.verified ? (
                      <span
                        title="Verified"
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-verified-bg text-verified"
                      >
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

        {/* Signup overlay — covers the lower (blurred) rows with a fade-in gradient and the
            signup card. Positioned at the bottom so the visible rows remain legible and the
            card sits naturally in the gated zone. TODO(copy): founder to refine prompt. */}
        {!unlocked && rows.length > TEASER_VISIBLE && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-end bg-gradient-to-t from-background via-background/90 to-transparent px-3 pb-4 pt-20">
            <div className="pointer-events-auto w-full max-w-sm">
              <SignupCard
                prompt="Sign up to see the full comparison"
                sub={`See all ${rows.length} projects in this market.`}
              />
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs italic text-text-muted">
        Comparison based on listed asking prices. Includes both verified and unverified projects
        for market context.
      </p>
    </div>
  );
}

export function RegionOverview({ project }: { project: Project }) {
  // Defensive: project always exists here, but keep types happy if called standalone.
  if (!getProject(project.slug)) return null;

  const sameCountry = projects.filter((p) => p.country === project.country && p.slug !== project.slug);
  const rows = comparisonSet(project);

  return (
    <section>
      <h2 className="mb-1 text-xl font-semibold text-text">Region overview</h2>
      <p className="mb-4 text-sm text-text-muted">
        A wider lens on {project.city} and nearby new-build developments.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RegionMapLive project={project} neighbours={sameCountry} refs={referencePointsFor(project)} />

        <div>
          <h3 className="text-base font-semibold text-text">
            How this project compares in {project.region}
          </h3>
          <p className="mb-3 text-sm text-text-muted">Other new-build developments in the area</p>
          <ComparisonTable current={project} rows={rows} />
        </div>
      </div>
    </section>
  );
}
