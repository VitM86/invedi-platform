"use client";

/**
 * RegionMapLive — the Region overview LEFT column: a light Mapbox map showing the current
 * project (large labelled teal pin) + same-country neighbours (smaller labelled teal pins) +
 * light reference pills, fit to all of them. A small "Expand" button (top-right) opens the
 * dark, tilted satellite bird-view (the existing TerrainMap) as a full-screen drawer.
 *
 * The dark experience is ONLY behind Expand; the inline map stays light to match the page.
 */

import { useEffect, useState } from "react";
import { buildRegionForProject } from "@/lib/regions";
import { TerrainMap } from "@/components/map/TerrainMap";
import type { Project, ReferencePoint } from "@/lib/mock-data";
import { LightProjectMap, type MapPin, type MapRef } from "./LightProjectMap";
import { MapPlaceholder } from "./MapPlaceholder";

export function RegionMapLive({
  project,
  neighbours,
  refs,
}: {
  project: Project;
  neighbours: Project[];
  refs: ReferencePoint[];
}) {
  const [expanded, setExpanded] = useState(false);

  const pins: MapPin[] = [
    { id: project.slug, lng: project.lng, lat: project.lat, label: project.name, primary: true },
    ...neighbours.map((n) => ({ id: n.slug, lng: n.lng, lat: n.lat, label: n.name })),
  ];
  const mapRefs: MapRef[] = refs.map((r) => ({ id: r.id, lng: r.lng, lat: r.lat, label: r.label, travel: r.travel }));

  // Lock scroll + Esc while the bird-view drawer is open.
  useEffect(() => {
    if (!expanded) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return (
    <>
      <LightProjectMap
        className="h-[480px] w-full"
        pins={pins}
        refs={mapRefs}
        fit
        topRight={
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white/95 px-3 py-1.5 text-xs font-semibold text-text shadow-sm transition-colors hover:bg-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15" />
            </svg>
            Bird-view tour
          </button>
        }
        fallback={<MapPlaceholder className="h-[480px] w-full" note="Region map unavailable — static placeholder" />}
      />

      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex items-center justify-between bg-black px-5 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Bird-view region tour — {project.name}</p>
              <p className="text-xs text-white/60">{project.city}, {project.countryLabel} · tilted satellite view</p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Close
            </button>
          </div>
          <div className="relative flex-1">
            <TerrainMap region={buildRegionForProject(project, neighbours, refs)} />
          </div>
        </div>
      )}
    </>
  );
}
