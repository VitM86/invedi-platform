"use client";

/**
 * ReserveButton — the curated-unit trigger that opens the ReserveSheet.
 *
 * Small client island: lets the (server-rendered) UnitList row stay a `<Link>` while a tiny
 * click-target inside it diverts to the reserve flow (stopPropagation + preventDefault so the
 * row's outer link doesn't navigate). The label reflects the unit's current reserve state so
 * a half-finished flow stays discoverable from the table — "Reserve", "Pending", "Pay
 * remaining", "Reserved".
 *
 * Wireframe only — no real payment. See ReserveSheet for the full state machine.
 */

import type { Project, Unit } from "@/lib/mock-data";
import { useReserve } from "./ReserveProvider";

const LABEL_BY_STATE: Record<string, string> = {
  idle: "Reserve",
  fee: "Continue",
  pending: "Pending",
  remaining: "Pay remaining",
  reserved: "Reserved",
  declined: "Reserve",
};

export function ReserveButton({
  project,
  unit,
  size = "sm",
  label: labelOverride,
}: {
  project: Project;
  unit: Unit;
  /** Compact (sm) for table rows; default (md) for hero blocks. */
  size?: "sm" | "md";
  /**
   * Optional fixed label override. The hero CTA on the unit page passes "Reserve" so the
   * primary action reads as the discoverable entry point regardless of how far along the
   * flow the user is. The unit-table rows omit this prop and keep the state-aware label
   * ("Continue" / "Pending" / "Pay remaining" / "Reserved") — that progress indication is
   * useful inline next to other units.
   */
  label?: string;
}) {
  const { openFor, stateOf } = useReserve();
  const state = stateOf(project.slug, unit.id);
  const label = labelOverride ?? LABEL_BY_STATE[state] ?? "Reserve";
  const isTerminal = state === "reserved";

  const baseSm =
    "inline-flex h-8 items-center justify-center rounded px-3 text-[13px] font-semibold transition";
  // md is the hero-block variant — always full-width so it lines up with the secondary link.
  const baseMd =
    "flex h-12 w-full items-center justify-center gap-2 rounded px-5 text-lg font-semibold shadow-sm transition";

  return (
    <button
      type="button"
      onClick={(e) => {
        // Row outer link must not navigate when the user taps Reserve.
        e.preventDefault();
        e.stopPropagation();
        openFor(project, unit);
      }}
      className={`${size === "sm" ? baseSm : baseMd} ${
        isTerminal
          ? "border border-border bg-surface text-text-muted hover:bg-surface"
          : "bg-primary text-white shadow-sm hover:bg-primary-hover"
      }`}
      aria-label={`Reserve ${unit.name}`}
    >
      {label}
    </button>
  );
}
