"use client";

/**
 * UnlockProvider — prototype session gate. Holds one per-session boolean: has the session been
 * unlocked? Mounted once in the root layout so the state survives client-side navigation between
 * project pages (unlock once → stays unlocked while browsing), and is mirrored into sessionStorage
 * so it also survives a reload within the same tab. Because it lives at the root, unlocking on ANY
 * project unlocks EVERY project and every gated section for the rest of the session.
 *
 * The gate is a single-screen signup form (SignupModal, replaced the old 5-step wizard per
 * founder feedback): `requestUnlock()` opens it; submitting flips the flag and stores the
 * profile (first name, last name, email, role) in session state — the homepage hero uses it
 * for the personalised greeting.
 *
 * Entry points can pass a variant + preselected role (e.g. the homepage role cards); plain
 * `requestUnlock()` (or `onClick={requestUnlock}` — the MouseEvent arg is ignored) opens the
 * default buyer form.
 *
 * This is NOT auth. No validation beyond the form's own, no backend, no real capture.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SignupModal } from "./SignupModal";
import type { RegistrationData, RegistrationVariant } from "./RegistrationForm";
import { SignInModal } from "./SignInModal";

const STORAGE_KEY = "invedi:units-unlocked";
// TODO(data): profile goes to a backend later.
const PROFILE_KEY = "invedi:profile";
const EMAIL_KEY = "invedi:signed-in-email";

/** Mock session profile captured at signup. Session-only. */
export type SessionProfile = {
  firstName: string;
  lastName: string;
  email: string;
  /** The "Who are you" answer, e.g. "Buyer / Investor". */
  role: string;
};

export type UnlockRequestOptions = {
  /** Which form variant to open. Defaults to "buyer". */
  variant?: RegistrationVariant;
  /** Preselect the "Who are you" toggle (stays editable). */
  who?: string;
};

type UnlockValue = {
  unlocked: boolean;
  /** Open the shared signup form. Completing it unlocks the whole session. No-op if already
   *  unlocked. Takes UnlockRequestOptions; typed `unknown` so it can also be passed straight
   *  as onClick (a MouseEvent arg is detected and ignored). */
  requestUnlock: (opts?: UnlockRequestOptions | unknown) => void;
  /** Open the shared Sign in popup. Signing in unlocks the whole session (mocked). No-op if
   *  already unlocked. */
  requestSignIn: () => void;
  /** DEMO ONLY — re-lock the session and clear the stored profile so a demo can start over. */
  relock: () => void;
  /** Profile captured at signup (null when anonymous or signed in via the mocked Sign in,
   *  which only collects an email). */
  profile: SessionProfile | null;
};

const UnlockContext = createContext<UnlockValue | null>(null);

export function useUnlock(): UnlockValue {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error("useUnlock must be used within an UnlockProvider");
  return ctx;
}

type SignupRequest = { variant: RegistrationVariant; who?: string };

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  // Start locked on both server and first client render (avoids hydration mismatch); then read
  // sessionStorage after mount to restore a prior unlock on hard reload.
  const [unlocked, setUnlocked] = useState(false);
  const [signup, setSignup] = useState<SignupRequest | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [profile, setProfile] = useState<SessionProfile | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
      const raw = sessionStorage.getItem(PROFILE_KEY);
      if (raw) setProfile(JSON.parse(raw) as SessionProfile);
    } catch {
      /* sessionStorage unavailable (private mode etc.) — gate just won't persist across reloads */
    }
  }, []);

  const requestUnlock = useCallback(
    (opts?: unknown) => {
      if (unlocked) return;
      // Guard: callers pass this straight as onClick, so `opts` may be a MouseEvent.
      const o =
        opts && typeof opts === "object" && ("variant" in opts || "who" in opts)
          ? (opts as UnlockRequestOptions)
          : undefined;
      setSigningIn(false);
      setSignup({ variant: o?.variant ?? "buyer", who: o?.who });
    },
    [unlocked],
  );

  const requestSignIn = useCallback(() => {
    if (!unlocked) {
      setSignup(null);
      setSigningIn(true);
    }
  }, [unlocked]);

  const complete = useCallback((data: RegistrationData) => {
    const p: SessionProfile = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.whoAreYou,
    };
    setUnlocked(true);
    setProfile(p);
    setSignup(null);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      // TODO(data): profile goes to a backend later.
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  }, []);

  // DEMO: mocked sign-in — flips the same session flag the signup flow sets. No profile
  // (only an email), so the hero greeting stays off for this path.
  const completeSignIn = useCallback((email: string) => {
    setUnlocked(true);
    setSigningIn(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem(EMAIL_KEY, email);
    } catch {
      /* ignore */
    }
  }, []);

  // DEMO ONLY — reset the session so the signup gate shows again in a live walkthrough.
  const relock = useCallback(() => {
    setUnlocked(false);
    setProfile(null);
    setSignup(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(PROFILE_KEY);
      sessionStorage.removeItem(EMAIL_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <UnlockContext.Provider value={{ unlocked, requestUnlock, requestSignIn, relock, profile }}>
      {children}

      {/* One shared signup form for every gate entry point across the session. */}
      <SignupModal
        open={signup !== null}
        variant={signup?.variant ?? "buyer"}
        initialWho={signup?.who}
        onClose={() => setSignup(null)}
        onComplete={complete}
      />

      {/* One shared Sign in popup. "Sign up" inside it switches to the signup form. */}
      <SignInModal
        open={signingIn}
        onClose={() => setSigningIn(false)}
        onComplete={completeSignIn}
        onSwitchToSignUp={() => {
          setSigningIn(false);
          setSignup({ variant: "buyer" });
        }}
      />

      {/* DEMO ONLY re-lock control — shown only while unlocked so a fresh session stays untouched. */}
      {unlocked && <DemoResetButton onReset={relock} />}
    </UnlockContext.Provider>
  );
}

// DEMO ONLY — not part of the product. Lets us re-show the signup gate during a demo.
function DemoResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      title="Demo only: re-lock the session"
      className="fixed bottom-4 left-4 z-[60] inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-text-muted shadow-md backdrop-blur transition hover:text-text"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
      Reset demo
    </button>
  );
}
