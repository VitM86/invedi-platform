/**
 * FractionalIntroBanner — promotional band at the top of the Fractional sub-section.
 *
 * Sibling-shape to BulkIntroBanner so the two sub-sections feel like a matched pair:
 * same dark #102D2A background, same headline weight, same teal pill CTA. Copy diverges
 * to position the fractional product (co-investing in a single asset, owning a share)
 * vs. Bulk's "multiple units at discounts".
 */

import Link from "next/link";

export function FractionalIntroBanner() {
  return (
    <section
      className="rounded-2xl px-8 py-12 lg:px-14 lg:py-16"
      style={{ backgroundColor: "#102D2A" }}
    >
      <div className="max-w-3xl">
        {/* TODO(copy): founder to refine positioning + sub-line. */}
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[40px] lg:leading-[1.1]">
          Co-own a high-value asset, one share at a time
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          Fractional ownership splits a single high-value asset — a hotel, a vineyard, a
          piece of land — into shares held by a small group of investors. Lower entry, full
          legal title, exits via a curated secondary marketplace.
        </p>
        <div className="mt-7">
          {/* TODO(link): wire to fractional onboarding / sign-up flow once it exists. */}
          <Link
            href="#"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
          >
            Access platform
            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
