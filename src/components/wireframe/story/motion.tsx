"use client";

/**
 * Motion primitives for the /story editorial template. These are the scroll-triggered cousins of
 * the /v3 hero motion (same cubic-bezier EASE, same masked-line + fade-rise idioms), fired on
 * scroll-into-view instead of on mount. Every primitive collapses to its final state under
 * prefers-reduced-motion (via framer-motion's useReducedMotion), so nothing animates for users
 * who ask for less.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-12% 0px" } as const;

/** Fade + rise a block as it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0 : 0.7, ease: EASE, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked heading reveal — the line sits in an overflow-hidden mask and slides up from below.
 * Use one MaskReveal per line for a staggered editorial headline (pass increasing `delay`).
 *
 * Implementation note: the OUTER mask element is the intersection target and is never transformed
 * (it just orchestrates a variant), so its box stays in normal flow and the observer fires
 * reliably. The INNER span is what actually slides — driven purely by the variant, so it can start
 * translated 110% out of the mask without ever moving the observed box off-screen (which is what
 * silently broke a naive whileInView-on-the-transformed-span version). `trigger="mount"` animates
 * on load (use for the hero, which sits at the fold); default triggers on scroll-into-view.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
  trigger = "inView",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  trigger?: "inView" | "mount";
}) {
  const reduced = useReducedMotion();
  const orchestration =
    trigger === "mount"
      ? { animate: "show" as const }
      : { whileInView: "show" as const, viewport: VIEWPORT };
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" {...orchestration}>
      <motion.span
        className={`block ${className ?? ""}`}
        variants={{ hidden: { y: reduced ? "0%" : "110%" }, show: { y: "0%" } }}
        transition={{ duration: reduced ? 0 : 0.8, ease: EASE, delay: reduced ? 0 : delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * Parallax — a full-bleed image layer that drifts slowly as its section scrolls through the
 * viewport (the mid-page cinematic "moment"). `children` should be a full-size image. The inner
 * layer is oversized (−inset-y-[18%]) so the ±`amount`% drift never reveals an edge. Under
 * reduced-motion the drift is zeroed. Wrap in a `relative overflow-hidden` section.
 */
export function Parallax({
  children,
  className,
  amount = 12,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : [`-${amount}%`, `${amount}%`],
  );
  return (
    <div ref={ref} className={className}>
      <motion.div className="absolute inset-x-0 -inset-y-[18%]" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/** Slow scale-in for a hero/full-bleed image. Runs on mount (hero is in view on load). */
export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { scale: 1 } : { scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={{ duration: reduced ? 0 : 1.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
