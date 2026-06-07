"use client";

/**
 * MapView — map-first discovery. STATIC stylised map (no live map library at this stage):
 * a CSS canvas with overlaid project pins positioned by each project's pin.{x,y} percentage.
 *
 * Behaviours from the brief:
 *  - Clustering at zoom-out: a − / + control toggles between country clusters (count bubbles)
 *    and individual pins. Clicking a cluster expands to individual pins.
 *  - Hover/focus on a pin reveals a compact project card (CompactProjectCard).
 *  - Pins differ visually for verified vs unverified projects.
 */

import { useMemo, useState } from "react";
import type { CountryCode, Project } from "@/lib/mock-data";
import { CompactProjectCard } from "../ProjectCard";

const MAP_PIN_PATH =
  "M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z";

function PinMarker({ project }: { project: Project }) {
  return (
    <div
      className="group absolute -translate-x-1/2 -translate-y-full hover:z-30 focus-within:z-30"
      style={{ left: `${project.pin.x}%`, top: `${project.pin.y}%` }}
    >
      <button
        className="block transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
        aria-label={project.name}
      >
        {/* All projects are verified (founder decision) — single teal pin style. */}
        <svg
          className="h-9 w-9 text-primary drop-shadow-md"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="#ffffff"
          strokeWidth={0.75}
        >
          <path fillRule="evenodd" clipRule="evenodd" d={MAP_PIN_PATH} />
        </svg>
      </button>

      {/* Hover/focus popover */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block group-focus-within:block">
        <div className="pointer-events-auto">
          <CompactProjectCard project={project} />
        </div>
      </div>
    </div>
  );
}

function ClusterBubble({
  label,
  count,
  x,
  y,
  onClick,
}: {
  label: string;
  count: number;
  x: number;
  y: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus:outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-primary text-base font-bold text-black shadow-md transition-transform group-hover:scale-110">
        {count}
      </span>
      <span className="mt-1 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-text shadow-sm">
        {label}
      </span>
    </button>
  );
}

export function MapView({ projects }: { projects: Project[] }) {
  const [zoomedIn, setZoomedIn] = useState(false);

  const clusters = useMemo(() => {
    const byCountry = new Map<CountryCode, { label: string; items: Project[] }>();
    projects.forEach((p) => {
      const entry = byCountry.get(p.country) ?? { label: p.countryLabel, items: [] };
      entry.items.push(p);
      byCountry.set(p.country, entry);
    });
    return Array.from(byCountry.entries()).map(([code, { label, items }]) => ({
      code,
      label,
      count: items.length,
      x: items.reduce((s, p) => s + p.pin.x, 0) / items.length,
      y: items.reduce((s, p) => s + p.pin.y, 0) / items.length,
    }));
  }, [projects]);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded border border-border lg:h-[640px]">
      {/* ---- Static stylised map canvas ---- */}
      <div className="absolute inset-0 bg-[#dfeaec]" />
      {/* Landmasses (abstract) */}
      <div className="absolute left-[6%] top-[10%] h-[72%] w-[44%] rounded-[45%] bg-[#eef1ea] shadow-inner" />
      <div className="absolute left-[40%] top-[6%] h-[60%] w-[40%] rounded-[42%] bg-[#eef1ea]" />
      <div className="absolute left-[52%] top-[44%] h-[52%] w-[40%] rounded-[48%] bg-[#eef1ea]" />
      <div className="absolute left-[2%] top-[48%] h-[40%] w-[24%] rounded-[50%] bg-[#eef1ea]" />
      {/* Graticule */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,130,135,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,130,135,0.10) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ---- Pins / clusters ---- */}
      {zoomedIn
        ? projects.map((p) => <PinMarker key={p.slug} project={p} />)
        : clusters.map((c) => (
            <ClusterBubble
              key={c.code}
              label={c.label}
              count={c.count}
              x={c.x}
              y={c.y}
              onClick={() => setZoomedIn(true)}
            />
          ))}

      {/* ---- Zoom control ---- */}
      <div className="absolute right-4 top-4 z-40 flex flex-col overflow-hidden rounded border border-border bg-white shadow-sm">
        <button
          onClick={() => setZoomedIn(true)}
          aria-label="Zoom in — show individual projects"
          className={`flex h-9 w-9 items-center justify-center text-lg font-semibold ${
            zoomedIn ? "text-text-muted" : "text-text hover:bg-surface"
          }`}
        >
          +
        </button>
        <div className="h-px bg-border" />
        <button
          onClick={() => setZoomedIn(false)}
          aria-label="Zoom out — cluster by country"
          className={`flex h-9 w-9 items-center justify-center text-lg font-semibold ${
            zoomedIn ? "text-text hover:bg-surface" : "text-text-muted"
          }`}
        >
          −
        </button>
      </div>

      {/* ---- Static-map caption ---- */}
      <div className="absolute bottom-3 left-4 z-40 rounded bg-white/80 px-2 py-1 text-[11px] text-text-muted">
        Illustrative map — pins overlaid on a static canvas (no live map library at wireframe stage)
      </div>
      <div className="absolute bottom-3 right-4 z-40 rounded bg-white/80 px-2 py-1 text-[11px] font-medium text-text">
        {zoomedIn ? "Individual projects" : "Clustered — click a cluster to expand"}
      </div>
    </div>
  );
}
