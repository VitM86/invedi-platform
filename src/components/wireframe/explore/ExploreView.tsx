"use client";

/**
 * ExploreView — client orchestrator for the Overview / Discovery screen (/explore).
 *
 * Three modes: Regions (default, guided narrowing via pictograms) · Map (spatial browse) ·
 * Grid (see-everything escape hatch). Filter-bar state is shared across all modes; region
 * SELECTION state lives here too so it survives a Map/Grid round-trip, though Map/Grid don't
 * read it (modes are independent per the founder's current decision).
 */

import { useMemo, useState } from "react";
import { projects, type CountryCode } from "@/lib/mock-data";
import { SiteHeader } from "../SiteHeader";
import { FilterBar } from "./FilterBar";
import { FilterButton } from "./FilterButton";
import { FilterSheet } from "./FilterSheet";
import { ExploreMap } from "./ExploreMap";
import { GridView } from "./GridView";
import { RegionsView } from "./RegionsView";
import { ViewToggle } from "./ViewToggle";
import { activeFilterCount, DEFAULT_FILTERS, type Filters, type ViewMode } from "./types";

function matchesFilters(p: (typeof projects)[number], f: Filters): boolean {
  if (f.countries.length > 0 && !f.countries.includes(p.country)) return false;
  if (f.regions.length > 0 && !f.regions.includes(p.region)) return false;

  // Price: project range must overlap the selected [min, max] band.
  if (p.priceMax < f.priceMin || p.priceMin > f.priceMax) return false;

  // Bedrooms / area are "at least" filters against the project's top of range.
  if (f.bedrooms > 0 && p.bedroomsMax < f.bedrooms) return false;
  if (f.areaMin > 0 && p.areaMax < f.areaMin) return false;

  if (f.completion !== "any") {
    if (f.completion === "ready" && p.completionYear !== null) return false;
    if (f.completion === "2026" && p.completionYear !== 2026) return false;
    if (f.completion === "2027" && p.completionYear !== 2027) return false;
    if (f.completion === "2028+" && (p.completionYear === null || p.completionYear < 2028))
      return false;
  }

  // Amenities: project must include every selected amenity.
  if (f.amenities.length > 0 && !f.amenities.every((a) => p.amenities.includes(a)))
    return false;

  if (f.shortTermOnly && !p.shortTermLetting) return false;

  return true;
}

export function ExploreView({ initialView = "regions" }: { initialView?: ViewMode }) {
  const [view, setView] = useState<ViewMode>(initialView);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Region-navigator selection (Regions mode). Lives here so it survives a Map/Grid toggle.
  const [expandedCountries, setExpandedCountries] = useState<CountryCode[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Mobile filter sheet open state.
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilters(p, filters)),
    [filters],
  );
  const activeCount = activeFilterCount(filters);

  function toggleCountry(code: CountryCode) {
    setExpandedCountries((prev) => {
      if (prev.includes(code)) {
        // Collapsing a country also drops its region selections (can't see what you can't show).
        setSelectedRegions((rs) => rs.filter((id) => !id.startsWith(`${code.toLowerCase()}-`)));
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  }

  function toggleRegion(id: string) {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const headingCopy =
    view === "regions"
      ? "Start by choosing countries and regions — projects appear once you narrow down. Or switch to the map or the full grid."
      : "New-build developments across Europe. Browse the map or the full grid, then open a project to see its units.";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1440px] px-6 py-6 lg:px-10">
        {/* Page heading */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-text">Explore projects</h1>
          <p className="mt-0.5 max-w-2xl text-sm text-text-muted">{headingCopy}</p>
        </div>

        {/* Desktop: inline filter bar. Mobile: collapsed into the Filters button below. */}
        <div className="hidden md:block">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* Result count + (mobile filter button) + view toggle.
            flex-wrap so the controls drop to their own line on narrow screens (no overflow). */}
        <div className="mb-4 mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className="text-sm text-text-muted">
            Showing <span className="font-semibold text-text">{filtered.length}</span> of{" "}
            {projects.length} projects
          </p>
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <FilterButton count={activeCount} onClick={() => setSheetOpen(true)} />
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {view === "regions" ? (
          // Regions mode always shows the navigator (the grid-on-selection handles empty
          // filtered sets with its own message); it is not blanked by a 0-result filter.
          <RegionsView
            filtered={filtered}
            selectedRegions={selectedRegions}
            onToggleRegion={toggleRegion}
            expandedCountries={expandedCountries}
            onToggleCountry={toggleCountry}
            onClear={() => setSelectedRegions([])}
          />
        ) : filtered.length === 0 ? (
          <EmptyState onReset={() => setFilters(DEFAULT_FILTERS)} />
        ) : view === "map" ? (
          <ExploreMap projects={filtered} />
        ) : (
          <GridView projects={filtered} />
        )}
      </main>

      {/* Mobile filter sheet (controls identical to the desktop bar) */}
      <FilterSheet
        open={sheetOpen}
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-border bg-surface px-6 py-20 text-center">
      <p className="text-base font-semibold text-text">No projects match these filters</p>
      <p className="mt-1 max-w-sm text-sm text-text-muted">
        Try widening the price range, clearing amenities, or choosing a different region.
      </p>
      <button
        onClick={onReset}
        className="mt-4 rounded border border-border px-4 py-2 text-sm font-medium text-text hover:bg-background"
      >
        Clear all filters
      </button>
    </div>
  );
}
