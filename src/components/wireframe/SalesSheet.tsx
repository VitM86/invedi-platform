"use client";

/**
 * SalesSheet — right-side panel that handles the three buyer paths that replace Reserve:
 *   - advisor : Speak to advisor (name, email, phone optional, message)
 *   - pack    : Get sales pack (name, email)
 *   - access  : Request access (name, email, role: Buyer / Broker / Investor)
 *
 * Shared by the Project page and the Unit page. Opening CTA sets the active tab. Submit is a
 * placeholder (no backend) — it shows a confirmation state. The presentation here (three
 * tabs) is the first cut; Screen 4 refines it / prototypes the "three actions at once" layout.
 */

import { useEffect, useState } from "react";

export type SalesIntent = "advisor" | "pack" | "access";

const TABS: { id: SalesIntent; label: string }[] = [
  { id: "advisor", label: "Speak to advisor" },
  { id: "pack", label: "Get sales pack" },
  { id: "access", label: "Request access" },
];

const inputClass =
  "w-full rounded border border-border bg-white px-3 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent";

interface Props {
  intent: SalesIntent;
  onIntentChange: (i: SalesIntent) => void;
  onClose: () => void;
  /** Context line, e.g. "Maple Court" or "Maple Court › Unit 201". */
  context: string;
}

/**
 * Mount this only while open (parents render it conditionally) — that keeps the form/
 * confirmation state fresh per opening without resetting state inside an effect.
 */
export function SalesSheet({ intent, onIntentChange, onClose, context }: Props) {
  const [submitted, setSubmitted] = useState(false);

  // Lock scroll + Esc to close.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const selectTab = (id: SalesIntent) => {
    setSubmitted(false);
    onIntentChange(id);
  };

  const activeTab = TABS.find((t) => t.id === intent)!;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="animate-slide-in relative flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text">{activeTab.label}</h2>
            <p className="text-sm text-text-muted">{context}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded p-1.5 hover:bg-surface">
            <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border bg-surface px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold transition-colors ${
                intent === t.id ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {submitted ? (
            <Confirmation intent={intent} onClose={onClose} />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <Field label="Full name" required>
                <input className={inputClass} required placeholder="Jane Doe" />
              </Field>
              <Field label="Email" required>
                <input type="email" className={inputClass} required placeholder="jane@example.com" />
              </Field>

              {intent === "advisor" && (
                <>
                  <Field label="Phone" hint="optional">
                    <input type="tel" className={inputClass} placeholder="+31 6 1234 5678" />
                  </Field>
                  <Field label="Message" hint="optional">
                    <textarea rows={3} className={inputClass} placeholder="What would you like to know?" />
                  </Field>
                </>
              )}

              {intent === "access" && (
                <Field label="I am a" required>
                  <select className={inputClass} required defaultValue="">
                    <option value="" disabled>
                      Select role…
                    </option>
                    <option value="buyer">Buyer</option>
                    <option value="broker">Broker</option>
                    <option value="investor">Investor</option>
                  </select>
                </Field>
              )}

              <p className="text-xs text-text-muted">
                {intent === "advisor" && "An Invedi advisor will follow up. Hands off to the sales pipeline (placeholder)."}
                {intent === "pack" && "We'll email a PDF sales pack and project info (placeholder — no email is sent)."}
                {intent === "access" && "Request access to gated documents and pricing (placeholder gate)."}
              </p>

              <button
                type="submit"
                className="h-12 w-full rounded bg-primary text-base font-semibold text-white transition hover:bg-primary-hover"
              >
                {intent === "advisor" && "Request a call"}
                {intent === "pack" && "Send me the sales pack"}
                {intent === "access" && "Request access"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-text">
        {label}
        {required && <span className="text-orange"> *</span>}
        {hint && <span className="ml-1 font-normal text-text-muted">({hint})</span>}
      </span>
      {children}
    </label>
  );
}

function Confirmation({ intent, onClose }: { intent: SalesIntent; onClose: () => void }) {
  const copy: Record<SalesIntent, { title: string; body: string }> = {
    advisor: {
      title: "Request received",
      body: "An advisor will reach out shortly. (Placeholder confirmation — no request was actually sent.)",
    },
    pack: {
      title: "Sales pack on its way",
      body: "Check your inbox for the PDF and project info. (Placeholder confirmation — no email was sent.)",
    },
    access: {
      title: "Access requested",
      body: "We'll review your request and unlock gated content. (Placeholder confirmation.)",
    },
  };
  const c = copy[intent];
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-verified-bg text-verified">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-text">{c.title}</h3>
      <p className="mt-1 max-w-xs text-sm text-text-muted">{c.body}</p>
      <button
        onClick={onClose}
        className="mt-6 rounded border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface"
      >
        Done
      </button>
    </div>
  );
}
