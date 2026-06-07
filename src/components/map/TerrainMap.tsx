"use client";

/**
 * TerrainMap — the interactive terrain + bird-view map.
 *
 * Approach: Mapbox GL renders the satellite "ground" with real 3D terrain, opened on an
 * oblique (pitched) camera so it reads like a drone shot. Everything on top — project pins,
 * cards, POI pills, gateway chips, the drive-time filter, the country minimap — is React,
 * absolutely positioned in screen space. On every camera move we re-project each geo point
 * with map.project() and re-place its overlay, so the UI tracks the live map while staying
 * fully React-styled (hover, active state, theming).
 *
 * White-label: the whole experience is driven by one Region object (see lib/regions.ts).
 */

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Region } from "@/lib/regions";
import { DRIVE_TIME_BANDS } from "@/lib/regions";
import {
  DriveTimeFilter,
  ExpandIcon,
  GatewayChip,
  Minimap,
  PoiDot,
  PoiPill,
  ProjectCard,
  ProjectMarkerLabel,
  ProjectPin,
} from "./overlays";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type ScreenPt = { x: number; y: number; visible: boolean };

export function TerrainMap({ region }: { region: Region }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // Mirror the map in state so render-time projection reads a value (not ref.current).
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0); // bumped on every camera move → triggers re-projection
  // Cards are COLLAPSED by default — null means no card open; only pins + name labels show.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [band, setBand] = useState<number | null>(null);
  // desktop hover vs touch tap — lazy init (no card is open initially, so no hydration diff).
  // Touch-capable or coarse-pointer devices use tap (and show the card's close X).
  const [hoverable] = useState(() => {
    if (typeof window === "undefined") return true;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const touch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
    return !coarse && !touch;
  });
  const closeTimer = useRef<number | undefined>(undefined);

  // Hover-intent: opening cancels any pending close; leaving schedules a short close so the
  // pointer can travel the small gap from pin to card without the card vanishing.
  const openCard = (id: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveId(id);
  };
  const toggleCard = (id: string) => setActiveId((cur) => (cur === id ? null : id));
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveId(null), 90);
  };

  /* ---- Map lifecycle ---- */
  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    // On a tall, narrow phone screen, pull the camera back a touch so more of the region reads.
    const narrow = window.innerWidth < 768;
    const cam = narrow
      ? {
          center: region.camera.center,
          zoom: region.camera.zoom - 0.9,
          pitch: Math.min(region.camera.pitch, 56),
          bearing: region.camera.bearing,
        }
      : region.camera;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
      maxPitch: 75,
      attributionControl: true,
      antialias: true,
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
    // Tapping empty map (not a pin/overlay) closes any open card.
    map.on("click", () => setActiveId(null));

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
  }, [region]);

  /* ---- Project a geo point to screen space (used during render) ---- */
  const map = mapInstance;
  const project = (lng: number, lat: number): ScreenPt => {
    if (!map) return { x: 0, y: 0, visible: false };
    const p = map.project([lng, lat]);
    const c = map.getContainer();
    const margin = 80;
    const visible =
      p.x > -margin && p.x < c.clientWidth + margin && p.y > -margin && p.y < c.clientHeight + margin;
    return { x: p.x, y: p.y, visible };
  };

  const dimmed = (driveMin: number) => band !== null && driveMin > band;

  // `tick` is read so this component re-renders on camera movement.
  void tick;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b1418]">
      {/* Mapbox canvas. NOTE: mapbox-gl.css forces `.mapboxgl-map { position: relative }`,
          which (loading after Tailwind) overrides `absolute`, collapsing an `inset-0` box to
          0 height → blank canvas. So size it with an explicit full height instead. */}
      <div ref={containerRef} className="h-full w-full" />

      {!TOKEN && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 text-center">
          <div className="max-w-md rounded-xl border border-white/15 bg-black/70 p-6 text-white/85">
            <p className="font-semibold">Mapbox token missing</p>
            <p className="mt-2 text-sm text-white/65">
              Add <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
              <code className="rounded bg-white/10 px-1">.env.local</code> and restart the dev server.
            </p>
          </div>
        </div>
      )}

      {/* Overlay layer — clicks pass through to the map except on interactive children */}
      {ready && map && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* --- POIs (dot at the point, pill above it) --- */}
          {region.pois.map((poi) => {
            const s = project(poi.lng, poi.lat);
            if (!s.visible) return null;
            return (
              // POIs yield to project labels: only the dot shows by default; the pill (name +
              // travel time) reveals BELOW on hover (desktop). Hidden on mobile — dots remain
              // and the gateway strip carries travel context there. This guarantees project
              // labels never collide with POI pills at the default collapsed zoom.
              <div
                key={poi.id}
                className="group pointer-events-auto absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: s.x, top: s.y }}
              >
                <PoiDot />
                <div className="absolute left-1/2 top-full hidden -translate-x-1/2 translate-y-1 sm:group-hover:block">
                  <PoiPill name={poi.name} kind={poi.kind} driveMin={poi.driveMin} dimmed={dimmed(poi.driveMin)} />
                </div>
              </div>
            );
          })}

          {/* --- Projects: collapsed = pin + name label; full card only when active --- */}
          {region.projects.map((p) => {
            const s = project(p.lng, p.lat);
            if (!s.visible) return null;
            const active = p.id === activeId;
            const hoverProps = hoverable
              ? { onMouseEnter: () => openCard(p.id), onMouseLeave: scheduleClose }
              : {};
            return (
              // Projects sit ABOVE POIs (higher z) so a project always wins a tight overlap.
              <div key={p.id} style={{ zIndex: active ? 40 : 30, position: "absolute", inset: 0 }} className="pointer-events-none">
                {active ? (
                  <>
                    {/* Pin: tip sits exactly on the geo point */}
                    <div
                      className="pointer-events-auto absolute cursor-pointer"
                      style={{ left: s.x, top: s.y, transform: "translate(-50%, -100%)" }}
                      {...hoverProps}
                    >
                      <button onClick={() => toggleCard(p.id)} aria-label={p.name} className="block">
                        <ProjectPin active />
                      </button>
                    </div>
                    {/* Full card hangs below the point */}
                    <div
                      className="pointer-events-auto absolute"
                      style={{ left: s.x, top: s.y + 6, transform: "translateX(-50%)" }}
                      {...hoverProps}
                    >
                      <ProjectCard
                        project={p}
                        active
                        dimmed={dimmed(p.driveMin)}
                        onActivate={() => openCard(p.id)}
                        onClose={hoverable ? undefined : () => setActiveId(null)}
                      />
                    </div>
                  </>
                ) : (
                  // Collapsed: name label stacked ABOVE the pin, pin tip on the geo point.
                  <div
                    className="pointer-events-auto absolute flex flex-col items-center"
                    style={{ left: s.x, top: s.y, transform: "translate(-50%, -100%)" }}
                    {...hoverProps}
                  >
                    <ProjectMarkerLabel name={p.name} onClick={() => toggleCard(p.id)} />
                    <button onClick={() => toggleCard(p.id)} aria-label={p.name} className="block cursor-pointer">
                      <ProjectPin active={false} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- Fixed chrome (independent of the camera) --- */}

      {/* Title — sits below the top-left corner so a page-level back control (e.g. the
          /comporta "← Explore" pill) can stack above it without overlapping. */}
      <div className="pointer-events-none absolute left-4 top-16 z-30 md:left-7 md:top-20">
        <h1 className="text-2xl font-semibold leading-none tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-4xl">
          {region.name}
        </h1>
        <p className="mt-1 text-xs text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] md:text-sm">{region.country}</p>
      </div>

      {/* Expand Map */}
      <button
        className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 py-2 pl-3 pr-4 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70 md:right-7 md:top-6 md:py-2.5 md:pl-4 md:pr-5"
        onClick={() => mapRef.current?.flyTo({ center: region.camera.center, zoom: region.camera.zoom - 1.3, pitch: 50, bearing: 0, duration: 1400 })}
      >
        <ExpandIcon />
        <span className="hidden sm:inline">Expand Map</span>
      </button>

      {/* Mobile: compact gateway strip (travel-time context) just above the time filter */}
      <div className="pointer-events-auto absolute bottom-[4.5rem] left-1/2 z-30 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 gap-2 overflow-x-auto sm:hidden">
        {region.gateways.slice(0, 2).map((g) => (
          <GatewayChip key={g.id} gateway={g} compact />
        ))}
      </div>

      {/* Desktop: gateway chips pinned to edges (mobile uses the compact strip above) */}
      {region.gateways.map((g) => {
        const base = "pointer-events-auto absolute z-30 hidden sm:block";
        const style: React.CSSProperties =
          g.edge === "top"
            ? { top: 24, left: `${g.position * 100}%`, transform: "translateX(-50%)" }
            : g.edge === "bottom"
              ? { bottom: 24, left: `${g.position * 100}%`, transform: "translateX(-50%)" }
              : g.edge === "left"
                ? { left: 24, top: `${g.position * 100}%`, transform: "translateY(-50%)" }
                : { right: 24, top: `${g.position * 100}%`, transform: "translateY(-50%)" };
        return (
          <div key={g.id} className={base} style={style}>
            <GatewayChip gateway={g} />
          </div>
        );
      })}

      {/* Drive-time filter — desktop: bottom-left; mobile: centered bottom strip (scrolls if narrow) */}
      <div className="absolute bottom-4 left-1/2 z-30 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-x-auto md:bottom-6 md:left-7 md:max-w-none md:translate-x-0">
        <DriveTimeFilter bands={DRIVE_TIME_BANDS} active={band} onSelect={setBand} />
      </div>

      {/* Country minimap — PT-shaped, so hidden for synthetic non-PT regions; also hidden on
          phones to keep the bottom edge clear for the time filter */}
      {!region.hideMinimap && (
        <div className="absolute bottom-6 right-7 z-30 hidden sm:block">
          <Minimap label={region.name} locator={region.locator} />
        </div>
      )}
    </div>
  );
}
