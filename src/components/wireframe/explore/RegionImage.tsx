"use client";

/**
 * RegionImage — lazy-loaded location photo with a graceful fallback.
 *
 * Renders a native <img loading="lazy"> from a LOCAL /public path (no runtime third-party
 * image host). If the file is missing or fails to decode, onError swaps in an on-brand
 * gradient with the location name, so a missing file never shows a broken-image icon. This
 * also means: drop a real photo at the mapped path later and it just appears.
 */

import { useState } from "react";

export function RegionImage({
  src,
  label,
  className = "",
  loading = "lazy",
  fetchPriority,
  /** Override the fallback gradient (e.g. a full-bleed brand gradient for the hero). */
  gradientClassName = "bg-gradient-to-br from-[#ccfbf1] via-[#a7f3e0] to-[#a5f3fc]",
  /** Hide the centred label on the fallback (the hero scrim carries its own text). */
  showLabel = true,
}: {
  src: string;
  label: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  gradientClassName?: string;
  showLabel?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${gradientClassName} ${className}`}
        aria-label={label}
      >
        {showLabel && (
          <span className="px-3 text-center text-sm font-semibold text-primary-dark drop-shadow-sm">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
