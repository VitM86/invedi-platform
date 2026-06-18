"use client";

/**
 * HeroV3 — redesigned hero for /v3.
 *
 * Layout: ONE rounded card inset from the viewport (20px sides + bottom, ~12px top, ~94vh
 * tall). The card has `overflow-hidden + rounded-3xl`; everything inside is absolutely
 * positioned over the photo:
 *   - HeroBackground (photo + warm gradient overlay) fills the card.
 *   - The glass navbar sits at the very top, sharing the card's rounded top corners by way
 *     of the parent's clip. Photo is visibly blurred THROUGH the navbar.
 *   - Centred content sits in the upper-third (just below the navbar zone).
 *   - Three serif captions pinned to the bottom edge — left / center / right, same baseline.
 *
 * Below the card, this component also renders a FIXED light SiteHeader at the viewport top
 * with opacity tied to scroll: glass navbar fades out and the light header fades in across
 * the last 25% of the hero's scroll range. Implemented against window scrollY + the measured
 * hero height (deterministic — useScroll-with-target proved flaky in headless captures).
 *
 * Entrance animations (Olivia-Harper-style):
 *   1. Background image: 1.06 → 1 scale-in (~1.2s) — inside HeroBackground.
 *   2. Glass navbar: opacity 0 → 1 over 0.5s — inside HeroNavbarV3.
 *   3. Headline: three masked-reveal lines, translateY 100% → 0%, staggered ~150ms.
 *   4. Subhead + buttons: fade + 20px rise after the headline finishes.
 *   5. Bottom captions: subtle fade-in last.
 * prefers-reduced-motion collapses every animation to its final state instantly.
 */

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { CSSProperties } from "react";
import { SUBHEAD_OPTIONS } from "../landing/Hero";
import { AppHeader } from "../AppHeader";
import { HeroBackground } from "./HeroBackground";
import { HeroNavbarV3 } from "./HeroNavbarV3";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

const HEADLINE_LINES = [
  "The curated home",
  "for new-build developments in",
  "Portugal and Spain.",
];

const CAPTIONS = [
  "Verified developments",
  "Market data & comparisons",
  "A direct path to the deal",
];

