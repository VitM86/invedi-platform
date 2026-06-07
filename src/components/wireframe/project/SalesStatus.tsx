/**
 * SalesStatus — public preview summary near the top of the project page. Shows the high-level
 * sales signals that are meant to inspire interest WITHOUT gating: units for sale, when sales
 * started, and how much is sold (a small progress bar). Everything here is public.
 *
 * `salesStarted` and `percentSold` are display-only mock values (see salesStatusFor); units /
 * available are real counts. Plain server component.
 */

import { salesStatusFor, type Project } from "@/lib/mock-data";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-text">{value}</p>
      {sub && <p className="text-xs text-text-muted">{sub}</p>}
    </div>
  );
}

export function SalesStatus({ project }: { project: Project }) {
  const { unitsForSale, available, percentSold, salesStarted } = salesStatusFor(project);

  return (
    <div className="rounded border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Stat label="Units for sale" value={`${unitsForSale} units`} sub={`${available} available`} />
          <Stat label="Sales started" value={salesStarted} />
        </div>

        <div className="w-full sm:w-60">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wide text-text-muted">Sold</span>
            <span className="text-sm font-semibold text-text">{percentSold}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${percentSold}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
