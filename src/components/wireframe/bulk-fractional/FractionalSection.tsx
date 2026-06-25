"use client";

/**
 * FractionalSection — Fractional landing composition + filter-state owner.
 *
 * Owns a single FractionalFilters object and runs FRACTIONAL_LISTINGS through the pure
 * pipeline (applyFractionalFilters). Category + country selections feed straight into
 * filters.categoryIds and filters.countryIds, and the params block (max volume,
 * flexibility, type, ranges) refines further.
 *
 * Composition order: intro banner → category grid → country grid → params block → deals
 * list. Reads top-down: pick what you're looking for, then refine the constraints, then
 * see results.
 *
 * BulkSection's structure inspired this orchestrator (single filter object owned at the
 * section root, sub-components are controlled). Kept locally typed rather than sharing a
 * generic so the two sub-sections evolve independently.
 */

import { useMemo, useState } from "react";
import { FractionalIntroBanner } from "./FractionalIntroBanner";
import { FractionalCategoryGrid } from "./FractionalCategoryGrid";
import { FractionalCountryGrid } from "./FractionalCountryGrid";
import { FractionalParamsBlock } from "./FractionalParamsBlock";
import { FractionalDealsList } from "./FractionalDealsList";
import {
  DEFAULT_FRACTIONAL_FILTERS,
  applyFractionalFilters,
  type FractionalFilters,
} from "./fractionalFilters";

export function FractionalSection() {
  const [filters, setFilters] = useState<FractionalFilters>(DEFAULT_FRACTIONAL_FILTERS);

  const toggleId = (key: "categoryIds" | "countryIds", id: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));

  const listings = useMemo(() => applyFractionalFilters(filters), [filters]);

  return (
    <div className="space-y-10 lg:space-y-14">
      <FractionalIntroBanner />
      <FractionalCategoryGrid
        selected={filters.categoryIds}
        onToggle={(id) => toggleId("categoryIds", id)}
      />
      <FractionalCountryGrid
        selected={filters.countryIds}
        onToggle={(id) => toggleId("countryIds", id)}
      />
      <FractionalParamsBlock filters={filters} onChange={setFilters} />
      <FractionalDealsList listings={listings} />
    </div>
  );
}
