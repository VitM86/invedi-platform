/**
 * Placeholder — neutral stand-in for an image/render at wireframe stage.
 *
 * Renders a grey box with a faint diagonal hatch and an optional centred label so
 * reviewers read it as "image goes here", never as real art. No real photos are used
 * anywhere in these wireframes.
 */

interface PlaceholderProps {
  label?: string;
  className?: string;
  /** Tailwind aspect utility, e.g. "aspect-[4/3]". Ignored if a height class is in className. */
  aspect?: string;
}

export function Placeholder({ label, className = "", aspect }: PlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded bg-[#ececee] text-text-muted ${aspect ?? ""} ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 11px, rgba(0,0,0,0.04) 11px, rgba(0,0,0,0.04) 12px)",
      }}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-1.5 px-3 text-center">
        <svg className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
        </svg>
        {label && <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>}
      </div>
    </div>
  );
}
