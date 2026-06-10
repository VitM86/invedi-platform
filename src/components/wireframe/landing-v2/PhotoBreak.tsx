/**
 * PhotoBreak — full-bleed editorial pause between sections on /v2.
 *
 * Edge-to-edge image, no max-width, no inner content by default. Optional one-liner in the
 * display serif can sit over a soft scrim — used sparingly per brief. onError gradient fallback
 * is provided by RegionImage.
 */

import type { CSSProperties } from "react";
import { RegionImage } from "../explore/RegionImage";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

export function PhotoBreak({
  src,
  alt,
  caption,
  height = "h-[60vh] min-h-[420px] lg:h-[68vh]",
}: {
  src: string;
  alt: string;
  /** Optional single editorial line set over a subtle scrim. */
  caption?: string;
  /** Tailwind height classes — override to make a break more cinematic. */
  height?: string;
}) {
  return (
    <section className={`relative w-full overflow-hidden ${height}`}>
      <RegionImage
        src={src}
        label={alt}
        loading="eager"
        showLabel={false}
        gradientClassName="bg-gradient-to-br from-[#cbb59b] via-[#a98a6b] to-[#4a4034]"
        className="absolute inset-0 h-full w-full"
      />
      {caption && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-14 lg:px-14 lg:pb-20">
            <p
              className="mx-auto max-w-3xl text-[26px] font-light leading-[1.25] tracking-tight text-white sm:text-[32px] lg:text-[40px]"
              style={SERIF}
            >
              {caption}
            </p>
          </div>
        </>
      )}
    </section>
  );
}
