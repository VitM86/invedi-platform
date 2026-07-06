"use client";

/**
 * RegionsView — the Airbnb-style pictogram navigator (new default Explore mode).
 *
 * Flow: Level 1 country cards (multi-select). Selecting a country expands its Level 2 region
 * cards (also multi-select, across countries). Once ≥1 region is selected, a project grid
 * surfaces below — filtered to the selected regions AND the top filter bar — and the page
 * scrolls to it. Empty regions (0 projects) render muted and are not selectable.
 *
 * Selection state is owned by ExploreView (so it survives a Map/Grid round-trip), but Map and
 * Grid modes do not read it — they stay independent per the founder's current decision.
 */

import { useEffect, useRef } from "react";
import {
  countriesWithRegions,
  countryProjectCount,
  regionProjectCount,
  regionName,
  type CountryCode,
  type Project,
  type RegionDef,
} from "@/lib/mock-data";
import { ProjectCard } from "../ProjectCard";
import { RegionImage } from "./RegionImage";

function CheckBadge() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </span>
  );
}

function CountryCard({
  code,
  label,
  image,
  selected,
  onClick,
}: {
  code: CountryCode;
  label: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}) {
  const count = countryProjectCount(code);
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative h-44 overflow-hidden rounded-2xl border text-left transition-all ${
        selected ? "border-primary ring-2 ring-primary" : "border-border hover:shadow-md"
      }`}
    >
      <RegionImage
        src={image}
        label={label}
        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      {selected && <div className="absolute right-3 top-3"><CheckBadge /></div>}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold leading-tight text-white drop-shadow">{label}</h3>
        <p className="text-sm font-medium text-white/85 drop-shadow">
          {count} project{count === 1 ? "" : "s"}
        </p>
      </div>
    </button>
  );
}

function RegionCard({
  region,
  selected,
  onClick,
}: {
  region: RegionDef;
  selected: boolean;
  onClick: () => void;
}) {
  const count = regionProjectCount(region.id);
  const empty = count === 0;
  // TODO(open-question): empty regions are shown muted + non-selectable so the structure feels
  // real. Confirm with founder whether to hide them entirely instead.
  return (
    <button
      onClick={empty ? undefined : onClick}
      aria-pressed={selected}
      disabled={empty}
      className={`group relative h-28 overflow-hidden rounded-2xl border text-left transition-all ${
        empty
          ? "cursor-not-allowed border-border opacity-50"
          : selected
            ? "border-primary ring-2 ring-primary"
            : "border-border hover:shadow-md"
      }`}
    >
      <RegionImage
        src={region.image}
        label={region.name}
        className={`absolute inset-0 h-full w-full transition-transform duration-500 ${
          empty ? "grayscale" : "group-hover:scale-105"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      {selected && <div className="absolute right-2 top-2"><CheckBadge /></div>}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h4 className="text-sm font-bold leading-tight text-white drop-shadow">{region.name}</h4>
        <p className="text-xs font-medium text-white/85 drop-shadow">
          {empty ? "Coming soon" : `${count} project${count === 1 ? "" : "s"}`}
        </p>
      </div>
    </button>
  );
}

/** Scrolls itself into view on mount + plays the reveal animation. */
function GridReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return (
    <div ref={ref} className="animate-reveal scroll-mt-24">
      {children}
    </div>
  );
}

export function RegionsView({
  filtered,
  selectedRegions,
  onToggleRegion,
  expandedCountries,
  onToggleCountry,
  onClear,
}: {
  filtered: Project[];
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  expandedCountries: CountryCode[];
  onToggleCountry: (code: CountryCode) => void;
  onClear: () => void;
}) {
  const selectedSet = new Set(selectedRegions);
  const gridProjects = filtered.filter((p) => selectedSet.has(p.regionId));
  const expandedDefs = countriesWithRegions.filter((c) => expandedCountries.includes(c.code));

  return (
    <div>
      {/* Level 1 — countries */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {countriesWithRegions.map((c) => (
          <CountryCard
            key={c.code}
            code={c.code}
            label={c.label}
            image={c.image}
            selected={expandedCountries.includes(c.code)}
            onClick={() => onToggleCountry(c.code)}
          />
        ))}
      </div>

      {/* Level 2 — regions of each expanded country */}
      {expandedDefs.length > 0 && (
        <div className="mt-8 space-y-6">
          {expandedDefs.map((c) => (
            <div key={c.code}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
                {c.label} — regions
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {c.regions.map((r) => (
                  <RegionCard
                    key={r.id}
                    region={r}
                    selected={selectedSet.has(r.id)}
                    onClick={() => onToggleRegion(r.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid — surfaces only once ≥1 region is selected */}
      {selectedRegions.length > 0 && (
        <GridReveal>
          <div className="mt-10 border-t border-border pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">
                Showing <span className="font-semibold text-text">{gridProjects.length}</span>{" "}
                project{gridProjects.length === 1 ? "" : "s"} in{" "}
                <span className="font-medium text-text">
                  {selectedRegions.map(regionName).join(", ")}
                </span>
              </p>
              <button
                onClick={onClear}
                className="flex-shrink-0 rounded border border-border px-3 py-1.5 text-sm font-semibold text-text hover:bg-surface"
              >
                Clear selection
              </button>
            </div>

            {gridProjects.length === 0 ? (
              <div className="rounded border border-dashed border-border bg-surface px-6 py-16 text-center">
                <p className="text-sm font-semibold text-text">No projects match here</p>
                <p className="mt-1 text-sm text-text-muted">
                  The selected regions have no projects matching the current filters. Adjust the
                  filters above or pick another region.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {gridProjects.map((p) => (
                  // showScore: explore surfaces the Invedi star badge, same as /v3.
                  <ProjectCard key={p.slug} project={p} showScore />
                ))}
              </div>
            )}
          </div>
        </GridReveal>
      )}
    </div>
  );
}
