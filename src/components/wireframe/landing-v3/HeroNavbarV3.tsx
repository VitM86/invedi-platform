"use client";

/**
 * HeroNavbarV3 — frosted-glass FLOATING pill overlaid on the /v3 hero card.
 *
 * The parent positions this 6px inset from the photo card's top/left/right edges. The pill
 * has its own 20px corners (concentric-ish with the card's ~28px) and a thin 1px hairline
 * outline so the pill reads clearly against any photo behind it. The glass is rgba(140,134,
 * 123,0.40) + 12.6px backdrop blur — the photo behind the pill is visibly blurred through.
 *
 * Two opacity layers compose multiplicatively:
 *   - Outer wrapper carries the SCROLL-driven fade (1 → 0 as the hero exits viewport),
 *     fed by the parent via a motion value.
 *   - Inner <motion.nav> carries the page-load ENTRANCE fade-in (~0.5s, opacity only).
 */

import Link from "next/link";
import { type MotionValue, motion } from "framer-motion";
import { LogoImage } from "../LogoImage";
import { useUnlock } from "../UnlockProvider";

export function HeroNavbarV3({ scrollOpacity }: { scrollOpacity: MotionValue<number> }) {
  const { requestUnlock, requestSignIn } = useUnlock();
  return (
    <motion.div style={{ opacity: scrollOpacity }}>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[68px] overflow-hidden rounded-[20px] border border-white/25 shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
        style={{
          backgroundColor: "rgba(140,134,123,0.40)",
          backdropFilter: "blur(12.6px)",
          WebkitBackdropFilter: "blur(12.6px)",
        }}
      >
        <div className="grid h-full grid-cols-3 items-center px-5 lg:px-8">
          {/* Left: nav links — Residences (renamed from Explore) + Bulk & fractional + About.
              Developers is intentionally dropped per the latest founder session. Sibling-
              shape to AppHeader so the swap on scroll feels continuous. */}
          <div className="flex items-center gap-6 lg:gap-9">
            <NavLink href="/explore" className="whitespace-nowrap">Invedi Residences</NavLink>
            <NavLink href="/bulk-fractional" className="hidden sm:inline-flex whitespace-nowrap">
              Bulk &amp; fractional
            </NavLink>
            <NavLink href="/about" className="hidden whitespace-nowrap md:inline-flex">About us</NavLink>
          </div>

          {/* Center: Invedi monogram + wordmark — LIGHT variant (gold monogram + cream
              wordmark) so it reads on the dark hero photo. Graceful fallback to a white
              "Invedi" text wordmark if the PNG ever fails to load. */}
          <div className="flex items-center justify-center">
            <Link href="/" aria-label="Invedi — home" className="inline-flex items-center">
              <LogoImage
                src="/images/logo-light.png"
                className="h-11 w-auto lg:h-12"
                fallbackColorClass="text-white"
              />
            </Link>
          </div>

          {/* Right: Login (opens Sign in popup) + Sign up (opens qualification popup). Shared
              session-wide flows from UnlockProvider. */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={requestSignIn}
              className="hidden text-[13px] font-semibold text-white/95 transition-colors hover:text-white sm:inline-flex"
            >
              Login
            </button>
            <button
              type="button"
              onClick={requestUnlock}
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-primary-dark shadow-sm transition hover:bg-white/95"
            >
              Sign up
            </button>
          </div>
        </div>
      </motion.nav>
    </motion.div>
  );
}

function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`text-[13px] font-medium tracking-wide text-white/95 transition-colors hover:text-white ${className}`}
    >
      {children}
    </Link>
  );
}
