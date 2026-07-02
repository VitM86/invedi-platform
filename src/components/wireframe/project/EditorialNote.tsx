"use client";

/**
 * EditorialNote — now renders the Invedi-score block on each project page (was previously a
 * "Why we believe in this project" 2x2 grid; replaced per the founder's neutral-assessment
 * direction). The component name is kept for backwards compatibility with the project page
 * import; the file is, semantically, the InvediScore review block.
 *
 * All review data lives on the project as a hand-authored `review` object — no formula,
 * no computation. Verdict badge color is picked from a small palette (emerald / amber /
 * stone) so the page reads "analytical", not "alarming". Methodology link opens a small
 * click-away popover with placeholder copy.
 */

import { useEffect, useRef, useState } from "react";
import type { Project, ProjectReview, ReviewVerdict } from "@/lib/mock-data";
import { scoreToStars } from "@/lib/mock-data";
import { InvediStars } from "./StarScore";
import { SignupBlurGate } from "../SignupBlurGate";

type VerdictStyle = {
  bg: string;
  text: string;
  border: string;
  dot: string;
};

const VERDICT_STYLE: Record<ReviewVerdict, VerdictStyle> = {
  Recommended: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  "Recommended with reservations": {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  "Not recommended": {
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
    dot: "bg-stone-500",
  },
};

export function EditorialNote({ project }: { project: Project }) {
  const r = project.review;
  return (
    <section className="rounded border border-border bg-background">
      <Header />
      <ScoreSummary review={r} />
      {/* Strengths / Points-to-consider / Criteria breakdown are gated behind the shared
          signup gate: section heading + ScoreSummary stay public as the teaser, the deeper
          analysis blurs behind a sign-up prompt until the session is unlocked. Reuses the
          UnlockProvider flag so one sign-up everywhere unlocks every gate. */}
      <SignupBlurGate
        prompt="Sign up to see the full Invedi score analysis"
        sub="The numeric score, strengths, points to consider, and the per-criterion breakdown."
      >
        <GatedScore review={r} />
        <PointsRow review={r} />
        <Criteria review={r} />
      </SignupBlurGate>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
          Invedi score
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text sm:text-2xl">
          {/* TODO(copy): section title */}
          Independent project assessment
        </h2>
      </div>
      <HowWeAssessPopover />
    </header>
  );
}

function HowWeAssessPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent transition-colors hover:text-primary-dark"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        How we assess projects
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17h.01" />
        </svg>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="How Invedi assesses projects"
          className="absolute right-0 top-9 z-30 w-[320px] rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-text shadow-xl"
        >
          {/* TODO(copy): methodology copy */}
          <p className="font-semibold text-text">Hand-authored, not computed</p>
          <p className="mt-2 text-text-muted">
            Each project receives an editorial assessment from the Invedi team. We weigh five
            criteria — location, price vs area, developer track record, build quality and
            energy, and liquidity & resale — and combine them with qualitative judgement into
            a verdict.
          </p>
          <p className="mt-2 text-text-muted">
            Scores reflect our team's opinion, not a black-box formula. Assessments are
            reviewed quarterly.
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Star rating + verdict + summary (public teaser)                     */
/* ------------------------------------------------------------------ */

function ScoreSummary({ review }: { review: ProjectReview }) {
  const v = VERDICT_STYLE[review.verdict];
  const stars = scoreToStars(review.score);
  return (
    <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[auto_1fr] lg:gap-10">
      <div className="flex flex-col items-start gap-3">
        {/* Public rating: stars only. The numeric score is revealed in the gated block
            below (GatedScore) and nowhere else. Sub-6.5 projects show no stars. */}
        {stars >= 1 && <InvediStars stars={stars} size="lg" />}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] font-semibold ${v.bg} ${v.text} ${v.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
          {review.verdict}
        </span>
      </div>
      <p className="max-w-3xl text-[15px] leading-relaxed text-text">{review.summary}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Numeric score (gated) — the ONLY place the number appears           */
/* ------------------------------------------------------------------ */

/** Sits at the top of the gated full analysis, next to the star rating, so the unlocked view
 *  reads as a self-contained assessment: stars → number → strengths → criteria. This numeric
 *  score is intentionally the single public-reachable place the number is shown (behind signup);
 *  every other surface shows stars only. */
function GatedScore({ review }: { review: ProjectReview }) {
  const stars = scoreToStars(review.score);
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border bg-surface/40 px-5 py-5 sm:px-7">
      <p className="w-full text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
        Overall score
      </p>
      {stars >= 1 && <InvediStars stars={stars} size="md" />}
      <span className="inline-flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tabular-nums text-text">{review.score.toFixed(1)}</span>
        <span className="text-base text-text-muted">/ 10</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Strengths / Points to consider                                      */
/* ------------------------------------------------------------------ */

function PointsRow({ review }: { review: ProjectReview }) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 border-t border-border bg-surface/40 px-5 py-6 sm:px-7 md:grid-cols-2">
      <PointsList
        title="Strengths"
        items={review.strengths}
        marker={<CheckMarker />}
        labelColor="text-emerald-700"
      />
      <PointsList
        title="Points to consider"
        items={review.considerations}
        marker={<DiamondMarker />}
        labelColor="text-amber-800"
      />
    </div>
  );
}

function PointsList({
  title,
  items,
  marker,
  labelColor,
}: {
  title: string;
  items: string[];
  marker: React.ReactNode;
  labelColor: string;
}) {
  return (
    <div>
      <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${labelColor}`}>{title}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-[14.5px] leading-snug text-text">
            <span className="mt-0.5 flex-none">{marker}</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckMarker() {
  return (
    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
function DiamondMarker() {
  return (
    <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 22 12 12 22 2 12Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Criteria breakdown                                                  */
/* ------------------------------------------------------------------ */

function Criteria({ review }: { review: ProjectReview }) {
  return (
    <div className="border-t border-border px-5 py-6 sm:px-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
        Criteria breakdown
      </p>
      <ul className="mt-4 divide-y divide-border">
        {review.criteria.map((c) => (
          <CriterionRow key={c.label} {...c} />
        ))}
      </ul>
    </div>
  );
}

function CriterionRow({ label, score, note }: { label: string; score: number; note: string }) {
  // Bar width = score / 10 * 100%, clamped 0–100 for safety.
  const pct = Math.max(0, Math.min(100, score * 10));
  return (
    <li className="grid grid-cols-1 items-center gap-x-5 gap-y-1 py-3 md:grid-cols-[200px_56px_140px_1fr]">
      <span className="font-semibold text-text">{label}</span>
      <span className="text-[15px] font-semibold tabular-nums text-text">{score.toFixed(1)}</span>
      <span className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </span>
      <span className="text-[13.5px] leading-snug text-text-muted">{note}</span>
    </li>
  );
}
