"use client";

/**
 * V3LightHeader — the scrolled-state header that fades in on /v3 after the user scrolls past
 * the hero. Mirrors the hero glass navbar's three-part structure:
 *   - Left:   nav links (Explore, Developers, About)
 *   - Center: Invedi logo — DARK variant so it reads on the white surface
 *   - Right:  Sign in pill
 *
 * Distinct from the shared SiteHeader (which is used on / , /v2, /explore, project pages):
 * SiteHeader keeps its logo-left + nav-center + Sign in + avatar layout; V3LightHeader is
 * the new /v3-only variant. The avatar is intentionally REMOVED here.
 *
 * Insets (px-12 lg:px-14) are tuned to put the left link group and right Sign in at roughly
 * the same viewport-x as the hero glass navbar so the swap on scroll feels continuous.
 */

import Link from "next/link";
import { LogoImage } from "./LogoImage";

export function V3LightHeader() {
  return (
    <header className="h-16 border-b border-border bg-background">
      <div className="grid h-full grid-cols-3 items-center px-10 sm:px-12 lg:px-14">
        {/* Left: nav links */}
        <div className="flex items-center gap-6 lg:gap-9">
          <NavLink href="/explore">Explore</NavLink>
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
            hero header's "white pill, teal text" rhythm. */}
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
