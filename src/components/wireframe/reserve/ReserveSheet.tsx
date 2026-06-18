"use client";

/**
 * ReserveSheet — right-side slide-in panel that runs the two-step paid reservation flow.
 *
 * Mirrors the SalesSheet primitive (max-w-md, fixed inset-0 backdrop, slide-in animation,
 * Esc/backdrop close, body scroll lock). Always renders the SAME unit summary card at the
 * top; the body switches between six states from `useReserve().target` + `stateOf`.
 *
 * ALL strings here are placeholder. Founder will refine — main copy lines are flagged with
 * `// TODO(copy)` so they are easy to grep.
 *
 * NO real payment processing. Mock "Pay" buttons just call `advance(nextState)`.
 */

import { useEffect } from "react";
import { formatPriceFull } from "@/lib/mock-data";
import { useReserve } from "./ReserveProvider";
import {
  RESERVATION_FEE_EUR,
  RESERVATION_REMAINING_EUR,
  RESERVATION_TOTAL_EUR,
  type ReserveState,
} from "./types";

export function ReserveSheet() {
  const { target, close, advance, stateOf } = useReserve();
  const open = target !== null;

  // Body scroll lock + Esc to close (matches SalesSheet behaviour).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!target) return null;
  const { project, unit } = target;
  const state = stateOf(project.slug, unit.id);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close reservation"
        onClick={close}
        className="absolute inset-0 bg-black/30"
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-sheet-title"
        className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-background shadow-2xl"
      >
        <Header onClose={close} state={state} />
        <UnitSummary unit={unit} project={project} />
        <div className="flex-1 px-6 pb-8 pt-2">
          <Body state={state} advance={advance} />
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top chrome                                                          */
/* ------------------------------------------------------------------ */

function Header({ onClose, state }: { onClose: () => void; state: ReserveState }) {
  // TODO(copy): top-bar label per state. Founder may want a single static "Reserve" instead.
  const title =
    state === "reserved"
      ? "Reserved"
      : state === "declined"
        ? "Reservation update"
        : state === "remaining"
          ? "Complete your reservation"
          : state === "pending"
            ? "Reservation pending"
            : "Reserve this unit";
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <h2 id="reserve-sheet-title" className="text-lg font-bold text-text">
        {title}
      </h2>
      <button
        onClick={onClose}
        aria-label="Close"
        className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <path d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
  );
}

