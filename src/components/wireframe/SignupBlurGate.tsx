"use client";

/**
 * SignupBlurGate — wraps a block of content with the platform's signup-style gate:
 * blurred children + centered prompt card overlay. Reuses the same UnlockProvider session
 * flag as GatedUnits and ProjectActions, so signing up in any one place unlocks all
 * gated content site-wide.
 *
 * // DEMO: mocked signup gate, no real auth. Reuses the existing email-gate /
 * sessionStorage mechanic — any email submission, or the Log-in path, flips the same
 * UnlockContext.unlocked flag.
 *
 * Use this where the gated block is a self-contained DOM region (e.g. the strengths /
 * considerations / criteria block in EditorialNote). For cases where the gate needs to
 * cover only the TAIL of a continuous container (e.g. the lower rows of a table where
 * you can't legally wrap rows in a div), write the blur+overlay inline against the
 * shared useUnlock hook — see RegionOverview's ComparisonTable for that pattern.
 */

import { useState } from "react";
import { useUnlock } from "./UnlockProvider";

export function SignupBlurGate({
  children,
  prompt,
  sub,
}: {
  children: React.ReactNode;
  /** Headline of the prompt card. e.g. "Sign up to see the full Invedi score analysis". */
  prompt: string;
  /** Optional sub-line under the prompt. */
  sub?: string;
}) {
  const { unlocked } = useUnlock();
  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      {/* Real content underneath, present but obscured (not interactive, hidden from
          the a11y tree). */}
      <div aria-hidden className="pointer-events-none select-none blur-[5px]">
        {children}
      </div>

      {/* Soft fade so the blurred block reads as "more below", not as broken content. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background/95" />

      {/* Centered prompt card. */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <SignupCard prompt={prompt} sub={sub} />
      </div>
    </div>
  );
}

/** Standalone prompt card — also reused inline by gate-points that don't fit the
 *  wrap-children shape (the comparison table tail uses this directly). Exported so
 *  consumers can compose their own overlay layout if needed. */
export function SignupCard({
  prompt,
  sub,
}: {
  prompt: string;
  sub?: string;
}) {
  const { unlock } = useUnlock();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototype: any non-empty email unlocks. No validation / capture.
    if (email.trim()) unlock(email.trim());
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-background p-5 text-center shadow-xl sm:p-6">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-tint text-primary">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      {/* TODO(copy): founder to refine signup ask + reassurance line. */}
      <p className="mt-3 text-base font-semibold text-text">{prompt}</p>
      {sub && <p className="mt-1 text-sm text-text-muted">{sub}</p>}

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
          Sign up to unlock
        </button>
      </form>

      <p className="mt-3 text-sm text-text-muted">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => unlock()}
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
