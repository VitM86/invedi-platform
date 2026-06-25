/**
 * SiteFooter — simple, light footer for the landing (and reusable elsewhere). Teal wordmark, a
 * short tagline, a few link columns, and a bottom bar. Most links are placeholders (no route);
 * only Explore points somewhere real for now.
 *
 * `showSocials` (default false) gates the Instagram + LinkedIn row under the tagline. /, /v2
 * leave it off so their footer presentation is unchanged from before. /v3 turns it on per the
 * latest founder feedback. Once approved we can flip the default to `true` and drop the prop.
 *
 * TODO(open-question): Developers / About / Company / Legal pages don't exist yet — these are
 * placeholder links so the structure reads complete.
 */

import Link from "next/link";

type FooterLink = [label: string, href: string | null];

/** Inline line-icon paths kept small and consistent (h-4.5, 1.6 stroke) — no third-party icon
 *  library on /v3 yet, and the rest of the site uses inline SVG for parity. */
function InstagramIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path strokeLinecap="round" d="M8 10v7" />
      <circle cx="8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-4a2.5 2.5 0 0 1 5 0v4M12 10v7" />
    </svg>
  );
}

const SOCIAL_LINKS: { label: string; href: string; Icon: typeof InstagramIcon }[] = [
  // TODO(link): replace # with the real Instagram / LinkedIn handles.
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn",  href: "#", Icon: LinkedInIcon },
];

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  { title: "Platform", links: [["Explore", "/explore"], ["Developers", null], ["About", null]] },
  { title: "Company", links: [["About", null], ["Contact", null], ["Careers", null]] },
  { title: "Legal", links: [["Terms", null], ["Privacy", null], ["Cookies", null]] },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="text-sm font-bold text-text">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            {href ? (
              <Link href={href} className="text-sm text-text-muted transition-colors hover:text-text">
                {label}
              </Link>
            ) : (
              <span className="cursor-default text-sm text-text-muted">{label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ showSocials = false }: { showSocials?: boolean } = {}) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-primary"
              aria-label="Invedi — home"
            >
              Invedi
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
              Curated, data-rich infrastructure for new-build developments in Europe — starting in
              Portugal and Spain.
            </p>

            {showSocials && (
              <div className="mt-5 flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {COLUMNS.map((col) => (
            <FooterColumn key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            © 2026 Invedi · Prototype — placeholder content, not for distribution.
          </p>
          <p className="text-xs text-text-muted">Made for new-build real estate.</p>
        </div>
      </div>
    </footer>
  );
}
