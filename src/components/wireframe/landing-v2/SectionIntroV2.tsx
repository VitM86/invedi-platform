/**
 * SectionIntroV2 — editorial section header for /v2.
 *
 * Differences from v1's SectionIntro: tiny muted uppercase overline with wide letter-spacing
 * (refined eyebrow, no teal), a large light-weight serif title (Fraunces via --font-serif),
 * and a relaxed sans lead. Two alignments; left aligns title and optional action like v1.
 *
 * Scoped to v2 — does NOT replace SectionIntro on `/`.
 */

import type { CSSProperties, ReactNode } from "react";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

export function SectionIntroV2({
  overline,
  title,
  lead,
  action,
  align = "left",
  tone = "light",
  className = "",
}: {
  overline?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  /** "dark" inverts text colours for use on the dark contrast band. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const center = align === "center";
  const dark = tone === "dark";

  const overlineColor = dark ? "text-white/55" : "text-text-muted/85";
  const titleColor = dark ? "text-white" : "text-text";
  const leadColor = dark ? "text-white/75" : "text-text-muted";

  return (
    <div
      className={`${
        center
          ? "mx-auto max-w-3xl text-center"
          : "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className={center ? "" : "max-w-2xl"}>
        {overline && (
          <p
            className={`mb-5 text-[11px] font-medium uppercase tracking-[0.22em] ${overlineColor}`}
          >
            {overline}
          </p>
        )}
        <h2
          className={`text-[34px] font-light leading-[1.1] tracking-tight sm:text-[44px] lg:text-[52px] ${titleColor}`}
          style={SERIF}
        >
          {title}
        </h2>
        {lead && (
          <p
            className={`mt-5 max-w-xl text-[17px] font-light leading-[1.7] ${
              center ? "mx-auto" : ""
            } ${leadColor}`}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className={center ? "mt-8" : "flex-shrink-0"}>{action}</div>}
    </div>
  );
}
