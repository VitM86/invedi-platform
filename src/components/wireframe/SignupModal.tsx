"use client";

/**
 * SignupModal — the ONE shared signup form behind every gate entry point.
 *
 * Replaces the old 5-step QualificationModal wizard per founder feedback: one screen, one
 * submit, fewer fields. Rendered ONCE inside UnlockProvider; every gate CTA opens this same
 * modal via `requestUnlock()`. Completing it unlocks the whole session (see UnlockProvider).
 *
 * The variant + preselected "Who are you" option come from the entry point (role cards on
 * the homepage sign-up band, Bulk & fractional context); generic gates (units table, score
 * analysis, comparison, header Sign up) open the default buyer variant with nothing
 * preselected. Closing/Esc/backdrop cancels WITHOUT unlocking.
 *
 * // DEMO: mocked signup gate, no real auth or network.
 */

import { useEffect } from "react";
import {
  RegistrationForm,
  type RegistrationData,
  type RegistrationVariant,
} from "./RegistrationForm";

export function SignupModal({
  open,
  variant,
  initialWho,
  onClose,
  onComplete,
}: {
  open: boolean;
  variant: RegistrationVariant;
  /** Preselects the "Who are you" toggle when the user entered from a role card. */
  initialWho?: string;
  onClose: () => void;
  onComplete: (data: RegistrationData) => void;
}) {
  // Esc cancels (does not unlock).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Unmounting on close means the form remounts fresh (with the current preselect) every open.
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop — click cancels (does not unlock). */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign up"
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
          <div>
            {/* TODO(copy): founder to refine title + subtitle. */}
            <h2 className="text-lg font-semibold text-text">Sign up</h2>
            <p className="mt-0.5 text-sm text-text-muted">
              One quick form — full access to residences, pricing and analysis.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-text-muted transition hover:bg-surface hover:text-text"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body — the whole form on one screen. */}
        <div className="overflow-y-auto px-5 pb-5 pt-4 sm:px-6">
          <RegistrationForm
            variant={variant}
            initialWho={initialWho}
            dense
            submitLabel="Sign up"
            onSubmit={onComplete}
          />
        </div>
      </div>
    </div>
  );
}
