/**
 * Reserve flow — types and state-machine helpers.
 *
 * Per-unit reservation state stored in sessionStorage (same posture as the email-gate
 * UnlockProvider — survives reload in the same tab, fresh on a new tab). NO real backend,
 * NO real payment processing — this is a wireframe of the founder-defined two-step paid
 * reservation flow on curated projects only.
 */

import type { Project, Unit } from "@/lib/mock-data";

export type ReserveState =
  | "idle" // no flow started for this unit
  | "fee" // Step 1: the user is on the €100 fee screen, hasn't submitted
  | "pending" // Step 2: €100 paid, awaiting team confirmation
  | "remaining" // Step 3: team confirmed; pay the remaining €900
  | "reserved" // Step 4: success — unit officially reserved
  | "declined"; // Alt: team couldn't confirm — €100 refunded

export const RESERVATION_FEE_EUR = 100;
export const RESERVATION_TOTAL_EUR = 1000;
export const RESERVATION_REMAINING_EUR = RESERVATION_TOTAL_EUR - RESERVATION_FEE_EUR;

/** Compact unit-key form used in the per-unit state map. */
export const unitKeyOf = (projectSlug: string, unitId: string) => `${projectSlug}:${unitId}`;

export type ReserveTarget = { project: Project; unit: Unit };

export type ReserveContextValue = {
  /** Map of unit key → current state. "idle" if absent. */
  stateOf: (projectSlug: string, unitId: string) => ReserveState;
  /** Open the sheet for a unit. If the unit is currently "idle", we advance to "fee". */
  openFor: (project: Project, unit: Unit) => void;
  /** Close the sheet WITHOUT resetting state (state persists in sessionStorage). */
  close: () => void;
  /** Set a new state for the unit currently in the sheet. */
  advance: (state: ReserveState) => void;
  /** Currently-open unit (drives ReserveSheet rendering). null when closed. */
  target: ReserveTarget | null;
};
