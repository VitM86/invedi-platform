"use client";

/**
 * Lightbox — a minimal, dependency-light image viewer for the story gallery.
 *
 * Behaviour: a dark full-screen overlay with the image shown near full-screen (≤90vw/90vh),
 * uncropped (object-contain, aspect ratio preserved). A visible close X sits top-right; prev/next
 * arrows step through the gallery. Closes on the X, on an overlay click (but not a click on the
 * image itself), and on Escape. Left/Right arrow keys navigate; on touch, a horizontal swipe does.
 * Body scroll is locked while open.
 *
 * prefers-reduced-motion: the overlay + image swap instantly (no fade, no zoom). Otherwise a
 * gentle opacity crossfade only — no scale/zoom theatrics.
 *
 * Missing files degrade gracefully to an on-brand gradient with the caption (mirrors RegionImage).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type LightboxImage = { src: string; alt: string };

const EASE = [0.22, 1, 0.36, 1] as const;
const WARM_IMG_FALLBACK = "bg-gradient-to-br from-[#cbb59b] via-[#a98a6b] to-[#4a4034]";

function XIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={dir === "left" ? "M15.75 19.5 8.25 12l7.5-7.5" : "m8.25 4.5 7.5 7.5-7.5 7.5"}
      />
    </svg>
  );
}

/** Uncropped image at ≤90vw/90vh with a graceful gradient fallback if the file fails to load. */
function LightboxFigure({ image }: { image: LightboxImage }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex h-[70vh] w-[85vw] max-w-[900px] items-center justify-center rounded-lg ${WARM_IMG_FALLBACK}`}
        aria-label={image.alt}
      >
        <span className="px-4 text-center text-sm font-semibold text-white/90 drop-shadow">
          {image.alt}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      onError={() => setFailed(true)}
      className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
    />
  );
}

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: LightboxImage[];
  /** Currently-open image index, or null when the lightbox is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const reduced = useReducedMotion();
  const open = index !== null;
  const count = images.length;

  const go = useCallback(
    (dir: number) => {
      if (index === null || count === 0) return;
      onIndexChange((index + dir + count) % count);
    },
    [index, count, onIndexChange],
  );

  // Keyboard: Esc closes, ←/→ navigate. Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  // Touch swipe (mobile): a horizontal drag over the image steps prev/next.
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close X — top-right, always visible */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-5 sm:top-5"
          >
            <XIcon />
          </button>

          {/* Prev / Next arrows (only when there's more than one image) */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-5 sm:h-12 sm:w-12"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-5 sm:h-12 sm:w-12"
              >
                <ChevronIcon dir="right" />
              </button>
            </>
          )}

          {/* Image — clicks/taps here don't close; keyed by index so navigation crossfades */}
          <motion.div
            key={index}
            className="flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
          >
            <LightboxFigure image={images[index]} />
          </motion.div>

          {/* Counter */}
          {count > 1 && (
            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70 sm:bottom-6">
              {index + 1} / {count}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
