"use client";

/**
 * GatedUnits — the prototype units gate (Crunchbase / PitchBook style: public preview, deeper
 * value gated). Renders the same units table as UnitList, but:
 *   - the first TEASER units are always shown in full (public);
 *   - the rest are present-but-blurred behind an unlock overlay until the session is unlocked.
 *
 * Unlock is per-session and shared across project pages via UnlockProvider — once unlocked here,
 * every project's units stay unlocked while browsing. NOT auth: any email (or the "sign in" link)
 * unlocks; nothing is validated, captured, or sent anywhere.
 */

import { useState } from "react";
import type { Project } from "@/lib/mock-data";
import { useUnlock } from "../UnlockProvider";
import { UnitRow, UnitsTableHeader } from "./UnitList";

// TODO(open-question): how many units to show before the gate. Currently 2 — flag for founder.
const TEASER = 2;

export function GatedUnits({ project }: { project: Project }) {
  const { unlocked, unlock } = useUnlock();
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
            onUnlock={unlock}
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
  onUnlock: (email?: string) => void;
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
  onUnlock: (email?: string) => void;
}) {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototype: any non-empty email unlocks. No validation / capture.
    if (email.trim()) onUnlock(email.trim());
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-background p-5 text-center shadow-xl sm:p-6">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-tint text-primary">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      <p className="mt-3 text-base font-semibold text-text">
        Sign in to see all {total} units, prices and availability
      </p>
      <p className="mt-1 text-sm text-text-muted">
        You’re viewing a preview. Unlock the full unit list for free.
      </p>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="h-11 w-full flex-1 rounded-lg border border-border bg-background px-3.5 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="h-11 flex-none rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Unlock units
        </button>
      </form>

      <p className="mt-2.5 text-xs text-text-muted">
        No spam. We’ll only use this to give you access.
      </p>

      <p className="mt-3 text-sm text-text-muted">
        Already have access?{" "}
        <button
          type="button"
          onClick={() => onUnlock()}
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
