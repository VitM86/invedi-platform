"use client";

/**
 * RegisterInterestForm — shared sign-up / registration block for the bottom of both the
 * Bulk and Fractional sub-sections.
 *
 * Single source of truth: BulkSection and FractionalSection both mount this; placement
 * lives at the bottom of each so the form's selection context (current filters / selected
 * cards) is naturally adjacent. Inline placement was picked over a CTA-triggered modal —
 * easier to demo all states in a screenshot, and the form sits within the natural reading
 * flow of "browse → register".
 *
 * Validation: client-side on submit. Required fields must trim-non-empty; the email field
 * additionally passes a permissive RFC-ish regex. Description has a hard 100-char cap +
 * live counter that turns warning amber past 90% to signal the cap is approaching.
 *
 * Submission: MOCKED. On valid submit the form flips to a success view via local state
 * (no real network call, no real persistence). A "Submit another" affordance resets the
 * form. The contextSnapshot (current sub-section + filter summary) is captured into the
 * mock submission payload so a future backend would know what the user was browsing —
 * marked TODO(data).
 */

import { useId, useMemo, useState } from "react";

export type RegisterInterestSubSection = "bulk" | "fractional";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  audience: "buyer-group" | "agent" | null;
  description: string;
  cellPhone: string;
  nationality: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  audience: null,
  description: "",
  cellPhone: "",
  nationality: "",
};

const DESCRIPTION_LIMIT = 100;

