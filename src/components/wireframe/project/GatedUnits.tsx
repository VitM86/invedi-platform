"use client";

/**
 * GatedUnits — the prototype units gate (Crunchbase / PitchBook style: public preview, deeper
 * value gated). Renders the same units table as UnitList, but:
 *   - the first TEASER units are always shown in full (public);
 *   - the rest are present-but-blurred behind a signup overlay until the session is unlocked.
 *
 * Unlock is per-session and shared across project pages via UnlockProvider — sign up here
 * and every project's units stay unlocked while browsing.
 *
 * // DEMO: mocked signup gate, no real auth. Reframed as a signup ask ("Sign up to see all
 * units, prices and availability") per the founder's latest direction, but the mechanic
 * underneath is unchanged — any email submission, or the "I already have an account" path,
 * flips the same UnlockProvider flag.
 */

import type { Project } from "@/lib/mock-data";
import { useUnlock } from "../UnlockProvider";
import { UnitRow, UnitsTableHeader } from "./UnitList";

// TODO(open-question): how many units to show before the gate. Currently 2 — flag for founder.
const TEASER = 2;

export function GatedUnits({ project }: { project: Project }) {
  const { unlocked, requestUnlock } = useUnlock();
  const teaser = project.units.slice(0, TEASER);
  const rest = project.units.slice(TEASER);
  const hasGate = rest.length > 0;

  return (
    <div className="overflow-hidden rounded border border-border">
      <UnitsTableHeader />

      {teaser.map((u) => (
        <UnitRow key={u.id} project={project} unit={u} />
      ))}

      {hasGate &&
        (unlocked ? (
          rest.map((u) => <UnitRow key={u.id} project={project} unit={u} />)
        ) : (
          <LockedRemainder
            project={project}
            total={project.units.length}
            onUnlock={requestUnlock}
          />
        ))}
    </div>
  );
}

function LockedRemainder({
  project,
  total,
  onUnlock,
}: {
  project: Project;
  total: number;
  onUnlock: () => void;
}) {
  const rest = project.units.slice(TEASER);

  return (
    <div className="relative min-h-[300px]">
      {/* The real rows, present but obscured (not interactive, hidden from a11y tree). */}
      <div aria-hidden className="pointer-events-none select-none blur-[5px]">
        {rest.map((u) => (
          <UnitRow key={u.id} project={project} unit={u} />
        ))}
      </div>

      {/* Soft fade so the rows read as "more below", not as broken content. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background/90" />

      {/* Unlock card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <UnlockCard total={total} onUnlock={onUnlock} />
      </div>
    </div>
  );
}

function UnlockCard({
  total,
  onUnlock,
}: {
  total: number;
  onUnlock: () => void;
}) {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-background p-5 text-center shadow-xl sm:p-6">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-tint text-primary">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      {/* TODO(copy): founder to refine signup ask + reassurance line. */}
      <p className="mt-3 text-base font-semibold text-text">
        Sign up to see all {total} units, prices and availability
      </p>
      <p className="mt-1 text-sm text-text-muted">
        You’re viewing a preview. Answer a few quick questions to unlock the full unit list.
      </p>

      {/* Opens the shared qualification form (UnlockProvider). */}
      <button
        type="button"
        onClick={onUnlock}
        className="mt-4 h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        Sign up to unlock
      </button>
    </div>
  );
}
