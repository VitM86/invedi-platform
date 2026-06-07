"use client";

/**
 * LightProjectMap — a LIGHT Mapbox map for the Project page (Location + Region overview).
 *
 * Deliberately light-styled (mapbox/light-v11, flat, teal pins, light pills with dark text)
 * so it reads as part of the white/teal platform — the dark satellite bird-view is reserved
 * for the Expand action. Reuses the same Mapbox engine/token as /comporta and the same teal
 * pin shape as Explore. Overlays are React, re-projected to screen space on every camera move
 * (same technique as TerrainMap/ExploreMap).
 *
 * Graceful fallback: if NEXT_PUBLIC_MAPBOX_TOKEN is missing, renders a static light placeholder
 * (never a blank/broken map). Interaction: drag + scroll-zoom on, rotate off (calm "where is it").
 */

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_PIN_PATH =
  "M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z";

export interface MapPin {
  id: string;
  lng: number;
  lat: number;
  label?: string;
  primary?: boolean;
}

export interface MapRef {
  id: string;
  lng: number;
  lat: number;
  label: string;
  travel?: string;
}

type ScreenPt = { x: number; y: number; visible: boolean };

interface Props {
  className?: string;
  pins: MapPin[];
  refs?: MapRef[];
  /** Fit camera to all pins (region map). If false, use center+zoom (location map). */
  fit?: boolean;
  center?: [number, number];
  zoom?: number;
  /** Rendered top-right over the map (e.g. the Expand button). */
  topRight?: React.ReactNode;
  /** Light static fallback when the token is missing. */
  fallback: React.ReactNode;
}

export function LightProjectMap(props: Props) {
  if (!TOKEN) return <>{props.fallback}</>;
  return <LiveLightMap {...props} />;
}

function LiveLightMap({ className = "", pins, refs = [], fit = false, center, zoom = 13.5, topRight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const m = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center ?? [pins[0]?.lng ?? 0, pins[0]?.lat ?? 0],
      zoom,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
    });
    // Calm interaction: keep pan + scroll-zoom, disable rotation/pitch gestures.
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
    return () => {
      m.remove();
      mapRef.current = null;
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fit to pins (region map) once loaded / when pins change.
  useEffect(() => {
    if (!map || !ready || !fit || pins.length === 0) return;
    if (pins.length === 1) {
      map.flyTo({ center: [pins[0].lng, pins[0].lat], zoom, duration: 0 });
      return;
    }
    const b = new mapboxgl.LngLatBounds();
    pins.forEach((p) => b.extend([p.lng, p.lat]));
    refs.forEach((r) => b.extend([r.lng, r.lat]));
    map.fitBounds(b, { padding: 70, maxZoom: 14, duration: 600 });
  }, [map, ready, fit, pins, refs, zoom]);

  const project = (lng: number, lat: number): ScreenPt => {
    if (!map) return { x: 0, y: 0, visible: false };
    const p = map.project([lng, lat]);
    const c = map.getContainer();
    const margin = 120;
    const visible =
      p.x > -margin && p.x < c.clientWidth + margin && p.y > -margin && p.y < c.clientHeight + margin;
    return { x: p.x, y: p.y, visible };
  };

  return (
    <div className={`relative overflow-hidden rounded border border-border ${className}`}>
      <div ref={containerRef} className="h-full w-full" />

      {ready && map && (
        <div className="pointer-events-none absolute inset-0">
          {/* Reference pills (light) */}
          {refs.map((r) => {
            const s = project(r.lng, r.lat);
            if (!s.visible) return null;
            return (
              <div
                key={r.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: s.x, top: s.y, zIndex: 5 }}
              >
                <span className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border bg-white/95 px-2 py-0.5 text-[11px] font-medium text-text shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {r.label}
                  {r.travel && <span className="text-text-muted">· {r.travel}</span>}
                </span>
              </div>
            );
          })}

          {/* Project pins (teal) with labels */}
          {pins.map((p) => {
            const s = project(p.lng, p.lat);
            if (!s.visible) return null;
            const size = p.primary ? 38 : 26;
            return (
              <div
                key={p.id}
                className="absolute flex flex-col items-center"
                style={{ left: s.x, top: s.y, transform: "translate(-50%, -100%)", zIndex: p.primary ? 20 : 10 }}
              >
                {p.label && (
                  <span
                    className={`mb-1 max-w-[160px] truncate rounded-full border border-border bg-white/95 px-2 py-0.5 text-[11px] shadow-sm ${
                      p.primary ? "font-semibold text-text" : "font-medium text-text-muted"
                    }`}
                  >
                    {p.label}
                  </span>
                )}
                <svg
                  className="text-primary drop-shadow"
                  style={{ height: size, width: size }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="#ffffff"
                  strokeWidth={0.75}
                >
                  <path fillRule="evenodd" clipRule="evenodd" d={MAP_PIN_PATH} />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {topRight && <div className="absolute right-3 top-3 z-30">{topRight}</div>}
    </div>
  );
}
