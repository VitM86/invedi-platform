"use client";

/**
 * ReserveProvider — context + sessionStorage persistence for the per-unit reserve flow.
 *
 * Stores ALL reservation states under one sessionStorage key as a JSON map (`unitKey ->
 * ReserveState`). That keeps page reload painless without exploding the key namespace if
 * we ever flip lots of units in a demo. Hydration-safe: empty on first render, hydrated
 * from storage in a useEffect on mount (mirrors UnlockProvider's pattern).
 *
 * The "sheet open" status is COMPONENT-LOCAL (not persisted) — closing the tab should not
 * re-open the sheet on a new visit.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Project, Unit } from "@/lib/mock-data";
import {
  type ReserveContextValue,
  type ReserveState,
  type ReserveTarget,
  unitKeyOf,
} from "./types";

const STORAGE_KEY = "invedi:reservations";

const Ctx = createContext<ReserveContextValue | null>(null);

type Store = Record<string, ReserveState>;

export function ReserveProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>({});
  const [target, setTarget] = useState<ReserveTarget | null>(null);

  // Hydrate from sessionStorage on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setStore(JSON.parse(raw) as Store);
    } catch {
      // Storage disabled / quota — silently start empty; flow still works for the session.
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* see above */
    }
  }, [store]);

  const stateOf = useCallback(
    (projectSlug: string, unitId: string): ReserveState =>
      store[unitKeyOf(projectSlug, unitId)] ?? "idle",
    [store],
  );

  const setUnitState = useCallback((projectSlug: string, unitId: string, state: ReserveState) => {
    setStore((prev) => ({ ...prev, [unitKeyOf(projectSlug, unitId)]: state }));
  }, []);

  const openFor = useCallback(
    (project: Project, unit: Unit) => {
      setTarget({ project, unit });
      const current = store[unitKeyOf(project.slug, unit.id)] ?? "idle";
      // Opening a fresh ("idle") unit advances straight to the €100 fee screen.
      if (current === "idle") setUnitState(project.slug, unit.id, "fee");
    },
    [store, setUnitState],
  );

  const close = useCallback(() => setTarget(null), []);

  const advance = useCallback(
    (state: ReserveState) => {
      if (!target) return;
      setUnitState(target.project.slug, target.unit.id, state);
    },
    [target, setUnitState],
  );

  const value = useMemo<ReserveContextValue>(
    () => ({ stateOf, openFor, close, advance, target }),
    [stateOf, openFor, close, advance, target],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReserve(): ReserveContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useReserve must be used inside <ReserveProvider>");
  return v;
}
