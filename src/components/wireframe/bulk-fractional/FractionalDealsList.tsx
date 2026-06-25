/**
 * FractionalDealsList — filtered fractional listings as compact rows.
 *
 * Shape mirrors BulkDealsList so the two sub-sections feel like siblings — same row
 * cards, same empty state vocabulary. Metric set differs to fit the fractional product:
 *   - Min ticket (per-share entry price)
 *   - Total asset value
 *   - Shares (available / total)
 *
 * Tags carry the categoryLabel + tenure/operator flags so a glance is enough to know
 * what the deal is.
 */

import { formatPriceFull } from "@/lib/mock-data";
import { FRACTIONAL_CATEGORIES, FRACTIONAL_COUNTRIES, type FractionalListing } from "./fractionalMockData";

function tenureLabel(t: FractionalListing["tenure"]) {
  return t === "freehold" ? "Freehold" : "Leasehold";
}

function operatorLabel(o: FractionalListing["operator"]) {
  return o === "own" ? "Own operations" : "External operator";
}

function DealCard({ listing }: { listing: FractionalListing }) {
  const category = FRACTIONAL_CATEGORIES.find((c) => c.id === listing.categoryId)?.label ?? listing.categoryId;
  const country  = FRACTIONAL_COUNTRIES.find((c) => c.id === listing.countryId)?.country ?? listing.countryId;
  return (
    <li className="rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Identity */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary-dark">
              {category}
            </span>
            <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-text-muted">
              {tenureLabel(listing.tenure)}
            </span>
            <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-text-muted">
              {operatorLabel(listing.operator)}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-text">{listing.assetName}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {country} · {listing.location}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 sm:flex sm:items-start sm:gap-8">
          <Metric label="Min ticket" value={formatPriceFull(listing.minShareEur)} accent />
          <Metric label="Asset value" value={formatPriceFull(listing.totalAssetValueEur)} />
          <Metric label="Shares" value={`${listing.availableShares} / ${listing.totalShares}`} />
        </div>
      </div>
    </li>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className={`mt-1 text-base font-semibold ${accent ? "text-primary-dark" : "text-text"} sm:text-lg`}>
        {value}
      </p>
    </div>
  );
}

export function FractionalDealsList({ listings }: { listings: FractionalListing[] }) {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">
          {listings.length === 0 ? "Opportunities" : `Opportunities (${listings.length})`}
        </h2>
      </div>

      {listings.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => (
            <DealCard key={l.id} listing={l} />
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <svg
        className="mx-auto h-8 w-8 text-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
      </svg>
      <p className="mt-3 text-base font-semibold text-text">No opportunities match your selection</p>
      <p className="mt-1.5 text-sm text-text-muted">
        Try widening the params or deselect a category / country.
      </p>
    </div>
  );
}
