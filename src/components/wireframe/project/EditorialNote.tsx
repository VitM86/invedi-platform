/**
 * EditorialNote — "Why we believe in this project": Invedi's analyst-style take. Four
 * structured subsections (location, market, developer, what-to-watch) in a 2x2 grid, plus a
 * "last reviewed" footer. Placeholder copy. Server component.
 */

import type { Project } from "@/lib/mock-data";

// TODO(open-question): show this editorial block on UNVERIFIED projects, or hide it? Currently:
// shown for all, with a stronger "What to watch" note appended when the project isn't verified.

type IconKey = "location" | "market" | "developer" | "watch";

function Icon({ k }: { k: IconKey }) {
  const common = { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.7, stroke: "currentColor" } as const;
  switch (k) {
    case "location":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    case "market":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      );
    case "developer":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.285Z" />
        </svg>
      );
    case "watch":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      );
  }
}

export function EditorialNote({ project }: { project: Project }) {
  const blocks: { icon: IconKey; title: string; body: string }[] = [
    {
      icon: "location",
      title: "Location & lifestyle",
      body: `${project.city} balances connectivity with calm — transport, schools, and retail sit within a short radius. The development suits buyers who value walkability and proximity to the centre. (Placeholder — neighbourhood analysis to follow.)`,
    },
    {
      icon: "market",
      title: "Market position",
      body: `Asking prices here sit broadly in line with comparable new-builds in ${project.region}, with a modest premium reflecting the finish level and amenities. We see room for pricing to hold as the area matures. (Placeholder — comparative pricing rationale to follow.)`,
    },
    {
      icon: "developer",
      title: "Developer track record",
      body: `${project.developer} has delivered prior residential schemes in the region with a consistent completion record. Build quality and handover timelines on past projects have been dependable. (Placeholder — verified delivery history to follow.)`,
    },
    {
      icon: "watch",
      title: "What to watch",
      body: `Completion is targeted for ${project.completion}; new-build timelines can slip, so confirm milestones before committing. Planning approvals and the pace of nearby supply are worth monitoring.${
        project.verified ? "" : " This project is not yet verified on Invedi — additional due diligence is recommended."
      } (Placeholder — honest risk notes to follow.)`,
    },
  ];

  return (
    <section className="rounded border border-border bg-surface p-6">
      <h2 className="text-xl font-semibold text-text">Why we believe in this project</h2>
      <p className="mb-5 text-sm text-text-muted">Invedi&apos;s view on this development</p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.title} className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-surface-tint text-primary">
              <Icon k={b.icon} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text">{b.title}</h3>
              <p className="mt-1 text-sm leading-6 text-text-muted">{b.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-border pt-4 text-xs text-text-muted">
        Last reviewed May 2026 by the Invedi team. We update this view as the project progresses.
      </p>
    </section>
  );
}
