/**
 * BulkDealsList — filtered bulk listings as compact horizontal rows.
 *
 * Sits below the markets grid; renders the actual listings the filters narrow down to.
 * Row style is cards-stacked-vertical, not the same as ProjectCard (those are tile-style
 * with hero images). A bulk deal is a contract opportunity, not a product card — so the
 * layout privileges metrics (discount %, volume, price/unit, units) over imagery.
 *
 * Empty state: a clean "No deals match your filters" card with a hint to widen them.
 */

import type { BulkListing, BulkListingStatus } from "./bulkMockData";
import { formatPriceFull } from "@/lib/mock-data";

const STATUS_LABEL: Record<BulkListingStatus, string> = {
  available:    "Available",
  "under-offer": "Under offer",
  reserved:     "Reserved",
};

const STATUS_PILL: Record<BulkListingStatus, string> = {
  available:    "bg-primary/10 text-primary-dark",
  "under-offer": "bg-orange/10 text-orange",
  reserved:     "bg-surface text-text-muted",
};

function DeliveryLabel({ delivery }: { delivery: string }) {
  return delivery === "ready" ? <>Ready</> : <>{delivery}</>;
}

function DealCard({ listing }: { listing: BulkListing }) {
  return (
    <li className="rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Identity */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_PILL[listing.status]}`}>
              {STATUS_LABEL[listing.status]}
            </span>
            <span className="text-xs text-text-muted">
              {listing.city} · {listing.location}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-text">{listing.project}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {listing.totalUnits} units · Delivery <DeliveryLabel delivery={listing.delivery} />
          </p>
        </div>

        {/* Metrics — 4-up at sm+; grid at narrow */}
        <div className="grid grid-cols-2 gap-4 sm:flex sm:items-start sm:gap-8">
          <Metric label="Discount" value={`${listing.discountPct}%`} accent />
          <Metric label="Price / unit" value={formatPriceFull(listing.pricePerUnitEur)} />
          <Metric label="Volume" value={formatPriceFull(listing.totalVolumeEur)} />
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

export function BulkDealsList({ listings }: { listings: BulkListing[] }) {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-text sm:text-2xl">
          {listings.length === 0 ? "Deals" : `Deals (${listings.length})`}
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
      <p className="mt-3 text-base font-semibold text-text">No deals match your filters</p>
      <p className="mt-1.5 text-sm text-text-muted">
        Try widening price, delivery, or markets — or clear filters to start over.
      </p>
    </div>
  );
}
