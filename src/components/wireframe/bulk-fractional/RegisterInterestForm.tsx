"use client";

/**
 * RegisterInterestForm — sign-up / registration block at the bottom of both the Bulk and
 * Fractional sub-sections.
 *
 * Thin wrapper around the shared RegistrationForm (single source of truth for the fields +
 * validation, also used by the gate). This file owns the section chrome, heading, the
 * MOCKED submit→success flow, and the contextSnapshot capture.
 *
 * Submission: MOCKED. On valid submit the form flips to a success view (no network, no
 * persistence). "Submit another" resets. // TODO(data): attach selection context + payload.
 */

import { useId, useState } from "react";
import { RegistrationForm, type RegistrationData } from "../RegistrationForm";

export type RegisterInterestSubSection = "bulk" | "fractional";

export function RegisterInterestForm({
  subSection,
  contextSnapshot,
}: {
  subSection: RegisterInterestSubSection;
  /** Opaque description of the current selections — submitted with the form values so a
   *  backend would know what was on screen. Captured, never displayed. */
  contextSnapshot: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const reactId = useId();
  const headingId = `${reactId}-heading`;

  const handleSubmit = (data: RegistrationData) => {
    // DEMO ONLY — no real network call, no persistence.
    // TODO(data): attach selection context to submission.
    console.log("[register-interest] mock submit", { subSection, contextSnapshot, data });
    setSubmitted(true);
  };

  return (
    <section
      id="register-interest"
      aria-labelledby={headingId}
      className="rounded-2xl border border-border bg-background p-6 sm:p-8 lg:p-10"
    >
      {submitted ? (
        <SuccessState onReset={() => setSubmitted(false)} />
      ) : (
        <>
          <header className="mb-8">
            <h2 id={headingId} className="text-xl font-semibold text-text sm:text-2xl">
              {/* TODO(copy): founder to refine heading. */}
              Register your interest
            </h2>
            <p className="mt-1.5 text-sm text-text-muted">
              Tell us who you are and we&apos;ll be in touch to walk you through{" "}
              {subSection === "bulk" ? "bulk discounts" : "fractional ownership"}.
            </p>
          </header>

          {/* Bulk & Fractional keeps its own "Who are you" pair (buyer group / agent). */}
          <RegistrationForm
            variant="bulk"
            submitLabel="Submit"
            onSubmit={handleSubmit}
            footerNote={
              <>
                We&apos;ll only use this to get in touch about{" "}
                {subSection === "bulk" ? "bulk discounts" : "fractional ownership"}.
              </>
            }
          />
        </>
      )}
    </section>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </span>
      {/* TODO(copy): founder to refine confirmation copy. */}
      <h2 className="mt-4 text-xl font-semibold text-text sm:text-2xl">Thanks — we&apos;ll be in touch</h2>
      <p className="mt-2 max-w-md text-sm text-text-muted">
        Your interest has been registered. We&apos;ll reach out shortly to walk you through next steps.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-medium text-text transition-colors hover:bg-surface"
      >
        Submit another
      </button>
    </div>
  );
}
