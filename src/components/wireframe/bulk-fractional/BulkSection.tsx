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
 * → filter bar → markets grid (filter-aware) → deals list (filter-aware).
 */

import { useMemo, useState } from "react";
import { BulkIntroBanner } from "./BulkIntroBanner";
import { BulkStatsRow } from "./BulkStatsRow";
import { BulkFilterBar } from "./BulkFilterBar";
import { BulkRequirementsBlock } from "./BulkRequirementsBlock";
import { BulkMarketsGrid } from "./BulkMarketsGrid";
import { BulkDealsList } from "./BulkDealsList";
import { DEFAULT_BULK_FILTERS, applyBulkFilters, type BulkFilters } from "./bulkFilters";

export function BulkSection() {
  const [filters, setFilters] = useState<BulkFilters>(DEFAULT_BULK_FILTERS);
  const filtered = useMemo(() => applyBulkFilters(filters), [filters]);

  return (
    <div className="space-y-10 lg:space-y-14">
      <BulkIntroBanner />
      <BulkStatsRow />
      <BulkRequirementsBlock />
      <BulkFilterBar filters={filters} onChange={setFilters} />
      <BulkMarketsGrid listings={filtered} />
      <BulkDealsList listings={filtered} />
    </div>
  );
}
