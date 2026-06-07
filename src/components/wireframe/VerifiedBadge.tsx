/**
 * VerifiedBadge — trust signal for a project, hi-fi.
 *
 * Verified: emerald pill (emerald-500 on emerald-50) — reads as positive validation, kept
 * deliberately distinct from the teal primary so it never looks like a CTA. Unverified: muted
 * glass pill so the absence is legible but quiet (the card also desaturates — see ProjectCard).
 */

// TODO(open-question): Verified vs unverified visual hierarchy is not finalised. Options:
// (a) badge only, (b) full styling difference, (c) hide unverified behind a filter. Current
// decision: badge here + slight desaturation on unverified cards. Revisit once the trust
// model (verification criteria) is locked.

interface VerifiedBadgeProps {
  verified: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function VerifiedBadge({ verified, size = "sm", className = "" }: VerifiedBadgeProps) {
  const pad = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";
  const icon = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  if (!verified) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-black/45 ${pad} font-semibold text-white backdrop-blur-sm ${className}`}
      >
        Not verified
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-verified/40 bg-verified-bg ${pad} font-semibold text-verified shadow-sm backdrop-blur-sm ${className}`}
    >
      <svg className={icon} fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3L2.6 15.9l1-3-1-3 2.6-1.9 1-3 3.2.2L12 1.5zm-1 13.3l5-5-1.4-1.4L11 12l-1.6-1.6L8 11.8l3 3z"
          clipRule="evenodd"
        />
      </svg>
      Verified
    </span>
  );
}
