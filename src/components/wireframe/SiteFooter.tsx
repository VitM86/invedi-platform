/**
 * SiteFooter — simple, light footer for the landing (and reusable elsewhere). Teal wordmark, a
 * short tagline, a few link columns, and a bottom bar. Most links are placeholders (no route);
 * only Explore points somewhere real for now.
 *
 * TODO(open-question): Developers / About / Company / Legal pages don't exist yet — these are
 * placeholder links so the structure reads complete.
 */

import Link from "next/link";

type FooterLink = [label: string, href: string | null];

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

export function SiteFooter() {
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
