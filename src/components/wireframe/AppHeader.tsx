/**
 * AppHeader — shared light header used everywhere the user is "inside the platform":
 *   - /explore (Regions / Map / Grid)
 *   - /projects/<slug>
 *   - /projects/<slug>/units/<id>
 *   - /v3 SCROLLED state (the glass hero navbar fades out, this fades in over it)
 *
 * NOT used on / or /v2 — those keep their own SiteHeader. /, /v2 lean on the brand-coloured
 * teal wordmark and the host (header on landing) sits over its own content; this header is
 * for the marketplace surface where the dark logo + the three-part layout (links left /
 * centered logo / Sign in right) is the consistent shell.
 *
 * Layout: three-column CSS grid so the logo is precisely centered regardless of how many
 * links are visible at the current breakpoint.
 *   - Left column:   nav links (Explore / Developers / About), small dark-neutral text, pinned
 *                    to the edge inset.
 *   - Center column: dark Invedi logo (graceful text fallback if PNG fails — see LogoImage).
 *   - Right column:  Sign in pill — teal text on a thin-bordered white pill, pinned to the
 *                    edge inset.
 *
 * Insets px-10 sm:px-12 lg:px-14 were tuned on /v3 so the left link group and right Sign in
 * sit at the same viewport-x as the hero glass navbar's content — the scroll crossfade on
 * /v3 thus feels continuous. We reuse the same values for internal pages for a single
 * consistent rhythm site-wide.
 *
 * Sticky top-0 z-30: stays visible while scrolling internal pages. On /v3 the parent wraps
 * this in a position:fixed motion.div so sticky is irrelevant there — no conflict.
 *
 * No avatar. The previous SiteHeader had one but the founder's new direction is "Sign in"
 * only on platform surfaces — account UI surfaces inside flows, not in the chrome.
 */

"use client";

import Link from "next/link";
import { LogoImage } from "./LogoImage";
import { useUnlock } from "./UnlockProvider";

export function AppHeader() {
  const { requestUnlock, requestSignIn } = useUnlock();
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background">
      <div className="grid h-full grid-cols-3 items-center px-10 sm:px-12 lg:px-14">
        {/* Left: nav links. Order: Residences (always visible) → Bulk & fractional (sm+) →
            About (md+). "Residences" is the renamed Explore entry per the latest founder
            session — same destination, new label.
            TODO(open-question): "Residences" vs "All Projects" label, and whether a
            separate Explore entry is still needed — founder to confirm. */}
        <div className="flex items-center gap-6 lg:gap-9">
          <NavLink href="/explore" className="whitespace-nowrap">Invedi Residences</NavLink>
          <NavLink href="/bulk-fractional" className="hidden sm:inline-flex whitespace-nowrap">
            Bulk &amp; fractional
          </NavLink>
          <NavLink href="/about" className="hidden whitespace-nowrap md:inline-flex">About us</NavLink>
        </div>

        {/* Center: dark logo */}
        <div className="flex items-center justify-center">
          <Link href="/" aria-label="Invedi — home" className="inline-flex items-center">
            <LogoImage
              src="/images/logo-dark.png"
              className="h-7 w-auto lg:h-8"
              fallbackColorClass="text-primary-dark"
            />
          </Link>
        </div>

        {/* Right: Login (opens the Sign in popup) + Sign up (opens the qualification popup).
            Both share the session-wide flows from UnlockProvider. */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={requestSignIn}
            className="hidden text-[13px] font-semibold text-text-muted transition-colors hover:text-text sm:inline-flex"
          >
            Login
          </button>
          <button
            type="button"
            onClick={requestUnlock}
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-primary-hover"
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
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
      className={`text-[13px] font-medium tracking-wide text-text-muted transition-colors hover:text-text ${className}`}
    >
      {children}
    </Link>
  );
}
