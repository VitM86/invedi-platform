"use client";

/**
 * ExploreMap — the unified, LIVE Explore map.
 *
 * Replaces the static CSS-canvas placeholder with a real Mapbox map of Europe: the filtered
 * projects are pinned at their real [lng, lat], hover/focus reveals a compact project card,
 * and the camera fits the filtered set. A "3D tilt" control pitches the camera in place; a
 * "Bird-view region tour" opens the full satellite bird-view by REUSING the existing
 * <TerrainMap> component (imported, not moved/modified — /comporta still owns it).
 *
 * Robustness: if NEXT_PUBLIC_MAPBOX_TOKEN is absent we render the original static <MapView>
 * placeholder instead of a blank canvas, so the page is never broken.
 *
 * Overlay technique mirrors TerrainMap: project each geo point to screen space with
 * map.project() on every camera move and absolutely-position the React overlay there.
 */

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Project } from "@/lib/mock-data";
import { comporta } from "@/lib/regions";
import { TerrainMap } from "@/components/map/TerrainMap";
import { CompactProjectCard } from "../ProjectCard";
import { MapView } from "./MapView";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_PIN_PATH =
  "M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z";

const EUROPE_CENTER: [number, number] = [9, 48];
const EUROPE_ZOOM = 3.4;

type ScreenPt = { x: number; y: number; visible: boolean };

/** Public component: pick live map or static fallback. No hooks here, so the early return is safe. */
export function ExploreMap({ projects }: { projects: Project[] }) {
  if (!TOKEN) return <MapView projects={projects} />;
  return <LiveExploreMap projects={projects} />;
}

function LiveExploreMap({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Hold the map instance in state (not just a ref) so render-time projection reads a value,
  // not ref.current — keeps the react-hooks/refs rule happy.
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pitched, setPitched] = useState(false);
  const [birdView, setBirdView] = useState(false);

  /* ---- Map lifecycle (once) ---- */
  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: EUROPE_CENTER,
      zoom: EUROPE_ZOOM,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
    });
    mapRef.current = map;
    setMapInstance(map);

    const bump = () => setTick((t) => (t + 1) % 1_000_000);
    map.on("load", () => {
      setReady(true);
      bump();
    });
    map.on("move", bump);
    map.on("resize", bump);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
  }, []);

  /* ---- Fit the camera to the filtered set (after load + whenever it changes) ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || projects.length === 0) return;
    if (projects.length === 1) {
      map.flyTo({ center: [projects[0].lng, projects[0].lat], zoom: 6.5, duration: 800 });
      return;
    }
    const bounds = new mapboxgl.LngLatBounds();
    projects.forEach((p) => bounds.extend([p.lng, p.lat]));
    map.fitBounds(bounds, { padding: 90, maxZoom: 6, duration: 800 });
  }, [projects, ready]);

  const map = mapInstance;
  const project = (lng: number, lat: number): ScreenPt => {
    if (!map) return { x: 0, y: 0, visible: false };
    const p = map.project([lng, lat]);
    const c = map.getContainer();
    const margin = 120;
    const visible =
      p.x > -margin && p.x < c.clientWidth + margin && p.y > -margin && p.y < c.clientHeight + margin;
    return { x: p.x, y: p.y, visible };
  };

  void tick; // read so the component re-renders on camera movement

  function toggleTilt() {
    const m = mapRef.current;
    if (!m) return;
    const next = !pitched;
    setPitched(next);
    m.easeTo({ pitch: next ? 55 : 0, duration: 900 });
  }

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded border border-border lg:h-[640px]">
      <div ref={containerRef} className="h-full w-full" />

      {/* Project overlays — pin tip on the geo point, card hanging above on hover/focus */}
      {ready && map && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {projects.map((p) => {
            const s = project(p.lng, p.lat);
            if (!s.visible) return null;
            const active = p.slug === activeId;
            return (
              <div
                key={p.slug}
                className="pointer-events-none absolute inset-0"
                style={{ zIndex: active ? 30 : 21 }}
              >
                {/* Pin */}
                <button
                  className="pointer-events-auto absolute cursor-pointer"
                  style={{ left: s.x, top: s.y, transform: "translate(-50%, -100%)" }}
                  onMouseEnter={() => setActiveId(p.slug)}
                  onFocus={() => setActiveId(p.slug)}
                  onClick={() => setActiveId(p.slug)}
                  aria-label={p.name}
                >
                  {/* All projects are verified (founder decision) — single teal pin style. */}
                  <Pin active={active} />
                </button>

                {/* Compact card on hover/focus, above the pin */}
                {active && (
                  <div
                    className="pointer-events-auto absolute"
                    style={{ left: s.x, top: s.y, transform: "translate(-50%, calc(-100% - 44px))" }}
                    onMouseLeave={() => setActiveId(null)}
                  >
                    <CompactProjectCard project={p} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Controls — top right */}
      <div className="absolute right-4 top-4 z-40 flex flex-col items-end gap-2">
        <button
          onClick={toggleTilt}
          aria-pressed={pitched}
          className={`rounded border px-3 py-1.5 text-sm font-semibold shadow-sm transition-colors ${
            pitched ? "border-primary bg-primary text-white" : "border-border bg-white text-text hover:bg-surface"
          }`}
        >
          {pitched ? "Flat view" : "3D tilt"}
        </button>
        <button
          onClick={() => setBirdView(true)}
          className="rounded border border-border bg-white px-3 py-1.5 text-sm font-semibold text-text shadow-sm transition-colors hover:bg-surface"
        >
          Bird-view region tour ↗
        </button>
      </div>

      {/* Caption */}
      <div className="absolute bottom-3 left-4 z-40 rounded bg-white/85 px-2 py-1 text-[11px] text-text-muted">
        Live map · {projects.length} project{projects.length === 1 ? "" : "s"} in view
      </div>

      {/* Bird-view region drawer — REUSES the existing TerrainMap (imported, unmodified) */}
      {birdView && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex items-center justify-between bg-black px-5 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Bird-view region tour — {comporta.name}</p>
              <p className="text-xs text-white/60">
                Representative 3D region experience. Same engine as the standalone /comporta route.
              </p>
            </div>
            <button
              onClick={() => setBirdView(false)}
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Close
            </button>
          </div>
          <div className="relative flex-1">
            <TerrainMap region={comporta} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Teardrop pin — single teal (primary) style; all platform projects are verified. */
function Pin({ active }: { active?: boolean }) {
  const size = active ? 40 : 34;
  return (
    <svg
      className="text-primary drop-shadow-md transition-transform"
      style={{ height: size, width: size }}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="#ffffff"
      strokeWidth={0.75}
    >
      <path fillRule="evenodd" clipRule="evenodd" d={MAP_PIN_PATH} />
    </svg>
  );
}
