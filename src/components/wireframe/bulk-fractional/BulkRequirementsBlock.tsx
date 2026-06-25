"use client";

/**
 * BulkRequirementsBlock — three binary preference pairs from the PDF.
 *
 * Decision: state is CAPTURED, not wired to filtering. Reason:
 *   - Mock listings don't carry letting policy or operator-presence fields yet.
 *   - These reads more like buyer preferences for downstream ranking ("if a project
 *     matches my requirements bump it up") than hard filters that hide inventory.
 *   - Adding three more strict filter dimensions on top of the eight existing ones makes
 *     it trivially easy to land in an empty state with one accidental click.
 *
 * Once the data model gets letting/operator fields, flip these to act as soft scores in
 * the sort step (extend sortListings in bulkFilters.ts) rather than strict matchers.
 *
 * // TODO: wire requirements to filtering / soft-ranking once data supports it.
 * // TODO(copy): founder to refine each pair's wording.
 */

import { useState } from "react";

type RequirementChoice = "off" | "left" | "right";

type RequirementPair = {
  id: string;
  left: string;
  right: string;
};

const PAIRS: RequirementPair[] = [
  { id: "construction",  left: "Off-plan / Under construction", right: "Already finished / Constructed" },
  { id: "letting",       left: "Only +1 year letting",          right: "Short-term letting (must)" },
  { id: "operator",      left: "No manager/operator in place",  right: "Manager/operator in place" },
];

export function BulkRequirementsBlock() {
  const [choices, setChoices] = useState<Record<string, RequirementChoice>>(() =>
    Object.fromEntries(PAIRS.map((p) => [p.id, "off" as RequirementChoice])),
  );

  const select = (id: string, side: "left" | "right") => {
    setChoices((prev) => ({ ...prev, [id]: prev[id] === side ? "off" : side }));
  };

  return (
    <section className="rounded-2xl border border-border bg-background p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-lg font-semibold text-text sm:text-xl">Requirements</h3>
        <p className="text-xs text-text-muted">
          Captured for ranking — does not filter listings yet.
        </p>
      </div>

      <ul className="mt-5 space-y-3">
        {PAIRS.map((p) => {
          const value = choices[p.id];
          return (
            <li key={p.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr]">
              <Choice
                label={p.left}
                selected={value === "left"}
                onClick={() => select(p.id, "left")}
              />
              <Choice
                label={p.right}
                selected={value === "right"}
                onClick={() => select(p.id, "right")}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Choice({
  label, selected, onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-12 w-full items-center justify-between gap-3 rounded-lg border px-4 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-text"
          : "border-border bg-white text-text-muted hover:border-text hover:text-text"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-primary bg-primary" : "border-border bg-white"
        }`}
        aria-hidden
      >
        {selected && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        )}
      </span>
    </button>
  );
}
