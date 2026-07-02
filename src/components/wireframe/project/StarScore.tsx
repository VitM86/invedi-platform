/**
 * InvediStars — the public-facing Invedi rating: one to three filled premium stars.
 *
 * This REPLACES the retired out-of-10, half-step 5-star visual. Team decision: the public
 * rating is a 1/2/3-star tier (Michelin-style — only earned stars are shown, never empty or
 * half slots), derived from the numeric score by `scoreToStars` in mock-data. The numeric
 * score is no longer shown next to the stars anywhere public; it lives only inside the gated
 * full analysis.
 *
 * `stars` of 0 (sub-6.5 projects) renders NOTHING — callers must simply not show a badge; we
 * never render a "no star" placeholder or label.
 */

import type { CSSProperties } from "react";

export type InvediStarsSize = "sm" | "md" | "lg";

/** Premium antique-gold, deliberately distinct from the teal UI chrome so the rating reads as
 *  an editorial award mark rather than another brand accent. Single constant → never diverges. */
const STAR_GOLD = "#B0842A";

/** Crisp 5-point star (24×24). Filled only — no half/empty variants exist anymore. */
const STAR_PATH =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z";

const DIMS: Record<InvediStarsSize, { star: string; gap: string }> = {
  sm: { star: "h-4 w-4", gap: "gap-[3px]" },
  md: { star: "h-5 w-5", gap: "gap-1" },
  lg: { star: "h-7 w-7", gap: "gap-1.5" },
};

export function InvediStars({
  stars,
  size = "md",
  className = "",
}: {
  /** 0–3 rating from `scoreToStars`. 0 → renders null (no badge). */
  stars: number;
  size?: InvediStarsSize;
  className?: string;
}) {
  const n = Math.min(3, Math.round(stars));
  if (n < 1) return null; // sub-6.5 → nothing at all (see scoreToStars)

  const d = DIMS[size];
  const style: CSSProperties = { color: STAR_GOLD };
  return (
    <div
      className={`inline-flex items-center ${d.gap} ${className}`}
      style={style}
      role="img"
      aria-label={`Invedi rating: ${n} of 3 stars`}
    >
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} className={d.star} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}
