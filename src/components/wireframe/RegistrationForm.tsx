"use client";

/**
 * RegistrationForm — the ONE shared sign-up / registration field set.
 *
 * Used by BOTH the gate qualification flow (QualificationModal's final step) and the
 * Bulk & Fractional "register interest" section (RegisterInterestForm wraps it). Keeping the
 * fields + validation in one place means the two surfaces can't drift.
 *
 * The only context difference is the "Who are you" pair:
 *   - buyer (gate / residences): "Buyer / Investor"  vs "Agent / Broker"
 *   - bulk  (bulk & fractional):  "Buyer group"       vs "Agent (representing buyer group)"
 *
 * Fully mocked — validates client-side and hands a clean payload to onSubmit; no network.
 * // TODO(data): registration payload, backend later.
 */

import { useId, useState } from "react";

export type RegistrationVariant = "buyer" | "bulk";

export type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  whoAreYou: string; // one of the variant's two option labels
  companyName: string; // Occupation / Company name (optional)
  phone: string; // WhatsApp / Text cell phone (optional)
  nationality: string; // optional
  agreeTerms: boolean; // required
  agreeMessaging: boolean; // optional
};

const EMPTY: RegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  whoAreYou: "",
  companyName: "",
  phone: "",
  nationality: "",
  agreeTerms: false,
  agreeMessaging: false,
};

const COMPANY_LIMIT = 200;

