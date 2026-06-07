"use client";

/**
 * FilterButton — mobile/narrow trigger that opens the FilterSheet. Shows a sliders icon and a
 * live active-filter count ("Filters · 3"). Sits next to the view toggle on small screens.
 */

export function FilterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
        count > 0 ? "border-primary bg-primary/10 text-text" : "border-border bg-white text-text"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
      </svg>
      Filters{count > 0 ? ` · ${count}` : ""}
    </button>
  );
}
