/**
 * BulkStatsRow — five summary metrics shown above the filter bar.
 *
 * Euro values are formatted via the shared formatPriceFull (nl-NL period thousands) so the
 * vocabulary matches ProjectCard, /v3 grid, and the rest of the platform. Layout: 2 cols on
 * narrow screens → 3 on sm → 5 on lg, evenly spaced with subtle dividers between columns at
 * lg+ for a "summary band" feel.
 */

import { formatPriceFull } from "@/lib/mock-data";
import { BULK_STATS_RAW } from "./bulkMockData";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-semibold text-text sm:text-[22px]">
        {value}
        {hint && (
          <span className="ml-1.5 text-sm font-medium text-text-muted">{hint}</span>
        )}
      </p>
    </div>
  );
}

export function BulkStatsRow() {
  const s = BULK_STATS_RAW;
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-2xl border border-border bg-background p-6 sm:grid-cols-3 sm:p-8 lg:grid-cols-5 lg:divide-x lg:divide-border lg:gap-y-0 lg:[&>*:not(:first-child)]:pl-6">
      <Stat label="Active deals"      value={`${s.activeDeals}`} />
      <Stat label="Avg. discount"     value={`${s.avgDiscountPct}%`} />
      <Stat label="Exclusive deals"   value={`${s.exclusiveDeals}`} />
      <Stat label="Total deal volume" value={formatPriceFull(s.totalDealVolumeEur)} />
      <Stat label="Discounted volume" value={formatPriceFull(s.discountedVolumeEur)} hint={`(${s.discountedVolumePct}%)`} />
    </div>
  );
}
