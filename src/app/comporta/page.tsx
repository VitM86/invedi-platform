import type { Metadata } from "next";
import Link from "next/link";
import { TerrainMap } from "@/components/map/TerrainMap";
import { comporta } from "@/lib/regions";

export const metadata: Metadata = {
  title: "Comporta — Invedi",
  description: "Interactive terrain bird-view of new-build developments around Comporta, Portugal.",
};

export default function ComportaPage() {
  return (
    <main className="relative h-screen w-full">
      {/* Back control — page-level (kept OUT of TerrainMap so it doesn't duplicate the
          Explore drawer's Close). Always visible; dark-glass to match the premium aesthetic.
          Works even when /comporta is opened via a shared direct link (no browser history). */}
      <Link
        href="/explore"
        aria-label="Back to Explore"
        className="absolute left-4 top-4 z-40 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 py-2 pl-3 pr-4 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70 sm:left-6 sm:top-6"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Explore
      </Link>

      <TerrainMap region={comporta} />
    </main>
  );
}
