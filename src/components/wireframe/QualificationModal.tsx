"use client";

/**
 * QualificationModal — the ONE shared qualification form behind every gate entry point.
 *
 * Replaces the old one-click "Sign up to unlock" mechanic: the gate qualifies buyer intent
 * with a few short questions, then collects registration details, before unlocking. Rendered
 * ONCE inside UnlockProvider; every gate CTA opens this same modal via `requestUnlock()`.
 * Completing it unlocks the whole session (see UnlockProvider).
 *
 * Flow: 4 qualification questions (one per step) → the shared RegistrationForm as the final
 * "registration" step. Fully mocked — no real auth, no network. Answers are handed to
 * onComplete and kept in session state only. Not skippable: each question step must be
 * answered before advancing; the registration step enforces its own required-field +
 * email + T&C validation. Closing/Esc/backdrop cancels WITHOUT unlocking.
 *
 * // DEMO: mocked qualification gate, no real auth or storage.
 */

import { useEffect, useState } from "react";
import { RegistrationForm, type RegistrationData } from "./RegistrationForm";

// TODO(data): qualification answers, backend later.
export type QualificationAnswers = {
  basedIn: string;
  buying: string;
  timing: string;
  finance: string;
} & RegistrationData;

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
  "Almost there — a few details",
];
const TOTAL = STEP_TITLES.length;
const REGISTRATION_STEP = TOTAL - 1;

type Answers4 = { basedIn: string; buying: string; timing: string; finance: string };
const EMPTY4: Answers4 = { basedIn: "", buying: "", timing: "", finance: "" };

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
  const [a, setA] = useState<Answers4>(EMPTY4);
  const [otherBased, setOtherBased] = useState("");

  // Fresh state every time the modal (re)opens.
  useEffect(() => {
    if (open) {
      setStep(0);
      setA(EMPTY4);
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

  const set = (k: keyof Answers4, v: string) => setA((p) => ({ ...p, [k]: v }));
  const basedResolved = a.basedIn === "Somewhere else" ? otherBased.trim() : a.basedIn;

  // Not skippable — every question step gates the next.
  const canAdvance =
    step === 0
      ? basedResolved.length > 0
      : step === 1
        ? !!a.buying
        : step === 2
          ? !!a.timing
          : !!a.finance; // step 3

  const onRegister = (reg: RegistrationData) => {
    // TODO(data): qualification answers, backend later.
    onComplete({ ...a, basedIn: basedResolved, ...reg });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop — click cancels (does not unlock). */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Qualify to unlock"
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl"
      >
        {/* Header: progress + close */}
        <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-6">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i <= step ? "w-6 bg-primary" : "w-3 bg-border"}`}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 pb-5 pt-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Step {step + 1} of {TOTAL}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-text">{STEP_TITLES[step]}</h2>

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

          {step === 1 && <OptionGroup options={BUYING_OPTIONS} value={a.buying} onSelect={(v) => set("buying", v)} />}
          {step === 2 && <OptionGroup options={TIMING_OPTIONS} value={a.timing} onSelect={(v) => set("timing", v)} />}
          {step === 3 && <OptionGroup options={FINANCE_OPTIONS} value={a.finance} onSelect={(v) => set("finance", v)} />}

          {step === REGISTRATION_STEP && (
            <div className="mt-4">
              {/* The shared registration form — same fields as Bulk & Fractional. Its own
                  submit + validation drives completion; Back returns to the questions. */}
              <RegistrationForm
                variant="buyer"
                dense
                submitLabel="Unlock full access"
                onBack={() => setStep((s) => s - 1)}
                onSubmit={onRegister}
              />
            </div>
          )}
        </div>

        {/* Footer — only on the question steps; the registration step owns its own controls. */}
        {step < REGISTRATION_STEP && (
          <div className="flex items-center gap-3 border-t border-border px-5 py-4 sm:px-6">
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
              onClick={() => canAdvance && setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="h-11 flex-1 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}
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
