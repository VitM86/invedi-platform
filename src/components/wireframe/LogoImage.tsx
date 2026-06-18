"use client";

/**
 * LogoImage — graceful logo loader for the headers (AppHeader + the /v3 hero glass navbar).
 *
 * Uses a plain <img> (with the next-image lint disabled) so we get a real onError event and
 * can swap to a text "Invedi" wordmark if the PNG ever fails to load — the brief mandates
 * the header NEVER renders empty.
 *
 * The fallback wordmark color is passed in so the same component fits both contexts:
 *   - Hero glass header (light/gold logo on dark photo) → fallback color `text-white`
 *   - Scrolled / internal light header (dark logo on white) → fallback color `text-primary-dark`
 *
 * Sizing is driven entirely by the caller via className (e.g. `h-11 lg:h-12 w-auto`); the PNG
 * downsamples on retina because the source asset is 790×549 — well above any header height.
 */

import { useState } from "react";

export function LogoImage({
  src,
  className = "",
  fallbackColorClass,
  fallbackSizeClass = "text-xl lg:text-2xl",
}: {
  src: string;
  className?: string;
  /** Tailwind text-color class used for the wordmark fallback. */
  fallbackColorClass: string;
  /** Optional text-size override for the fallback wordmark. */
  fallbackSizeClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className={`font-extrabold tracking-tight ${fallbackSizeClass} ${fallbackColorClass}`}
      >
        Invedi
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Invedi"
      className={className}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
