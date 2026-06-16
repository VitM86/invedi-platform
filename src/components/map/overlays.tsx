"use client";

/**
 * overlays.tsx — presentational overlay pieces for the terrain bird-view map.
 *
 * These are pure UI: TerrainMap positions them in screen space (from map.project of each
 * geo point) and owns all state. Styling mirrors the reference: dark glass surfaces, a warm
 * gold accent for pins / the active project, thin hairline borders, soft shadows.
 */

import type { PoiKind, RegionGateway, RegionProject } from "@/lib/regions";
import { formatPriceRangeM } from "@/lib/regions";

export const GOLD = "#E5A23C";

/* ------------------------------------------------------------------ */
/* Icons (16px, currentColor)                                          */
/* ------------------------------------------------------------------ */

const ico = "h-3.5 w-3.5 shrink-0";

function UnitsIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 9h18M9 3v18" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 12.5 20 3 10.5" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </svg>
  );
}
function WaveIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M2 14c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <path d="M3 11h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <circle cx="7" cy="14" r="0.6" /><circle cx="17" cy="14" r="0.6" />
    </svg>
  );
}
function ArrowIcon({ edge }: { edge: RegionGateway["edge"] }) {
  const rot = { top: "0deg", right: "90deg", bottom: "180deg", left: "270deg" }[edge];
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot})` }}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}
export function ExpandIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
    </svg>
  );
}

const POI_ICON: Record<PoiKind, () => React.ReactElement> = {
  beach: WaveIcon,
  village: BuildingIcon,
  town: CarIcon,
};

/* ------------------------------------------------------------------ */
/* Project pin — gold teardrop, tip at the geo point                   */
/* ------------------------------------------------------------------ */

export function ProjectPin({ active }: { active: boolean }) {
  return (
    <svg
      width={30}
      height={40}
      viewBox="0 0 30 40"
      className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] transition-transform"
      style={{ transform: active ? "scale(1.12)" : "scale(1)" }}
    >
      <path
        d="M15 0C6.7 0 0 6.7 0 15c0 10.3 13.4 23.6 14 24.2.6.6 1.4.2 2-.4C16.7 38.4 30 25.3 30 15 30 6.7 23.3 0 15 0z"
        fill={GOLD}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={0.5}
      />
      <circle cx="15" cy="15" r="5.4" fill="#fff" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Project card — dark glass; active gets gold border + gold title     */
/* ------------------------------------------------------------------ */

export function ProjectCard({
  project,
  active,
  dimmed,
  onActivate,
  onClose,
}: {
  project: RegionProject;
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
  /** When provided (touch), renders a close (X) button on the card. */
  onClose?: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      className="relative block w-[280px] max-w-[78vw] cursor-pointer rounded-2xl p-2.5 text-left backdrop-blur-md transition-all sm:w-[300px]"
      style={{
        background: "rgba(18,18,20,0.88)",
        border: `1px solid ${active ? GOLD : "rgba(255,255,255,0.12)"}`,
        boxShadow: active
          ? `0 12px 32px rgba(0,0,0,0.55), 0 0 0 1px ${GOLD}55`
          : "0 10px 28px rgba(0,0,0,0.45)",
        opacity: dimmed ? 0.45 : 1,
      }}
    >
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#161618] text-white/80 shadow-lg"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <div className="flex gap-3">
        {/* Render-placeholder (no real photography at wireframe stage) */}
        <div
          className="h-[88px] w-[104px] shrink-0 rounded-xl"
          style={{ background: `linear-gradient(135deg, ${project.swatch[0]}, ${project.swatch[1]})` }}
        />
        <div className="min-w-0 flex-1 pr-1">
          <h3
            className="text-[15px] font-semibold leading-tight"
            style={{ color: active ? GOLD : "#fff" }}
          >
            {project.name}
          </h3>
          <dl className="mt-2 space-y-1 text-[12.5px] text-white/80">
            <Row icon={<UnitsIcon />} value={`${project.available} of ${project.units} units available`} />
            <Row icon={<CalendarIcon />} value={`${project.completion}`} />
            <Row icon={<TagIcon />} value={formatPriceRangeM(project.priceFrom, project.priceTo)} />
          </dl>
        </div>
      </div>
    </div>
  );
}

/**
 * ProjectMarkerLabel — the COLLAPSED state of a project: a small dark-glass chip with the
 * project name, sitting just under the pin. Tapping/hovering it surfaces the full ProjectCard.
 */
export function ProjectMarkerLabel({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mb-1 block max-w-[190px] rounded-xl px-3 py-1.5 text-center text-[12px] font-medium leading-tight text-white backdrop-blur-md transition-colors"
      style={{
        background: "rgba(18,18,20,0.82)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.45)",
      }}
    >
      {/* Full project name — wraps to 2 lines if needed, never truncated. */}
      {name}
    </button>
  );
}

function Row({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/55">{icon}</span>
      <dd>{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* POI pill — icon + name + drive time                                 */
/* ------------------------------------------------------------------ */

export function PoiPill({ name, kind, driveMin, dimmed }: { name: string; kind: PoiKind; driveMin: number; dimmed: boolean }) {
  const Icon = POI_ICON[kind];
  return (
    <div
      className="flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-2.5 pr-3 text-[12px] backdrop-blur-md transition-opacity"
      style={{
        background: "rgba(18,18,20,0.82)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
        opacity: dimmed ? 0.35 : 1,
      }}
    >
      <span className="text-white/70"><Icon /></span>
      <span className="font-medium leading-tight text-white">{name}</span>
      <span className="leading-tight text-white/55">· {driveMin} min</span>
    </div>
  );
}

/* A small connector dot drawn at the exact geo point under a pill. */
export function PoiDot() {
  return <span className="block h-2 w-2 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.25)]" />;
}

/* ------------------------------------------------------------------ */
/* Gateway chip — pinned to a screen edge with a direction arrow       */
/* ------------------------------------------------------------------ */

export function GatewayChip({ gateway, compact }: { gateway: RegionGateway; compact?: boolean }) {
  const glass = {
    background: "rgba(18,18,20,0.82)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.45)",
  } as const;

  // Compact single-line variant for the mobile gateway strip (travel-time context on phones).
  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-2 pr-2.5 text-[11px] backdrop-blur-md"
        style={glass}
      >
        <span className="text-white/70"><ArrowIcon edge={gateway.edge} /></span>
        <span className="font-medium text-white">{gateway.name}</span>
        <span className="text-white/55">{gateway.travel}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full py-2 pl-2.5 pr-3.5 text-[12px] backdrop-blur-md" style={glass}>
      <span className="text-white/70"><ArrowIcon edge={gateway.edge} /></span>
      <span className="leading-tight">
        <span className="block font-medium text-white">{gateway.name}</span>
        <span className="block text-[11px] text-white/55">{gateway.travel}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drive-time filter — bottom-left band selector                       */
/* ------------------------------------------------------------------ */

export function DriveTimeFilter({
  bands,
  active,
  onSelect,
}: {
  bands: readonly { id: number; label: string }[];
  active: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-full p-1 backdrop-blur-md"
      style={{ background: "rgba(18,18,20,0.82)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 6px 16px rgba(0,0,0,0.45)" }}
    >
      {bands.map((b) => {
        const isOn = active === b.id;
        return (
          <button
            key={b.id}
            onClick={() => onSelect(isOn ? null : b.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              background: isOn ? GOLD : "transparent",
              color: isOn ? "#161616" : "rgba(255,255,255,0.78)",
            }}
          >
            <CarIcon />
            {b.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Country minimap — simplified mainland Portugal + locator dot        */
/* ------------------------------------------------------------------ */

export function Minimap({ label, locator }: { label: string; locator: { x: number; y: number } }) {
  // Simplified mainland-Portugal silhouette (100×200 viewBox). Stylised, not survey-accurate.
  const PT =
    "M44 4 L60 8 L58 26 L66 40 L60 56 L66 74 L58 92 L64 110 L54 130 L58 150 L46 168 L40 188 L30 196 L24 184 L30 168 L24 150 L30 132 L26 112 L32 92 L28 72 L34 52 L30 34 L36 16 Z";
  return (
    <div
      className="rounded-xl p-3 backdrop-blur-md"
      style={{ background: "rgba(18,18,20,0.82)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 6px 16px rgba(0,0,0,0.45)" }}
    >
      <div className="relative h-[88px] w-[60px]">
        <svg viewBox="0 0 100 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <path d={PT} fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        </svg>
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${locator.x * 100}%`, top: `${locator.y * 100}%` }}
        >
          <span className="block h-2 w-2 rounded-full" style={{ background: GOLD, boxShadow: `0 0 0 3px ${GOLD}44` }} />
        </span>
      </div>
      <p className="mt-1 text-center text-[11px] font-medium text-white/80">{label}</p>
    </div>
  );
}
