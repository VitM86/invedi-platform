/**
 * MapPlaceholder — light static fallback shown when Mapbox can't load (no token / failure).
 * Same calm light look as the page so it never reads as broken. Plain (server-renderable).
 */

export function MapPlaceholder({ className = "", note }: { className?: string; note?: string }) {
  return (
    <div className={`relative overflow-hidden rounded border border-border bg-[#eef2f3] ${className}`}>
      <div className="absolute left-[6%] top-[12%] h-[60%] w-[52%] rounded-[45%] bg-[#e3ebe6]" />
      <div className="absolute right-[8%] bottom-[10%] h-[55%] w-[44%] rounded-[48%] bg-[#e3ebe6]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,130,135,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,130,135,0.10) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <svg
        className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-full text-primary drop-shadow-md"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="#fff"
        strokeWidth={0.75}
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
      <div className="absolute bottom-2 left-3 rounded bg-white/85 px-2 py-0.5 text-[11px] text-text-muted">
        {note ?? "Map unavailable — static placeholder"}
      </div>
    </div>
  );
}
