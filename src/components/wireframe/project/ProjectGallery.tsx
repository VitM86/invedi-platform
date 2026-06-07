"use client";

/**
 * ProjectGallery — hero render carousel for the project page. Wide main image + thumbnail
 * strip + arrows + counter, with the verified badge overlaid. Reuses the repo's gallery
 * render assets via projectImages().
 */

import { useState } from "react";
import Image from "next/image";
import { projectImages } from "@/lib/images";
import { VerifiedBadge } from "../VerifiedBadge";

export function ProjectGallery({
  slug,
  name,
  verified,
  count,
}: {
  slug: string;
  name: string;
  verified: boolean;
  count: number;
}) {
  const images = projectImages(slug, count);
  const [idx, setIdx] = useState(0);
  const go = (delta: number) => setIdx((i) => (i + delta + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded bg-gray-100 sm:aspect-[16/9]">
        <Image
          src={images[idx]}
          alt={`${name} render ${idx + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 860px"
          className="object-cover"
        />

        <div className="absolute left-4 top-4">
          <VerifiedBadge verified={verified} size="md" />
        </div>

        <button
          onClick={() => go(-1)}
          aria-label="Previous render"
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded bg-white/90 shadow-sm transition hover:bg-white"
        >
          <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next render"
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded bg-white/90 shadow-sm transition hover:bg-white"
        >
          <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <div className="absolute bottom-4 right-4 rounded bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
          {idx + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-2 flex gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`relative h-16 w-24 overflow-hidden rounded border-2 transition-colors ${
              i === idx ? "border-primary" : "border-transparent hover:border-border"
            }`}
          >
            <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
