"use client";

/**
 * RegionMapV3 — the single consolidated region map for the project page.
 *
 * Replaces the old duplicate maps (Location + Region overview). One Mapbox instance with:
 *   - View switcher: Normal (light) / Satellite (flat) / Bird eye (tilted standard-satellite,
 *     the same treatment as the Comporta bird-view).
 *   - Show-other-projects toggle: OFF → only the current project; ON → all same-region projects
 *     as teal pins with a checkmark state badge.
 *   - The CURRENT project always shows a distinct GOLD pin (larger, haloed) so it's traceable
 *     in every mode, per the founder's Douro Terraces example.
 *
 * Overlays are React, re-projected on every camera move (same technique as LightProjectMap).
 * Graceful fallback: no NEXT_PUBLIC_MAPBOX_TOKEN → static MapPlaceholder (never a broken map).
 */

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Project, ReferencePoint } from "@/lib/mock-data";
import { MapPlaceholder } from "./MapPlaceholder";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_PIN_PATH =
  "M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z";

type ViewMode = "normal" | "satellite" | "bird";

const STYLES: Record<ViewMode, string> = {
  normal: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  bird: "mapbox://styles/mapbox/standard-satellite",
};
const CAMERA: Record<ViewMode, { pitch: number; bearing: number }> = {
  normal: { pitch: 0, bearing: 0 },
  satellite: { pitch: 0, bearing: 0 },
  bird: { pitch: 55, bearing: -18 },
};
const VIEW_LABELS: { key: ViewMode; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "satellite", label: "Satellite" },
  { key: "bird", label: "Bird eye" },
];

type ScreenPt = { x: number; y: number; visible: boolean };

export function RegionMapV3({
  project,
  others,
  refs = [],
  className = "h-[460px] w-full sm:h-[520px]",
}: {
  project: Project;
  others: Project[];
  refs?: ReferencePoint[];
  className?: string;
}) {
  if (!TOKEN) {
    return <MapPlaceholder className={className} note="Region map unavailable — static placeholder" />;
  }
  return <LiveRegionMap project={project} others={others} refs={refs} className={className} />;
}

