/**
 * UnitList — units that live inside a project. Compact rows; each links to the Unit page
 * (/projects/[slug]/units/[id]). Header row on desktop; rows reflow on small screens.
 *
 * The header + row are exported so the gated units view (GatedUnits) renders the EXACT same
 * table — first rows as a public teaser, the rest blurred behind the unlock overlay.
 */

import Link from "next/link";
import type { Project, Unit, UnitStatus } from "@/lib/mock-data";
import { formatPriceFull } from "@/lib/mock-data";
import { ReserveButton } from "../reserve/ReserveButton";

/** Shared column template — used by both the header row and every body row so cells
 *  always land directly under their column headers regardless of what's in the Status /
 *  Action column.
 *
 *  The trailing column is FIXED at 180px (not `auto`). Each row is its own CSS grid
 *  container, so leaving the last track as `auto` made each row size it independently
 *  from its own content — Reserve-button rows ended up wider, Reserved/Sold rows
 *  narrower, and the `fr` columns to the left distributed the remainder differently,
 *  pushing Type / Floor / Area / Price off-grid between rows.
 *
 *  180px is sized to comfortably fit the widest combination (StatusBadge + gap-3 +
 *  ReserveButton at size="sm"). Reserved / Sold rows show StatusBadge + chevron in the
 *  same 180px and stay right-aligned via justify-end. */
const GRID = "sm:grid-cols-[1.4fr_1fr_0.7fr_0.9fr_1.1fr_180px]";

const STATUS_STYLES: Record<UnitStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-surface-tint text-primary-dark" },
  reserved: { label: "Reserved", className: "bg-orange/10 text-orange" },
  sold: { label: "Sold", className: "bg-surface text-text-muted" },
};

export function StatusBadge({ status }: { status: UnitStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

export function UnitsTableHeader() {
  return (
    <div className={`hidden ${GRID} gap-x-4 bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted sm:grid`}>
      <div>Unit</div>
      <div>Type</div>
      <div>Floor</div>
      <div>Area</div>
      <div>Price</div>
      <div className="text-right">Status</div>
    </div>
  );
}

export function UnitRow({ project, unit }: { project: Project; unit: Unit }) {
  const sold = unit.status === "sold";
  return (
    <Link
      href={`/projects/${project.slug}/units/${unit.id}`}
      className={`grid grid-cols-2 items-center gap-x-4 gap-y-1 border-t border-border px-4 py-3 transition-colors hover:bg-surface-tint ${GRID} ${
        sold ? "opacity-60" : ""
      }`}
    >
      <div className="font-semibold text-text">{unit.name}</div>
      <div className="text-sm text-text-muted">{unit.type}</div>
      {/* floor 0 = whole-villa listing — a floor number would be meaningless. */}
      <div className="hidden text-sm text-text-muted sm:block">{unit.floor > 0 ? `Floor ${unit.floor}` : "—"}</div>
      <div className="hidden text-sm text-text-muted sm:block">{unit.area} m²</div>
      <div className="text-right font-semibold text-text sm:text-left">
        {unit.price > 0 ? formatPriceFull(unit.price) : "Price on request"}
      </div>
      <div className="flex items-center justify-start gap-3 sm:justify-end">
        <StatusBadge status={unit.status} />
        {/* On CURATED projects, available units get an inline Reserve trigger. The button
            stops propagation so the row's outer <Link> doesn't navigate. Non-available units
            and non-curated projects fall back to the chevron, preserving the old "click row
            to view detail" affordance. */}
        {project.isCurated && unit.status === "available" ? (
          <ReserveButton project={project} unit={unit} size="sm" />
        ) : (
          <svg className="hidden h-4 w-4 text-text-muted sm:block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </div>
    </Link>
  );
}

export function UnitList({ project }: { project: Project }) {
  return (
    <div className="overflow-hidden rounded border border-border">
      <UnitsTableHeader />
      {project.units.map((u) => (
        <UnitRow key={u.id} project={project} unit={u} />
      ))}
    </div>
  );
}