const BROKER_HREF = "/explore";
const BUYER_HREF = "/explore";
const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroV3() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll-driven crossfade: as the hero exits the viewport, glass nav fades out and the
  // light SiteHeader fades in. Implemented against window scrollY + the measured hero height
  // (more deterministic than useScroll-with-target — that combo proved flaky in headless and
  // can lag the first paint). The crossfade overlaps in the last 25% of the hero's range.
  const [heroH, setHeroH] = useState(1);
  useLayoutEffect(() => {
    if (!heroRef.current) return;
    const measure = () => setHeroH(heroRef.current!.offsetHeight || 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(heroRef.current);
    return () => ro.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const glassOpacity = useTransform(scrollY, [0, heroH * 0.7, heroH * 0.95], [1, 1, 0]);
  const lightOpacity = useTransform(scrollY, [0, heroH * 0.7, heroH * 0.95], [0, 0, 1]);

  const [lightInteractive, setLightInteractive] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setLightInteractive(y > heroH * 0.7));

  return (
    <>
      <section
        ref={heroRef}
        className="relative w-full px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-3"
        style={{ height: "94vh", minHeight: 640 }}
      >
        {/* ONE rounded card — photo + glass nav + content + captions all live inside it. */}
        <div className="relative isolate h-full overflow-hidden rounded-2xl sm:rounded-3xl">
          <HeroBackground
            media={{
              kind: "image",
              src: "/images/landing/hero-balearic.jpg",
              alt: "A premium new-build development on the Mediterranean coast at golden hour",
            }}
          />

          {/* Glass navbar — floating pill, inset 6px from the photo card's top/left/right.
              A thin photo strip is visible around it; backdrop blur turns the part of the
              photo BEHIND the pill into the warm glass tint. */}
          <div className="absolute left-1.5 right-1.5 top-1.5 z-30">
            <HeroNavbarV3 scrollOpacity={glassOpacity} />
          </div>

          {/* Centred content — positioned in the upper third (just below the navbar zone). */}
          <div
            className="absolute inset-x-0 z-20 flex flex-col items-center px-6 text-center lg:px-10"
            style={{ top: "22%" }}
          >
            <h1 className="text-white" style={SERIF}>
              <MaskLine
                reduced={reduced}
                delay={0.20}
                className="block text-[40px] font-light leading-[1.05] tracking-tight sm:text-[64px] lg:text-[88px]"
              >
                {HEADLINE_LINES[0]}
              </MaskLine>
              <MaskLine
                reduced={reduced}
                delay={0.35}
                className="block text-[26px] font-light leading-[1.15] tracking-tight sm:text-[40px] lg:text-[56px]"
              >
                {HEADLINE_LINES[1]}
              </MaskLine>
              <MaskLine
                reduced={reduced}
                delay={0.50}
                className="block text-[26px] font-light leading-[1.15] tracking-tight sm:text-[40px] lg:text-[56px]"
              >
                {HEADLINE_LINES[2]}
              </MaskLine>
            </h1>

            <motion.p
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : 1.20 }}
              className="mx-auto mt-7 max-w-[600px] text-[15px] font-light leading-[1.7] text-white/90 lg:text-[17px]"
            >
              {SUBHEAD_OPTIONS[0]}
            </motion.p>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : 1.32 }}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href={BROKER_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[14px] font-semibold text-white shadow-lg transition hover:bg-primary-hover"
              >
                For brokers &amp; agents
              </Link>
              <Link
                href={BUYER_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[14px] font-semibold text-primary-dark shadow-lg transition hover:bg-white/95"
              >
                For buyers &amp; investors
              </Link>
            </motion.div>
          </div>

          {/* Bottom hairline — 1px warm-neutral line along the very bottom of the hero card.
              Implemented as an absolutely-positioned div (not a CSS border) so its z-index is
              explicit and it sits ABOVE the HeroBackground overlays (multiply gradient + mid-band
              darken + bottom darken) — those would otherwise paint over a CSS border. 1px solid
              (not 0.5px) to render reliably across non-retina displays + subpixel rounding. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px"
            style={{ backgroundColor: "rgba(245, 232, 205, 0.92)" }}
          />

          {/* Bottom captions — three serif lines, same baseline, equal padding. 3-col grid
              with left/center/right text alignment. Side captions hide on mobile. */}
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: EASE, delay: reduced ? 0 : 1.55 }}
            className="absolute inset-x-0 bottom-7 z-20 grid grid-cols-3 items-baseline px-8 sm:bottom-9 sm:px-12 lg:bottom-11 lg:px-16"
            style={SERIF}
          >
            <span className="hidden text-left text-[13px] font-light tracking-wide text-white/85 sm:inline lg:text-[15px]">
              {CAPTIONS[0]}
            </span>
            <span className="text-center text-[13px] font-light tracking-wide text-white/85 lg:text-[15px]">
              {CAPTIONS[1]}
            </span>
            <span className="hidden text-right text-[13px] font-light tracking-wide text-white/85 sm:inline lg:text-[15px]">
              {CAPTIONS[2]}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Fixed light AppHeader — the SAME shared header used on /explore and project pages.
          Mirrors the hero glass navbar's three-part layout (links left / logo center / Sign
          in right). Invisible while the user is in the hero, fades in as they scroll past
          it. pointer-events: none until visible enough to be useful. The AppHeader is
          sticky-positioned for its normal internal-page use, but here the wrapping
          motion.div is position:fixed which takes precedence — sticky is a no-op. */}
      <motion.div
        style={{
          opacity: lightOpacity,
          pointerEvents: lightInteractive ? "auto" : "none",
        }}
        className="fixed inset-x-0 top-0 z-40"
        aria-hidden={!lightInteractive}
      >
        <AppHeader />
      </motion.div>
    </>
  );
}

/** A single headline line set inside an overflow-hidden mask. The inner span slides up from
 *  translateY: 100% → 0% to reveal. Each line gets its own mask so they reveal independently. */
function MaskLine({
  children,
  delay,
  reduced,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  reduced: boolean | null;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={className}
        initial={reduced ? { y: "0%" } : { y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: reduced ? 0 : 0.7, ease: EASE, delay: reduced ? 0 : delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
