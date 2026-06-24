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

import Link from "next/link";
import { LogoImage } from "./LogoImage";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background">
      <div className="grid h-full grid-cols-3 items-center px-10 sm:px-12 lg:px-14">
        {/* Left: nav links. Order: Explore (always visible) → Bulk & fractional (sm+) →
            Developers (sm+) → About (md+). Bulk & fractional is the longest label; it stays
            hidden under sm so the row doesn't overflow into the centered logo column. */}
        <div className="flex items-center gap-6 lg:gap-9">
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/bulk-fractional" className="hidden sm:inline-flex whitespace-nowrap">
            Bulk &amp; fractional
          </NavLink>
          <NavLink href="#" className="hidden sm:inline-flex">Developers</NavLink>
          <NavLink href="#" className="hidden md:inline-flex">About</NavLink>
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

        {/* Right: Sign in pill — teal text on a thin-bordered white pill, mirroring the
            /v3 hero header's "white pill, teal text" rhythm. */}
        <div className="flex items-center justify-end">
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-5 text-[13px] font-semibold text-primary-dark transition hover:bg-surface"
          >
            Sign in
          </Link>
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
