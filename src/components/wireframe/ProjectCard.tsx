"use client";

/**
 * ProjectCard — hi-fi project tile for the Grid view of /explore, plus a CompactProjectCard
 * used as the hover/focus popover on the Map view.
 *
 * Anatomy mirrors the existing product's unit card (render carousel, top badges, spec chips,
 * footer CTA) but adapted to the marketplace model: it represents a PROJECT, links to the
 * project page, and shows price/area/bedroom RANGES instead of a single unit. There is no
 * Reserve CTA — the card's action is "View project"; buyer CTAs live on the project/unit pages.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/mock-data";
import { availabilityOf, formatPriceRange, formatRange, scoreToStars } from "@/lib/mock-data";
import { projectImages, projectThumb } from "@/lib/images";
import { VerifiedBadge } from "./VerifiedBadge";
import { InvediStars } from "./project/StarScore";

function LocationLine({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm text-text-muted ${className}`}>
      <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      {project.city}, {project.countryLabel}
    </span>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-surface px-2.5 py-1.5 text-[13px] font-medium text-text">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/icon-${icon}.svg`} alt="" className="h-3.5 w-3.5 flex-shrink-0" />
      {label}
    </span>
  );
}

export function ProjectCard({
  project,
  showScore = false,
}: {
  project: Project;
  /** Opt-in Invedi star badge on the render. Off by default so the shared card stays
   *  visually unchanged on / and /v2; the /v3 grid passes this. Sub-6.5 → no badge. */
  showScore?: boolean;
}) {
  const images = projectImages(project.slug, project.heroCount);
  const [idx, setIdx] = useState(0);
  const stars = scoreToStars(project.review.score);

  // TODO(open-question): unverified hierarchy — current default is "badge + slight
  // desaturation". Applied as grayscale + reduced opacity on the render only, text stays full.
  const dim = project.verified ? "" : "opacity-95";
  const renderDim = project.verified ? "" : "grayscale-[0.4]";

  const step = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + delta + images.length) % images.length);
  };

  return (
    <div className={`group flex flex-col overflow-hidden rounded border border-border bg-background shadow-sm transition-shadow hover:shadow-md ${dim}`}>
      {/* Render carousel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={images[idx]}
          alt={`${project.name} render ${idx + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className={`object-cover ${renderDim}`}
        />

        {/* Full-image click target → project page */}
        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${project.name}`}
        />

        {/* Verified badge removed per founder */}
        {/* Save button removed per founder */}

        {/* Invedi star rating — small badge, top-left. Opt-in (showScore) so only /v3 shows
            it; the public rating is stars, never the number. Sub-6.5 projects (0 stars) show
            no badge at all. Decorative/non-interactive so it never blocks the card link. */}
        {showScore && stars >= 1 && (
          <div className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-white/90 px-2 py-1 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <InvediStars stars={stars} size="sm" />
          </div>
        )}

        {/* Carousel arrows */}
        <button
          onClick={(e) => step(e, -1)}
          aria-label="Previous render"
          className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded bg-white/90 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
        >
          <svg className="h-4 w-4 text-text" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={(e) => step(e, 1)}
          aria-label="Next render"
          className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded bg-white/90 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
        >
          <svg className="h-4 w-4 text-text" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <div className="absolute bottom-3 right-3 z-20 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
          {idx + 1} / {images.length}
        </div>
      </div>

      {/* Body — flex column. Grid items stretch by default, so every body fills the row
          height and the View-project button (with mt-auto below) lands on a single baseline
          across cards. */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/projects/${project.slug}`} className="block">
          <h3 className="text-lg font-bold leading-snug text-text hover:underline">{project.name}</h3>
        </Link>
        <p className="mt-0.5 text-sm text-text-muted">{project.developer}</p>
        <LocationLine project={project} className="mt-1.5" />

        {/* Price + completion. The full no-abbreviation format ("€425.000 – €710.000") is
            wide; without nowrap + a slightly smaller font it would wrap to two lines on
            narrow grid columns (xl:grid-cols-4 ≈ 268px body) and shift the chips/button on
            that one card. We keep it on ONE line by:
              - text-base lg:text-lg (down from text-xl) — fits comfortably at 4-col width
              - whitespace-nowrap on both children so neither side breaks mid-amount
              - gap-x-2 so the completion tag never collides with the price visually */}
        <div className="mt-3 flex items-baseline justify-between gap-x-2">
          <p className="whitespace-nowrap text-base font-semibold text-primary-dark lg:text-lg">
            {formatPriceRange(project.priceMin, project.priceMax)}
          </p>
          <p className="whitespace-nowrap text-xs font-medium text-text-muted">{project.completion}</p>
        </div>

        {/* Spec chips. The units chip is replaced with the absolute availability label per
            founder feedback (e.g. "4 of 6 units available"). The block is laid out as a
            DETERMINISTIC two-row grid — bed + area on row 1, the wider availability chip on
            its own row 2 — so the chip height is identical on every card regardless of
            whether availability would have wrapped in a flex-wrap row. */}
        {/* TODO(open-question): founder to confirm — absolute availability on cards + % sold
            on project page, or unify to one format. */}
        {(() => {
          const a = availabilityOf(project);
          return (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <Chip icon="bed" label={`${formatRange(project.bedroomsMin, project.bedroomsMax, "")} bed`} />
              <Chip icon="area" label={`${formatRange(project.areaMin, project.areaMax, "")} m²`} />
              <div className="col-span-2">
                <Chip icon="floors" label={`${a.available} of ${a.total} units available`} />
              </div>
            </div>
          );
        })()}

        {/* Footer CTA — wrapped in a `mt-auto pt-4` div: `mt-auto` pushes the button block
            to the bottom of the body (so buttons land on a single baseline across cards),
            `pt-4` keeps a consistent 16px visual gap between the chips and the button. */}
        <div className="mt-auto pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded bg-primary text-base font-semibold text-white transition hover:bg-primary-hover"
          >
            View project
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CompactProjectCard({ project }: { project: Project }) {
  return (
    <div className="w-64 overflow-hidden rounded border border-border bg-background shadow-xl">
      <div className="relative h-28">
        <Image
          src={projectThumb(project.slug)}
          alt={`${project.name} render`}
          fill
          sizes="256px"
          className={`object-cover ${project.verified ? "" : "grayscale-[0.4]"}`}
        />
        <div className="pointer-events-none absolute left-2.5 top-2.5">
          <VerifiedBadge verified={project.verified} />
        </div>
      </div>
      <div className="p-3">
        <h4 className="truncate text-sm font-bold text-text">{project.name}</h4>
        <p className="truncate text-xs text-text-muted">{project.developer}</p>
        <LocationLine project={project} className="mt-1 text-xs" />
        {/* Compact popover: price on its own line because the full €X,XXX,XXX – €Y,YYY,YYY
            won't fit alongside the availability stat at 256px width. */}
        <div className="mt-2 border-t border-border pt-2">
          <span className="block text-sm font-semibold text-primary-dark">
            {formatPriceRange(project.priceMin, project.priceMax)}
          </span>
          {(() => {
            const a = availabilityOf(project);
            return (
              <span className="mt-0.5 block text-xs text-text-muted">
                {a.available} of {a.total} available
              </span>
            );
          })()}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-2.5 flex h-9 items-center justify-center rounded bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          View project
        </Link>
      </div>
    </div>
  );
}
