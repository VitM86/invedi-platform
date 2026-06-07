/**
 * SiteHeader — shared top bar for the light marketplace pages (Explore / Project / Unit).
 *
 * Airbnb-style treatment: near-white background with a thin hairline bottom border (no fill,
 * no heavy shadow). Brand colour lives only in the "Invedi" wordmark (teal primary). All
 * controls — nav links, Sign in, avatar — are dark neutral so they stay visible on the light
 * background. The logo links to the landing (/). The current section is shown teal +
 * underlined; pass `active` to set it ("explore" by default for the marketplace pages, "home"
 * on the landing where nothing is underlined).
 *
 * (The /comporta dark map page has no header, so there's no conflict there.)
 */

import Link from "next/link";
import Image from "next/image";

export function SiteHeader({
  active = "explore",
}: {
  active?: "home" | "explore" | "developers" | "about";
}) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 lg:px-6">
        {/* Left: logo. Placeholder text wordmark — brand colour (teal). Links home. */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary"
          aria-label="Invedi — home"
        >
          Invedi
        </Link>

        {/* Center: primary nav — dark neutral; the current section is teal + underlined */}
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link
            href="/explore"
            className={
              active === "explore"
                ? "border-b-2 border-primary pb-0.5 text-primary"
                : "text-text-muted transition-colors hover:text-text"
            }
            aria-current={active === "explore" ? "page" : undefined}
          >
            Explore
          </Link>
          <span className="cursor-default text-text-muted transition-colors hover:text-text">Developers</span>
          <span className="cursor-default text-text-muted transition-colors hover:text-text">About</span>
        </nav>

        {/* Right: sign in + avatar */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-semibold text-text sm:inline">Sign in</span>
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
              <Image
                src="/images/avatar.jpg"
                alt="Account"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full border border-background bg-green-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
