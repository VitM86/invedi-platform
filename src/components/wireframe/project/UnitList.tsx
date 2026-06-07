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

const GRID = "sm:grid-cols-[1.4fr_1fr_0.7fr_0.9fr_1.1fr_auto]";

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
      <div className="hidden text-sm text-text-muted sm:block">Floor {unit.floor}</div>
      <div className="hidden text-sm text-text-muted sm:block">{unit.area} m²</div>
      <div className="text-right font-semibold text-text sm:text-left">{formatPriceFull(unit.price)}</div>
      <div className="flex items-center justify-start gap-3 sm:justify-end">
        <StatusBadge status={unit.status} />
        <svg className="hidden h-4 w-4 text-text-muted sm:block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
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
