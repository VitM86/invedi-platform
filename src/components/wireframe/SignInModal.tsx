"use client";

/**
 * SignInModal — the shared "Sign in" popup. Visually matches QualificationModal (same backdrop,
 * card shell, inputs). Fields: Email + Password. A "No account yet? Sign up" line switches to the
 * qualification/sign-up flow. Rendered ONCE inside UnlockProvider; opened anywhere via
 * `useUnlock().requestSignIn()`.
 *
 * // DEMO: mocked sign-in, no real auth. Any valid-looking email + non-empty password sets the
 * same session unlocked flag the qualification flow sets (see UnlockProvider).
 */

import { useEffect, useState } from "react";

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInModal({
  open,
  onClose,
  onComplete,
  onSwitchToSignUp,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: (email: string) => void;
  onSwitchToSignUp: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  // Fresh state each open.
  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setTouched(false);
    }
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const emailOk = EMAIL_RE.test(email.trim());
  const passOk = password.length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    // DEMO: no real auth — any valid-looking credentials sign in.
    if (emailOk && passOk) onComplete(email.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-6">
          <h2 className="text-lg font-semibold text-text">Sign in</h2>
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

        <form onSubmit={submit} className="px-5 pb-5 pt-4 sm:px-6" noValidate>
          <p className="text-sm text-text-muted">Welcome back. Sign in to your Invedi account.</p>

          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="signin-email" className="mb-1.5 block text-[13px] font-medium text-text">
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className={inputCls}
              />
              {touched && !emailOk && (
                <p className="mt-1 text-xs text-orange">Enter a valid email address.</p>
              )}
            </div>

            <div>
              <label htmlFor="signin-password" className="mb-1.5 block text-[13px] font-medium text-text">
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputCls}
              />
              {touched && !passOk && <p className="mt-1 text-xs text-orange">Enter your password.</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Sign in
          </button>

          <p className="mt-4 text-center text-sm text-text-muted">
            No account yet?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="font-semibold text-accent underline-offset-2 transition hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
