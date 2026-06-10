"use client";

/**
 * HeroBackground — swappable media seam for the /v3 hero.
 *
 * Today it renders a single image with a warm-dusk gradient overlay on top. The seam is the
 * `media` prop: branching on `media.kind` will let us swap to a crossfading slideshow or a
 * video without touching anything else in the hero. The gradient + subtle bottom-darken layers
 * apply on top regardless of media type.
 *
 * TODO: slideshow/video variants planned. When wired:
 *   - "slideshow": render a crossfading stack of <RegionImage> driven by an internal timer.
 *   - "video": render <video autoPlay muted loop playsInline> with the same overlays on top.
 */

import { motion, useReducedMotion } from "framer-motion";
import { RegionImage } from "../explore/RegionImage";

export type HeroMedia = { kind: "image"; src: string; alt: string };
// TODO: slideshow/video variants planned

/** Top→bottom warm-dusk gradient, per the Figma overlay. */
const OVERLAY_GRADIENT =
  "linear-gradient(180deg, #A69E8D 0%, #63635C 36%, #616157 68%, #635C4D 100%)";

export function HeroBackground({ media }: { media: HeroMedia }) {
  const reduced = useReducedMotion();
  return (
    <>
      {/* Photo layer — entrance: subtle scale-in 1.06 → 1 over ~1.2s (skipped if reduced-motion). */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={reduced ? { scale: 1 } : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {media.kind === "image" && (
          <RegionImage
            src={media.src}
            label={media.alt}
            loading="eager"
            fetchPriority="high"
            showLabel={false}
            gradientClassName="bg-gradient-to-br from-[#7a6f5e] via-[#5a544a] to-[#3d3a35]"
            className="absolute inset-0 h-full w-full"
          />
        )}
      </motion.div>

      {/* Warm gradient overlay — multiply blend at low opacity so the photo stays clearly
          visible and reads warm/golden, with a gentle darkening toward the middle for text
          contrast. Tuned down from the brief's literal "apply gradient" to match the
          reference, where the photo is essentially unpainted. */}
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
