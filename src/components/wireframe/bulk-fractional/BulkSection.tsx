"use client";

/**
 * BulkSection — composition + filter orchestrator for the Bulk landing.
 *
 * Owns the BulkFilters state, runs the BULK_LISTINGS through the pure pipeline in
 * bulkFilters.ts, and feeds the same filtered result set to both BulkMarketsGrid (which
 * derives city availability from it) and BulkDealsList (which renders the deals).
 *
 * BulkRequirementsBlock is mounted but its state is captured locally (see that file) —
 * not in BulkFilters, so toggling a requirement doesn't narrow the listings. Founder
 * direction; soft-rank wiring lands in a later pass.
 *
 * Composition order: intro banner → stats (static placeholder per part 2) → requirements
 * → filter bar → markets grid (filter-aware) → deals list (filter-aware) → register form.
 *
 * Register form is the shared RegisterInterestForm — the same component appears at the
 * bottom of FractionalSection. The current Bulk filters are flattened into a
 * contextSnapshot string so a future backend submission would know what was on screen.
 */

import { useMemo, useState } from "react";
import { BulkIntroBanner } from "./BulkIntroBanner";
import { BulkStatsRow } from "./BulkStatsRow";
import { BulkFilterBar } from "./BulkFilterBar";
import { BulkRequirementsBlock } from "./BulkRequirementsBlock";
import { BulkMarketsGrid } from "./BulkMarketsGrid";
import { BulkDealsList } from "./BulkDealsList";
import { RegisterInterestForm } from "./RegisterInterestForm";
import { DEFAULT_BULK_FILTERS, applyBulkFilters, type BulkFilters } from "./bulkFilters";

function bulkContextSnapshot(f: BulkFilters): string {
  const parts: string[] = [];
  if (f.search.trim())     parts.push(`search="${f.search.trim()}"`);
  if (f.marketIds.length)  parts.push(`markets=${f.marketIds.join(",")}`);
  if (f.locations.length)  parts.push(`locations=${f.locations.join(",")}`);
  if (f.delivery !== "any") parts.push(`delivery=${f.delivery}`);
  if (f.status   !== "any") parts.push(`status=${f.status}`);
  if (f.sort     !== "recommended") parts.push(`sort=${f.sort}`);
  return parts.length ? parts.join(" · ") : "no-filters";
}

export function BulkSection() {
  const [filters, setFilters] = useState<BulkFilters>(DEFAULT_BULK_FILTERS);
  const filtered = useMemo(() => applyBulkFilters(filters), [filters]);
  const contextSnapshot = useMemo(() => bulkContextSnapshot(filters), [filters]);

  return (
    <div className="space-y-10 lg:space-y-14">
      <BulkIntroBanner />
      <BulkStatsRow />
      <BulkRequirementsBlock />
      <BulkFilterBar filters={filters} onChange={setFilters} />
      <BulkMarketsGrid listings={filtered} />
      <BulkDealsList listings={filtered} />
      <RegisterInterestForm subSection="bulk" contextSnapshot={contextSnapshot} />
    </div>
  );
}
