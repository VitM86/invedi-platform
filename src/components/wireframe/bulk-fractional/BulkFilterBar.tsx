"use client";

/**
 * BulkFilterBar — visual-only placeholder filter bar. NON-functional at this stage.
 *
 * TODO: wire filters in part 3. Part 3 will:
 *   - lift the filter state into BulkFractionalView (mirroring ExploreView's pattern),
 *   - feed it to an actual results component (markets / deals list),
 *   - and likely promote this into a typed FilterBar with a real Filters type.
 *
 * Visual style mirrors the Explore FilterBar:
 *   - h-10 white-bg rounded pills with text-text + chevron-down for control buttons,
 *   - h-10 white-bg rounded pill with magnifier icon for the search input,
 *   - desktop layout: search (flex-1) + Sort on the right; pill row below.
 *
 * Pills are <button> elements so a11y stays sane (tabbable, focusable) even while inert; they
 * just have no onClick yet.
 */

function ChevDown() {
  return (
    <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-10 items-center gap-1.5 rounded border border-border bg-white px-3 text-sm font-medium text-text outline-none transition-colors hover:bg-surface"
    >
      {children}
      <ChevDown />
    </button>
  );
}

export function BulkFilterBar() {
  return (
    <div className="space-y-3">
      {/* Row 1: search (wide) + sort (right). Stacks on narrow screens. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search cities, locations, projects…"
            disabled
            className="h-10 w-full rounded border border-border bg-white pl-9 pr-3 text-sm text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-90"
          />
        </div>
        <button
          type="button"
          className="flex h-10 items-center gap-1.5 self-start rounded border border-border bg-white px-3 text-sm font-medium text-text transition-colors hover:bg-surface sm:self-auto"
        >
          <span className="text-text-muted">Sort:</span>
          Recommended
          <ChevDown />
        </button>
      </div>

      {/* Row 2: filter pills. Horizontal on desktop, wraps on narrow. */}
      <div className="flex flex-wrap gap-2">
        <FilterPill>Markets</FilterPill>
        <FilterPill>Any location</FilterPill>
        <FilterPill>Any delivery</FilterPill>
        <FilterPill>Any status</FilterPill>
      </div>
    </div>
  );
}