/* Compact summary of the unit being reserved — appears in every state. */
function UnitSummary({
  unit,
  project,
}: {
  unit: { id: string; name: string; type: string; price: number };
  project: { name: string; city: string; countryLabel: string };
}) {
  return (
    <div className="mx-6 mt-5 rounded-lg border border-border bg-surface/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{project.name}</p>
      <p className="mt-0.5 text-base font-semibold text-text">{unit.name}</p>
      <p className="mt-0.5 text-sm text-text-muted">
        {unit.type} · {project.city}, {project.countryLabel}
      </p>
      <p className="mt-2 text-lg font-semibold text-primary-dark">{formatPriceFull(unit.price)}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

function Body({ state, advance }: { state: ReserveState; advance: (s: ReserveState) => void }) {
  switch (state) {
    case "fee":
      return <Step1Fee advance={advance} />;
    case "pending":
      return <Step2Pending advance={advance} />;
    case "remaining":
      return <Step3Remaining advance={advance} />;
    case "reserved":
      return <Step4Reserved />;
    case "declined":
      return <StepDeclined />;
    default:
      // "idle" shouldn't appear here (openFor advances idle→fee), but render Step1 as a safe
      // default so the panel never goes blank.
      return <Step1Fee advance={advance} />;
  }
}

function Step1Fee({ advance }: { advance: (s: ReserveState) => void }) {
  return (
    <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-text">
      <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">
          Reservation fee
        </p>
        <p className="mt-1 text-2xl font-bold text-text">
          {formatPriceFull(RESERVATION_FEE_EUR)}
        </p>
        <p className="mt-1.5 text-sm text-text-muted">
          {/* TODO(copy): emphasis line on the fee */}
          Held until your reservation is confirmed by our team.
        </p>
      </div>

      <p>
        {/* TODO(copy): main explanation */}
        Placing a reservation request requires a {formatPriceFull(RESERVATION_FEE_EUR)} fee. Our team will
        confirm availability with the developer within <strong>24 hours</strong> and let you know if the
        unit can be reserved for you.
      </p>

      <ul className="space-y-2 text-sm text-text-muted">
        <li className="flex gap-2">
          <Dot /> The fee is <strong>refundable</strong> until the reservation is confirmed.
        </li>
        <li className="flex gap-2">
          <Dot /> If we cannot confirm, the {formatPriceFull(RESERVATION_FEE_EUR)} is refunded within 1 day.
        </li>
        <li className="flex gap-2">
          <Dot /> Once confirmed, you complete the reservation by paying the remaining{" "}
          {formatPriceFull(RESERVATION_REMAINING_EUR)} (total {formatPriceFull(RESERVATION_TOTAL_EUR)}).
        </li>
      </ul>

      <button
        onClick={() => advance("pending")}
        className="mt-2 flex h-12 w-full items-center justify-center rounded bg-primary text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover"
      >
        {/* TODO(copy): primary action */}
        Pay {formatPriceFull(RESERVATION_FEE_EUR)} and submit request
      </button>
      <p className="text-center text-xs text-text-muted">
        Mock payment — no real charge. Prototype only.
      </p>
    </div>
  );
}

function Step2Pending({ advance }: { advance: (s: ReserveState) => void }) {
  return (
    <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-text">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle />
          {/* TODO(copy): receipt headline */}
          Reservation request received
        </p>
        <p className="mt-1 text-sm text-emerald-900/85">
          {/* TODO(copy): pending body */}
          Our team is checking availability with the developer and will confirm within 24 hours.
          You will receive an email update.
        </p>
      </div>

      <ul className="space-y-2 text-sm text-text-muted">
        <li className="flex gap-2">
          <Dot /> {formatPriceFull(RESERVATION_FEE_EUR)} is held — not yet charged.
        </li>
        <li className="flex gap-2">
          <Dot /> The unit is informally on hold during our check.
        </li>
        <li className="flex gap-2">
          <Dot /> You can request a refund at any time before confirmation.
        </li>
      </ul>

      <button
        onClick={() => advance("declined")}
        className="flex h-12 w-full items-center justify-center rounded border border-border bg-background text-base font-semibold text-text transition hover:bg-surface"
      >
        {/* TODO(copy): secondary action */}
        Request {formatPriceFull(RESERVATION_FEE_EUR)} refund
      </button>

      {/* DEMO ONLY — remove before production. Without a backend we have no way to advance
          past "pending"; these two buttons simulate both branches for the Friday demo. */}
      <div className="rounded border border-dashed border-amber-300 bg-amber-50 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
          Demo only — simulate team response
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => advance("remaining")}
            className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Simulate: confirmed
          </button>
          <button
            onClick={() => advance("declined")}
            className="rounded bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Simulate: declined
          </button>
        </div>
      </div>
    </div>
  );
}

function Step3Remaining({ advance }: { advance: (s: ReserveState) => void }) {
  return (
    <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-text">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle />
          {/* TODO(copy): confirmation headline */}
          Your reservation is confirmed
        </p>
        <p className="mt-1 text-sm text-emerald-900/85">
          {/* TODO(copy): confirmation body */}
          Complete the reservation by paying the remaining{" "}
          {formatPriceFull(RESERVATION_REMAINING_EUR)}.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface/60 p-4 text-sm">
        <Row label="Fee paid" value={formatPriceFull(RESERVATION_FEE_EUR)} />
        <Row label="Remaining" value={formatPriceFull(RESERVATION_REMAINING_EUR)} />
        <hr className="my-2 border-border" />
        <Row label="Total reservation" value={formatPriceFull(RESERVATION_TOTAL_EUR)} bold />
      </div>

      <button
        onClick={() => advance("reserved")}
        className="flex h-12 w-full items-center justify-center rounded bg-primary text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover"
      >
        {/* TODO(copy): primary action */}
        Pay {formatPriceFull(RESERVATION_REMAINING_EUR)}
      </button>
      <p className="text-center text-xs text-text-muted">
        Mock payment — no real charge. Prototype only.
      </p>
    </div>
  );
}

function Step4Reserved() {
  return (
    <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-text">
      <div className="flex flex-col items-center rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-center">
        <CheckCircleLarge />
        <p className="mt-2 text-lg font-semibold text-emerald-700">
          {/* TODO(copy): success headline */}
          This unit is now reserved for you
        </p>
        <p className="mt-1 text-sm text-emerald-900/85">
          {/* TODO(copy): success body */}
          We've sent the confirmation to your email along with next steps for closing.
        </p>
      </div>
      <p className="text-sm text-text-muted">
        Your advisor will reach out within 1 business day to walk you through the contract,
        deposit, and closing timeline.
      </p>
    </div>
  );
}

function StepDeclined() {
  return (
    <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-text">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800">
          {/* TODO(copy): declined headline */}
          Unfortunately this unit can't be reserved right now
        </p>
        <p className="mt-1 text-sm text-amber-900/85">
          {/* TODO(copy): declined body */}
          Your {formatPriceFull(RESERVATION_FEE_EUR)} has been refunded in full and should appear in your
          account within 1 business day.
        </p>
      </div>
      <p className="text-sm text-text-muted">
        We'd be happy to show you similar units — your advisor will be in touch with options.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small bits                                                          */
/* ------------------------------------------------------------------ */

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />;
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${bold ? "font-semibold text-text" : "text-text-muted"}`}>
      <span>{label}</span>
      <span className={bold ? "text-text" : "text-text"}>{value}</span>
    </div>
  );
}

function CheckCircle() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckCircleLarge() {
  return (
    <svg className="h-12 w-12 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
