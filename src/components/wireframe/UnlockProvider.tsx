"use client";

/**
 * UnlockProvider — prototype session gate. Holds one per-session boolean: has the session been
 * unlocked? Mounted once in the root layout so the state survives client-side navigation between
 * project pages (unlock once → stays unlocked while browsing), and is mirrored into sessionStorage
 * so it also survives a reload within the same tab. Because it lives at the root, unlocking on ANY
 * project unlocks EVERY project and every gated section for the rest of the session.
 *
 * The gate is now a qualification step: `requestUnlock()` opens the shared QualificationModal
 * (rendered once here); completing it flips the flag and stores the answers in session state.
 *
 * This is NOT auth. No validation, no backend, no real capture — the qualification answers are
 * mocked and session-only.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { QualificationModal, type QualificationAnswers } from "./QualificationModal";

const STORAGE_KEY = "invedi:units-unlocked";
// TODO(data): qualification answers, backend later.
const ANSWERS_KEY = "invedi:qualification";

type UnlockValue = {
  unlocked: boolean;
  /** Open the shared qualification form. Completing it unlocks the whole session. No-op if
   *  already unlocked. */
  requestUnlock: () => void;
  /** DEMO ONLY — re-lock the session and clear stored answers so a demo can start over. */
  relock: () => void;
  /** Qualification answers captured at unlock. Session-only, mocked. */
  answers: QualificationAnswers | null;
};

const UnlockContext = createContext<UnlockValue | null>(null);

export function useUnlock(): UnlockValue {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error("useUnlock must be used within an UnlockProvider");
  return ctx;
}

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  // Start locked on both server and first client render (avoids hydration mismatch); then read
  // sessionStorage after mount to restore a prior unlock on hard reload.
  const [unlocked, setUnlocked] = useState(false);
  const [qualifying, setQualifying] = useState(false);
  const [answers, setAnswers] = useState<QualificationAnswers | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
      const raw = sessionStorage.getItem(ANSWERS_KEY);
      if (raw) setAnswers(JSON.parse(raw) as QualificationAnswers);
    } catch {
      /* sessionStorage unavailable (private mode etc.) — gate just won't persist across reloads */
    }
  }, []);

  const requestUnlock = useCallback(() => {
    if (!unlocked) setQualifying(true);
  }, [unlocked]);

  const complete = useCallback((a: QualificationAnswers) => {
    setUnlocked(true);
    setAnswers(a);
    setQualifying(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      // TODO(data): qualification answers, backend later.
      sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(a));
    } catch {
      /* ignore */
    }
  }, []);

  // DEMO ONLY — reset the session so the qualification gate shows again in a live walkthrough.
  const relock = useCallback(() => {
    setUnlocked(false);
    setAnswers(null);
    setQualifying(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(ANSWERS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <UnlockContext.Provider value={{ unlocked, requestUnlock, relock, answers }}>
      {children}

      {/* One shared qualification form for every gate entry point across the session. */}
      <QualificationModal
        open={qualifying}
        onClose={() => setQualifying(false)}
        onComplete={complete}
      />

      {/* DEMO ONLY re-lock control — shown only while unlocked so a fresh session stays untouched. */}
      {unlocked && <DemoResetButton onReset={relock} />}
    </UnlockContext.Provider>
  );
}

// DEMO ONLY — not part of the product. Lets us re-show the qualification gate during a demo.
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
