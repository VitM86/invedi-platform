/**
 * SectionIntro — shared landing section header: optional teal overline, a title, an optional
 * lead paragraph, and an optional action (e.g. an "Explore all →" link). Two alignments:
 * "left" (title left / action right on desktop) and "center".
 */

import type { ReactNode } from "react";

export function SectionIntro({
  overline,
  title,
  lead,
  action,
  align = "left",
  className = "",
}: {
  overline?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={`${
        center
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className={center ? "" : "max-w-2xl"}>
        {overline && (
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {overline}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{title}</h2>
        {lead && <p className="mt-3 text-lg leading-relaxed text-text-muted">{lead}</p>}
      </div>
      {action && <div className={center ? "mt-6" : "flex-shrink-0"}>{action}</div>}
    </div>
  );
}
