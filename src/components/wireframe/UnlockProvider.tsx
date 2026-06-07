"use client";

/**
 * UnlockProvider — prototype "units gate". Holds a single per-session boolean: have the detailed
 * units been unlocked? Mounted once in the root layout so the state survives client-side
 * navigation between project pages (unlock once → stays unlocked while browsing), and is mirrored
 * into sessionStorage so it also survives a reload within the same tab.
 *
 * This is NOT auth. There is no validation, no backend, no real email capture — any email (or the
 * "sign in" link) flips the flag. Real authentication is deliberately out of scope.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "invedi:units-unlocked";
const EMAIL_KEY = "invedi:units-email";

type UnlockValue = { unlocked: boolean; unlock: (email?: string) => void };

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

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      /* sessionStorage unavailable (private mode etc.) — gate just won't persist across reloads */
    }
  }, []);

  const unlock = useCallback((email?: string) => {
    setUnlocked(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      if (email) sessionStorage.setItem(EMAIL_KEY, email);
    } catch {
      /* ignore */
    }
  }, []);

  return <UnlockContext.Provider value={{ unlocked, unlock }}>{children}</UnlockContext.Provider>;
}
