/**
 * WhyInvediV2 — the single dark contrast band on /v2.
 *
 * Same four "curated infrastructure" points as v1's WhyInvedi. Visual shift: a deep warm
 * blue-grey band (#3D4852) with light text and serif heading, giving the page its strongest
 * rhythm break (per brief: max one such band on the page).
 */

import type { CSSProperties } from "react";
import { SectionIntroV2 } from "./SectionIntroV2";

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };

function ShieldCheck() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}
function ChartBars() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}
function DocText() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm-1.5 9h6.75m-6.75 3h3.75" />
    </svg>
  );
}
function Trending() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

const POINTS = [
  { title: "Curated & verified", desc: "Every project is checked before it’s listed — developer identity, planning permits, sales mandate.", Icon: ShieldCheck },
  { title: "Market overview", desc: "See how developments compare on price, size and location across regions and countries.", Icon: ChartBars },
  { title: "Data-rich intelligence", desc: "Plans, prices, availability and neighbourhood context, gathered in one consistent place.", Icon: DocText },
  { title: "Discovery to deal", desc: "A clear path from browsing a project to talking to the right person about it.", Icon: Trending },
];

export function WhyInvediV2() {
  return (
    <section style={{ backgroundColor: "#3D4852" }}>
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-36">
        <SectionIntroV2
          align="center"
          tone="dark"
          overline="Why Invedi"
          title="Curated infrastructure for new-build real estate"
          lead="Think of it as the reference layer for the new-build market — the projects worth knowing, with the data to act on them."
        />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ title, desc, Icon }) => (
            <div key={title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white/85" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                <Icon />
              </div>
              <h3 className="mt-5 text-[20px] font-light leading-snug tracking-tight text-white" style={SERIF}>
                {title}
              </h3>
              <p className="mt-2.5 text-[15px] font-light leading-[1.7] text-white/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
