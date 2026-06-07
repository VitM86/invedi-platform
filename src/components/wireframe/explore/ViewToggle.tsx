"use client";

/**
 * ViewToggle — Map / Grid switch for /explore. Primary (teal) active pill. Map is the default
 * (discovery is map-first); Plan/List style views belong inside a project, not at the
 * marketplace overview level.
 */

import type { ViewMode } from "./types";

const OPTIONS: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    value: "regions",
    label: "Regions",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 16 4.5-4.5 4 4 3-3 5.5 5.5" />
        <circle cx="8" cy="9" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: "map",
    label: "Map",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75 3.75 4.5v12.75L9 19.5m0-12.75 6 2.25m-6-2.25v12.75m6-10.5 5.25-2.25V16.5L15 18.75m0-12.75v12.75" />
      </svg>
    ),
  },
  {
    value: "grid",
    label: "Grid",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25Zm9.75-9.75A2.25 2.25 0 0 1 15.75 3.75H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
];

export function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-surface p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={view === opt.value}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors sm:px-3.5 ${
            view === opt.value
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
          aria-label={opt.label}
        >
          {opt.icon}
          {/* Icon-only under sm so the toggle + Filters button fit a 390px row */}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
