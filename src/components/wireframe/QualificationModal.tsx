"use client";

/**
 * QualificationModal — the ONE shared qualification form behind every gate entry point.
 *
 * Replaces the old one-click "Sign up to unlock" mechanic: instead of just capturing an email,
 * the gate now qualifies buyer intent with a few short questions before unlocking. Rendered
 * ONCE inside UnlockProvider; every gate CTA (units table, score analysis, comparison table,
 * advisor contact) opens this same modal via `requestUnlock()`. Completing it unlocks the whole
 * session (see UnlockProvider).
 *
 * Fully mocked — no real auth, no network. Answers are handed to onComplete and kept in session
 * state only. Not skippable: each step must be answered before you can advance, and the final
 * step needs a name + a valid-looking email. Closing/Esc/backdrop cancels WITHOUT unlocking.
 *
 * // DEMO: mocked qualification gate, no real auth or storage.
 */

import { useEffect, useState } from "react";

// TODO(data): qualification answers, backend later.
export type QualificationAnswers = {
  basedIn: string;
  buying: string;
  timing: string;
  finance: string;
  name: string;
  email: string;
};

// TODO(copy): all question and option copy is placeholder pending founder input.
const BASED_OPTIONS = [
  "Netherlands",
  "Spain",
  "Portugal",
  "France",
  "Germany",
  "Greece",
  "United Kingdom",
  "United States",
  "Somewhere else",
];
const BUYING_OPTIONS = ["Apartment", "Villa", "Investment unit"];
const TIMING_OPTIONS = ["0–6 months", "6–12 months", "12+ months", "Just exploring"];
const FINANCE_OPTIONS = ["Yes", "No", "Not sure"];

// TODO(copy)
const STEP_TITLES = [
  "Where are you based?",
  "What are you looking to buy?",
  "When do you want to buy?",
  "Are you able to execute not subject to finance?",
  "Almost there — how can we reach you?",
];
const TOTAL = STEP_TITLES.length;

const EMPTY: QualificationAnswers = {
  basedIn: "",
  buying: "",
  timing: "",
  finance: "",
  name: "",
  email: "",
};

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

export function QualificationModal({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: (answers: QualificationAnswers) => void;
}) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<QualificationAnswers>(EMPTY);
  const [otherBased, setOtherBased] = useState("");

  // Fresh state every time the modal (re)opens.
  useEffect(() => {
    if (open) {
      setStep(0);
      setA(EMPTY);
      setOtherBased("");
    }
  }, [open]);

  // Esc cancels (does not unlock).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k: keyof QualificationAnswers, v: string) => setA((p) => ({ ...p, [k]: v }));
  const basedResolved = a.basedIn === "Somewhere else" ? otherBased.trim() : a.basedIn;

  // Not skippable — every step gates the next.
  const canAdvance =
    step === 0
      ? basedResolved.length > 0
      : step === 1
        ? !!a.buying
        : step === 2
          ? !!a.timing
          : step === 3
            ? !!a.finance
            : a.name.trim().length > 0 && /\S+@\S+\.\S+/.test(a.email.trim());

  const isLast = step === TOTAL - 1;

  const advance = () => {
    if (!canAdvance) return;
    if (isLast) {
      // TODO(data): qualification answers, backend later.
      onComplete({ ...a, basedIn: basedResolved, email: a.email.trim(), name: a.name.trim() });
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop — click cancels (does not unlock). */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Qualify to unlock"
        className="relative w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-xl sm:p-6"
      >
        {/* Header: progress + close */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? "w-6 bg-primary" : "w-3 bg-border"
                }`}
              />
            ))}
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

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
          Step {step + 1} of {TOTAL}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-text">{STEP_TITLES[step]}</h2>

        {/* Body */}
        <div className="mt-1">
          {step === 0 && (
            <div className="mt-4">
              {/* TODO(copy) */}
              <select
                value={a.basedIn}
                onChange={(e) => set("basedIn", e.target.value)}
                aria-label="Country"
                className={inputCls}
              >
                <option value="" disabled>
                  Select a country…
                </option>
                {BASED_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {a.basedIn === "Somewhere else" && (
                <input
                  type="text"
                  value={otherBased}
                  onChange={(e) => setOtherBased(e.target.value)}
                  placeholder="Type your country"
                  aria-label="Your country"
                  className={`${inputCls} mt-2`}
                />
              )}
            </div>
          )}

          {step === 1 && (
            <OptionGroup options={BUYING_OPTIONS} value={a.buying} onSelect={(v) => set("buying", v)} />
          )}
          {step === 2 && (
            <OptionGroup options={TIMING_OPTIONS} value={a.timing} onSelect={(v) => set("timing", v)} />
          )}
          {step === 3 && (
            <OptionGroup options={FINANCE_OPTIONS} value={a.finance} onSelect={(v) => set("finance", v)} />
          )}

          {step === 4 && (
            <div className="mt-4 flex flex-col gap-2">
              {/* TODO(copy) */}
              <input
                type="text"
                value={a.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Full name"
                aria-label="Full name"
                className={inputCls}
              />
              <input
                type="email"
                value={a.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className={inputCls}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="h-11 flex-none rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text transition hover:bg-surface"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={advance}
            disabled={!canAdvance}
            className="h-11 flex-1 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? "Unlock full access" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="mt-4 grid gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onSelect(o)}
            aria-pressed={active}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
              active
                ? "border-primary bg-surface-tint text-text"
                : "border-border bg-background text-text hover:border-primary/50 hover:bg-surface"
            }`}
          >
            {o}
            <span
              className={`ml-3 flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                active ? "border-primary bg-primary text-white" : "border-border"
              }`}
            >
              {active && (
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
