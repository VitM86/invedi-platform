"use client";

/**
 * HeroBackground — swappable media seam for the /v3 hero.
 *
 * The `media` prop branches on `media.kind`:
 *   - "image":     a single still (original behaviour).
 *   - "slideshow": a crossfading stack of images, auto-advancing on a timer (reference:
 *                  aera-listings.com featured). Subtle opacity crossfade, no hard cuts.
 * The warm gradient + darken overlays apply on top regardless of media type.
 *
 * prefers-reduced-motion: the slideshow holds on the first slide (no auto-advance, no fade)
 * and the entrance scale-in is skipped.
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RegionImage } from "../explore/RegionImage";

export type HeroSlide = { src: string; alt: string };
export type HeroMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "slideshow"; slides: HeroSlide[]; intervalMs?: number };

/** Top→bottom warm-dusk gradient, per the Figma overlay. */
const OVERLAY_GRADIENT =
  "linear-gradient(180deg, #A69E8D 0%, #63635C 36%, #616157 68%, #635C4D 100%)";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Shared image renderer so still + slideshow slides look identical. */
function Slide({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  return (
    <RegionImage
      src={src}
      label={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      showLabel={false}
      gradientClassName="bg-gradient-to-br from-[#7a6f5e] via-[#5a544a] to-[#3d3a35]"
      className="absolute inset-0 h-full w-full"
    />
  );
}

function Slideshow({ slides, intervalMs = 10000 }: { slides: HeroSlide[]; intervalMs?: number }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Hold on the first slide when motion is reduced, or when there's nothing to cycle.
    if (reduced || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [reduced, slides.length, intervalMs]);

  return (
    <>
      {slides.map((s, i) => (
        <motion.div
          key={s.src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 1.4, ease: EASE }}
          aria-hidden={i !== index}
        >
          {/* Eager-load the first two slides so the opening crossfade is never blank. */}
          <Slide src={s.src} alt={s.alt} eager={i < 2} />
        </motion.div>
      ))}
    </>
  );
}

export function HeroBackground({ media }: { media: HeroMedia }) {
  const reduced = useReducedMotion();
  return (
    <>
      {/* Photo layer — entrance: subtle scale-in 1.06 → 1 over ~1.2s (skipped if reduced-motion). */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={reduced ? { scale: 1 } : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
      >
        {media.kind === "image" ? (
          <Slide src={media.src} alt={media.alt} eager />
        ) : (
          <Slideshow slides={media.slides} intervalMs={media.intervalMs} />
        )}
      </motion.div>

      {/* Warm gradient overlay — multiply blend at low opacity so the photo stays clearly
          visible and reads warm/golden, with a gentle darkening toward the middle for text
          contrast. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: OVERLAY_GRADIENT, mixBlendMode: "multiply", opacity: 0.45 }}
      />
      {/* Mid-band darken for headline contrast — peaks ~40-60% down, ~0 at top and bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 50%, transparent 100%)",
        }}
      />
      {/* Soft bottom darken — improves legibility of the bottom captions. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
      />
    </>
  );
}
