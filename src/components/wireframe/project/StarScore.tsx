/**
 * StarScore — reusable visual representation of an out-of-10 score.
 *
 * Renders 5 stars (full / half / empty) mapped from the same single number, plus the numeric
 * score itself ("8.3 / 10"). Half-step granularity by way of `Math.round(score) / 2` — the
 * mapping is deterministic and reads as one decimal of precision visually.
 *
 * TODO: compact score badge on cards (later) — this component is the seed for a small
 * `<StarScore size="sm" hideOutOf />` variant we'll drop into ProjectCard. Today the only
 * caller is the project-page Invedi-score block.
 */

import type { ReactNode } from "react";

export type StarScoreSize = "lg" | "md" | "sm";

export function StarScore({
  score,
  size = "lg",
  showNumeric = true,
  outOf = true,
  className = "",
}: {
  /** Numeric score on a 0–10 scale, one decimal expected (e.g. 8.3). */
  score: number;
  /** "lg" used on the project page; "md"/"sm" reserved for future compact badges. */
  size?: StarScoreSize;
  /** Show the numeric "8.3" next to the stars. */
  showNumeric?: boolean;
  /** Append " / 10" to the numeric (turn off in tight badge contexts). */
  outOf?: boolean;
  className?: string;
}) {
  // Round /10 to nearest half-step on /5: scoreOut10 → starsOut5.
  const starsOut5 = Math.round(score) / 2;

  const sizes = {
    lg: { star: "h-6 w-6", num: "text-3xl font-bold", suffix: "text-base text-text-muted" },
    md: { star: "h-5 w-5", num: "text-xl font-bold", suffix: "text-sm text-text-muted" },
    sm: { star: "h-3.5 w-3.5", num: "text-sm font-semibold", suffix: "text-xs text-text-muted" },
  } as const;
  const s = sizes[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= starsOut5) return <Star key={i} kind="full" className={`${s.star} text-primary`} />;
          if (i - 0.5 <= starsOut5) return <Star key={i} kind="half" className={`${s.star} text-primary`} />;
          return <Star key={i} kind="empty" className={`${s.star} text-border`} />;
        })}
      </div>
      {showNumeric && (
        <span className="inline-flex items-baseline gap-1.5">
          <span className={`${s.num} text-text`}>{score.toFixed(1)}</span>
          {outOf && <span className={s.suffix}>/ 10</span>}
        </span>
      )}
    </div>
  );
}

function Star({
  kind,
  className,
}: {
  kind: "full" | "half" | "empty";
  className: string;
}): ReactNode {
  // Same shape, different fill. Use a clipPath to render the half-fill so we keep one SVG path.
  const path =
    "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z";
  if (kind === "full") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d={path} />
      </svg>
    );
  }
  if (kind === "empty") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path d={path} />
      </svg>
    );
  }
  // half — left half filled, right half outlined.
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <clipPath id="star-half-clip">
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <path d={path} fill="currentColor" clipPath="url(#star-half-clip)" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  );
}
