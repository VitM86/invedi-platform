/**
 * BulkIntroBanner — promotional band at the top of the Bulk sub-section.
 *
 * Dark primary band so the conversion ask reads as a "you can do this here" promise rather
 * than just another heading on the white page surface. White headline + sub, primary-teal
 * pill CTA against the dark to keep the brand teal as the visible action signal.
 *
 * Copy + link are placeholders the founder will refine.
 */

import Link from "next/link";

export function BulkIntroBanner() {
  return (
    <section
      className="rounded-2xl px-8 py-12 lg:px-14 lg:py-16"
      style={{ backgroundColor: "#102D2A" }}
    >
      <div className="max-w-3xl">
        {/* TODO(copy): founder to refine positioning + sub-line. */}
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[40px] lg:leading-[1.1]">
          Buy multiple units at off-market discounts
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          Bulk reservations curated for groups of buyers, family offices, and investors —
          aggregated pricing power against verified inventory we negotiate directly with
          developers.
        </p>
        <div className="mt-7">
          {/* TODO(link): wire to onboarding / sign-up flow once it exists. */}
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