function LiveRegionMap({
  project,
  others,
  refs,
  className,
}: {
  project: Project;
  others: Project[];
  refs: ReferencePoint[];
  className: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [, setTick] = useState(0);

  const [view, setView] = useState<ViewMode>("normal");
  const [showOthers, setShowOthers] = useState(true);

  // Init once.
  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const m = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLES.normal,
      center: [project.lng, project.lat],
      zoom: 12,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
    });
    m.dragRotate.disable();
    m.touchZoomRotate.disableRotation();
    mapRef.current = m;
    setMap(m);
    const bump = () => setTick((t) => (t + 1) % 1_000_000);
    m.on("load", () => {
      setReady(true);
      bump();
    });
    m.on("move", bump);
    m.on("resize", bump);
    m.on("style.load", bump);
    return () => {
      m.remove();
      mapRef.current = null;
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fit to the visible pins (current + others when shown, + refs).
  useEffect(() => {
    if (!map || !ready) return;
    const pts: [number, number][] = [[project.lng, project.lat]];
    if (showOthers) others.forEach((o) => pts.push([o.lng, o.lat]));
    refs.forEach((r) => pts.push([r.lng, r.lat]));
    if (pts.length === 1) {
      map.easeTo({ center: pts[0], zoom: 12.5, duration: 500 });
    } else {
      const b = new mapboxgl.LngLatBounds();
      pts.forEach((p) => b.extend(p));
      map.fitBounds(b, { padding: 80, maxZoom: 13.5, pitch: CAMERA[view].pitch, bearing: CAMERA[view].bearing, duration: 600 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, showOthers]);

  // View change → swap style + tilt.
  useEffect(() => {
    if (!map || !ready) return;
    map.setStyle(STYLES[view]);
    map.easeTo({ pitch: CAMERA[view].pitch, bearing: CAMERA[view].bearing, duration: 800 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const project2 = (lng: number, lat: number): ScreenPt => {
    if (!map) return { x: 0, y: 0, visible: false };
    const p = map.project([lng, lat]);
    const c = map.getContainer();
    const margin = 140;
    const visible = p.x > -margin && p.x < c.clientWidth + margin && p.y > -margin && p.y < c.clientHeight + margin;
    return { x: p.x, y: p.y, visible };
  };

  const dark = view !== "normal";

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      <div ref={containerRef} className="h-full w-full" />

      {ready && map && (
        <div className="pointer-events-none absolute inset-0">
          {/* Reference pills */}
          {refs.map((r) => {
            const s = project2(r.lng, r.lat);
            if (!s.visible) return null;
            return (
              <div key={r.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: s.x, top: s.y, zIndex: 5 }}>
                <span className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border bg-white/95 px-2 py-0.5 text-[11px] font-medium text-text shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {r.label}
                </span>
              </div>
            );
          })}

          {/* Other-project pins (teal, checkmark badge) — only when toggled on */}
          {showOthers &&
            others.map((o) => {
              const s = project2(o.lng, o.lat);
              if (!s.visible) return null;
              return (
                <div key={o.slug} className="absolute flex flex-col items-center" style={{ left: s.x, top: s.y, transform: "translate(-50%, -100%)", zIndex: 10 }}>
                  <span className="mb-1 max-w-[150px] truncate rounded-full border border-border bg-white/95 px-2 py-0.5 text-[11px] font-medium text-text-muted shadow-sm">
                    {o.name}
                  </span>
                  <span className="relative">
                    <svg className="text-primary drop-shadow" style={{ height: 28, width: 28 }} viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth={0.9}>
                      <path fillRule="evenodd" clipRule="evenodd" d={MAP_PIN_PATH} />
                    </svg>
                    {/* Checkmark state indicator */}
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-verified text-white shadow-sm">
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                  </span>
                </div>
              );
            })}

          {/* CURRENT project — distinct GOLD, larger, haloed. Always on top, always shown. */}
          {(() => {
            const s = project2(project.lng, project.lat);
            if (!s.visible) return null;
            return (
              <div className="absolute flex flex-col items-center" style={{ left: s.x, top: s.y, transform: "translate(-50%, -100%)", zIndex: 30 }}>
                <span className="mb-1 whitespace-nowrap rounded-full bg-[#2E2A22] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                  {project.name} · This project
                </span>
                <span className="relative flex items-center justify-center">
                  {/* Soft halo so the gold pin separates from any background/style. */}
                  <span className="absolute bottom-1 h-3 w-3 rounded-full bg-black/25 blur-[3px]" />
                  <svg className="drop-shadow-md" style={{ height: 46, width: 46, color: "#B0842A" }} viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth={1.1}>
                    <path fillRule="evenodd" clipRule="evenodd" d={MAP_PIN_PATH} />
                  </svg>
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* View switcher — top-left segmented control */}
      <div className="absolute left-3 top-3 z-40 inline-flex rounded-full border border-border bg-white/95 p-0.5 shadow-sm backdrop-blur">
        {VIEW_LABELS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            aria-pressed={view === v.key}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
              view === v.key ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Other-projects toggle — top-right */}
      <button
        type="button"
        onClick={() => setShowOthers((v) => !v)}
        aria-pressed={showOthers}
        className="absolute right-3 top-3 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-text shadow-sm backdrop-blur"
      >
        <span
          className={`relative inline-flex h-4 w-7 flex-none items-center rounded-full transition-colors ${
            showOthers ? "bg-primary" : "bg-border"
          }`}
        >
          <span className={`absolute h-3 w-3 rounded-full bg-white shadow transition-transform ${showOthers ? "translate-x-3.5" : "translate-x-0.5"}`} />
        </span>
        Other projects
      </button>

      {/* Legend — bottom-left */}
      <div className={`absolute bottom-3 left-3 z-40 flex items-center gap-3 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur ${dark ? "bg-black/55 text-white" : "bg-white/95 text-text"}`}>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#B0842A" }} />
          This project
        </span>
        {showOthers && (
          <span className={`inline-flex items-center gap-1.5 ${dark ? "text-white/80" : "text-text-muted"}`}>
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Other projects
          </span>
        )}
      </div>
    </div>
  );
}