/** Permissive email check — local-part@host.tld. Not RFC-perfect; good enough for
 *  client-side hint validation, the real backend would do the authoritative check. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.firstName.trim())   errors.firstName   = "First name is required";
  if (!values.lastName.trim())    errors.lastName    = "Last name is required";
  if (!values.email.trim())       errors.email       = "Email is required";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email address";
  if (!values.audience)           errors.audience    = "Pick the option that fits you";
  if (!values.description.trim()) errors.description = "Describe your group in a sentence";
  return errors;
}

export function RegisterInterestForm({
  subSection,
  contextSnapshot,
}: {
  subSection: RegisterInterestSubSection;
  /** Opaque description of the current selections — submitted along with the form values
   *  so a backend would know what was on screen. Captured, never displayed. */
  contextSnapshot: string;
}) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const reactId = useId();
  const fieldId = (name: string) => `${reactId}-${name}`;
  const errorId = (name: string) => `${reactId}-${name}-err`;

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear the error for a field as soon as the user starts correcting it — feels less
    // accusatory than waiting for re-submit.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // DEMO ONLY — no real network call, no persistence. A future part wires this to a
    // backend; today we just flip to the success view and leave the payload in the
    // browser console for inspection.
    // TODO(data): attach selection context to submission.
    console.log("[register-interest] mock submit", { subSection, contextSnapshot, values });
    setSubmitted(true);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
  };

  const descCount = values.description.length;
  const descNearLimit = descCount >= DESCRIPTION_LIMIT * 0.9;
  const descAtLimit   = descCount >= DESCRIPTION_LIMIT;

  /** True iff the user has filled out fields beyond defaults — guards the empty-form
   *  vs the "submitted" success view from styling oddly when toggled. */
  const isPristine = useMemo(
    () => JSON.stringify(values) === JSON.stringify(EMPTY) && Object.keys(errors).length === 0,
    [values, errors],
  );
  // Silence unused — kept for future "are you sure?" guard on tab switch.
  void isPristine;

  return (
    <section
      id="register-interest"
      aria-labelledby={fieldId("heading")}
      className="rounded-2xl border border-border bg-background p-6 sm:p-8 lg:p-10"
    >
      {submitted ? (
        <SuccessState onReset={reset} />
      ) : (
        <form noValidate onSubmit={onSubmit} className="space-y-8">
          <header>
            <h2 id={fieldId("heading")} className="text-xl font-semibold text-text sm:text-2xl">
              {/* TODO(copy): founder to refine heading. */}
              Register your interest
            </h2>
            <p className="mt-1.5 text-sm text-text-muted">
              Tell us who you are and we&apos;ll be in touch to walk you through{" "}
              {subSection === "bulk" ? "bulk discounts" : "fractional ownership"}.
            </p>
          </header>

          {/* Row 1: First + Last */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="First name"
              id={fieldId("firstName")}
              errorId={errorId("firstName")}
              error={errors.firstName}
              required
            >
              <input
                id={fieldId("firstName")}
                name="firstName"
                value={values.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? errorId("firstName") : undefined}
                className={inputCls(!!errors.firstName)}
                autoComplete="given-name"
              />
            </Field>
            <Field
              label="Last name"
              id={fieldId("lastName")}
              errorId={errorId("lastName")}
              error={errors.lastName}
              required
            >
              <input
                id={fieldId("lastName")}
                name="lastName"
                value={values.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? errorId("lastName") : undefined}
                className={inputCls(!!errors.lastName)}
                autoComplete="family-name"
              />
            </Field>
          </div>

          {/* Email — full width */}
          <Field
            label="Email"
            id={fieldId("email")}
            errorId={errorId("email")}
            error={errors.email}
            required
          >
            <input
              id={fieldId("email")}
              name="email"
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? errorId("email") : undefined}
              className={inputCls(!!errors.email)}
              autoComplete="email"
            />
          </Field>

          {/* Who are you — two-option Choice pair (sibling-shape to BulkRequirementsBlock
              and FractionalParamsBlock so the whole site reads consistently). */}
          <FieldGroup label="Who are you" required error={errors.audience} errorId={errorId("audience")}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr]">
              <Choice
                label="Buyer group"
                selected={values.audience === "buyer-group"}
                onClick={() => set("audience", values.audience === "buyer-group" ? null : "buyer-group")}
              />
              <Choice
                label="Agent (representing buyer group)"
                selected={values.audience === "agent"}
                onClick={() => set("audience", values.audience === "agent" ? null : "agent")}
              />
            </div>
          </FieldGroup>

          {/* Description — textarea with hard cap + live counter */}
          <Field
            label="Short description of your group"
            id={fieldId("description")}
            errorId={errorId("description")}
            error={errors.description}
            required
            counter={
              <span className={descAtLimit ? "text-orange" : descNearLimit ? "text-orange/80" : "text-text-muted"}>
                {descCount} / {DESCRIPTION_LIMIT}
              </span>
            }
          >
            <textarea
              id={fieldId("description")}
              name="description"
              value={values.description}
              onChange={(e) => set("description", e.target.value.slice(0, DESCRIPTION_LIMIT))}
              maxLength={DESCRIPTION_LIMIT}
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? errorId("description") : undefined}
              className={`${inputCls(!!errors.description)} min-h-[80px] resize-y py-2.5`}
              placeholder="e.g. Three-family office co-investing in PT/ES new-builds."
            />
          </Field>

          {/* Row 4: Cell phone + Nationality — optional */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Cell phone"
              id={fieldId("cellPhone")}
              hint="Optional"
            >
              <input
                id={fieldId("cellPhone")}
                name="cellPhone"
                type="tel"
                value={values.cellPhone}
                onChange={(e) => set("cellPhone", e.target.value)}
                className={inputCls(false)}
                autoComplete="tel"
              />
            </Field>
            <Field
              label="Nationality"
              id={fieldId("nationality")}
              hint="Optional"
            >
              <input
                id={fieldId("nationality")}
                name="nationality"
                value={values.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                className={inputCls(false)}
                autoComplete="country-name"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              We&apos;ll only use this to get in touch about{" "}
              {subSection === "bulk" ? "bulk discounts" : "fractional ownership"}.
            </p>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Atoms                                                              */
/* ------------------------------------------------------------------ */

function inputCls(error: boolean): string {
  return `h-11 w-full rounded-lg border bg-white px-3 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-text ${
    error ? "border-orange focus:border-orange" : "border-border"
  }`;
}

function Field({
  label, id, errorId, error, required, hint, counter, children,
}: {
  label: string;
  id: string;
  errorId?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
          {required && <span aria-hidden className="ml-0.5 text-orange">*</span>}
          {hint && <span className="ml-2 text-xs font-medium text-text-muted">{hint}</span>}
        </label>
        {counter && <span className="text-xs font-medium tabular-nums">{counter}</span>}
      </div>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-orange">
          {error}
        </p>
      )}
    </div>
  );
}

/** Wrapper for inputs that aren't a single <input> — like the two-option Choice pair. */
function FieldGroup({
  label, required, error, errorId, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-text">
        {label}
        {required && <span aria-hidden className="ml-0.5 text-orange">*</span>}
      </p>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-orange">
          {error}
        </p>
      )}
    </div>
  );
}

/** Paired-choice button — visually identical to BulkRequirementsBlock + FractionalParams.
 *  Triplicated here on purpose: keeps the form file self-contained for part 6, the three
 *  sites can drift if their selection vocabularies later diverge. */
function Choice({
  label, selected, onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-12 w-full items-center justify-between gap-3 rounded-lg border px-4 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-text"
          : "border-border bg-white text-text-muted hover:border-text hover:text-text"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-primary bg-primary" : "border-border bg-white"
        }`}
        aria-hidden
      >
        {selected && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        )}
      </span>
    </button>
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
      <h2 className="mt-4 text-xl font-semibold text-text sm:text-2xl">
        Thanks — we&apos;ll be in touch
      </h2>
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