/** Permissive email check — local-part@host.tld. The real backend does the authoritative one. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO(copy): "Who are you" option labels are placeholder pending founder input.
const WHO_OPTIONS: Record<RegistrationVariant, [string, string]> = {
  buyer: ["Buyer / Investor", "Agent / Broker"],
  bulk: ["Buyer group", "Agent (representing buyer group)"],
};

type Errors = Partial<Record<keyof RegistrationData, string>>;

function validate(v: RegistrationData): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "First name is required";
  if (!v.lastName.trim()) e.lastName = "Last name is required";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address";
  if (!v.whoAreYou) e.whoAreYou = "Pick the option that fits you";
  if (!v.agreeTerms) e.agreeTerms = "Please accept the Terms & Conditions and Privacy Policy";
  return e;
}

export function RegistrationForm({
  variant = "buyer",
  submitLabel = "Submit",
  onSubmit,
  onBack,
  footerNote,
  dense = false,
}: {
  variant?: RegistrationVariant;
  submitLabel?: string;
  onSubmit: (data: RegistrationData) => void;
  /** Optional Back control (used inside the gate wizard). */
  onBack?: () => void;
  /** Small reassurance line shown next to the submit button. */
  footerNote?: React.ReactNode;
  /** Tighter vertical rhythm for the modal context. */
  dense?: boolean;
}) {
  const [values, setValues] = useState<RegistrationData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  const rid = useId();
  const fid = (n: string) => `${rid}-${n}`;
  const eid = (n: string) => `${rid}-${n}-err`;

  const set = <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the user starts correcting it.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // TODO(data): registration payload, backend later.
    onSubmit({
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
    });
  };

  const [optA, optB] = WHO_OPTIONS[variant];
  const companyCount = values.companyName.length;
  const companyNear = companyCount >= COMPANY_LIMIT * 0.9;

  return (
    <form noValidate onSubmit={submit} className={dense ? "space-y-4" : "space-y-6"}>
      {/* First + Last */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" id={fid("firstName")} errorId={eid("firstName")} error={errors.firstName} required>
          <input
            id={fid("firstName")}
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? eid("firstName") : undefined}
            className={inputCls(!!errors.firstName)}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last name" id={fid("lastName")} errorId={eid("lastName")} error={errors.lastName} required>
          <input
            id={fid("lastName")}
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? eid("lastName") : undefined}
            className={inputCls(!!errors.lastName)}
            autoComplete="family-name"
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email" id={fid("email")} errorId={eid("email")} error={errors.email} required>
        <input
          id={fid("email")}
          type="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? eid("email") : undefined}
          className={inputCls(!!errors.email)}
          autoComplete="email"
        />
      </Field>

      {/* Who are you — two-option pair, context-dependent labels */}
      <FieldGroup label="Who are you" required error={errors.whoAreYou} errorId={eid("whoAreYou")}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Choice label={optA} selected={values.whoAreYou === optA} onClick={() => set("whoAreYou", values.whoAreYou === optA ? "" : optA)} />
          <Choice label={optB} selected={values.whoAreYou === optB} onClick={() => set("whoAreYou", values.whoAreYou === optB ? "" : optB)} />
        </div>
      </FieldGroup>

      {/* Occupation / Company name — optional, max 200, live counter */}
      <Field
        label="Occupation / Company name"
        id={fid("companyName")}
        hint="Optional"
        counter={
          <span className={companyNear ? "text-orange/80" : "text-text-muted"}>
            {companyCount} / {COMPANY_LIMIT}
          </span>
        }
      >
        <input
          id={fid("companyName")}
          value={values.companyName}
          onChange={(e) => set("companyName", e.target.value.slice(0, COMPANY_LIMIT))}
          maxLength={COMPANY_LIMIT}
          className={inputCls(false)}
          autoComplete="organization"
        />
      </Field>

      {/* Phone + Nationality — optional */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="WhatsApp / Text cell phone" id={fid("phone")} hint="Optional">
          <input
            id={fid("phone")}
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls(false)}
            autoComplete="tel"
          />
        </Field>
        <Field label="Nationality" id={fid("nationality")} hint="Optional">
          <input
            id={fid("nationality")}
            value={values.nationality}
            onChange={(e) => set("nationality", e.target.value)}
            className={inputCls(false)}
            autoComplete="country-name"
          />
        </Field>
      </div>

      {/* Consent checkboxes */}
      <div className="space-y-2.5">
        <CheckboxRow
          checked={values.agreeTerms}
          onChange={(v) => set("agreeTerms", v)}
          error={errors.agreeTerms}
          errorId={eid("agreeTerms")}
          required
        >
          {/* TODO(link): point Terms & Conditions and Privacy Policy at their pages once they exist. */}
          I agree to the <span className="font-semibold text-text underline underline-offset-2">Terms &amp; Conditions</span> and{" "}
          <span className="font-semibold text-text underline underline-offset-2">Privacy Policy</span>
        </CheckboxRow>
        <CheckboxRow checked={values.agreeMessaging} onChange={(v) => set("agreeMessaging", v)}>
          I agree to receive messages via WhatsApp or SMS
        </CheckboxRow>
      </div>

      {/* Footer: note + back + submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {footerNote ? <div className="text-xs text-text-muted">{footerNote}</div> : <span />}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="h-11 flex-none rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text transition hover:bg-surface"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover sm:flex-none"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Atoms (shared)                                                      */
/* ------------------------------------------------------------------ */

export function inputCls(error: boolean): string {
  return `h-11 w-full rounded-lg border bg-white px-3 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-text ${
    error ? "border-orange focus:border-orange" : "border-border"
  }`;
}

export function Field({
  label,
  id,
  errorId,
  error,
  required,
  hint,
  counter,
  children,
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

export function FieldGroup({
  label,
  required,
  error,
  errorId,
  children,
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

export function Choice({
  label,
  selected,
  onClick,
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

function CheckboxRow({
  checked,
  onChange,
  error,
  errorId,
  required,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  errorId?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-text">
        <span
          className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 transition-colors ${
            checked ? "border-primary bg-primary" : error ? "border-orange bg-white" : "border-border bg-white"
          }`}
        >
          {checked && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        <span className="leading-snug">
          {children}
          {required && <span aria-hidden className="ml-0.5 text-orange">*</span>}
        </span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="ml-7 mt-1 text-xs font-medium text-orange">
          {error}
        </p>
      )}
    </div>
  );
}
