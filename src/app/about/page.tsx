import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Fraunces } from "next/font/google";

import { AppHeader } from "@/components/wireframe/AppHeader";
import { SiteFooter } from "@/components/wireframe/SiteFooter";
import { InvediStars } from "@/components/wireframe/project/StarScore";

/**
 * /about — the About us page.
 *
 * Founder-approved copy is used verbatim where it was supplied to us: the intro/positioning
 * paragraph, the Michelin star line, and the Vision + Mission statements. Sections where the
 * founder's exact prose was NOT supplied (the problem paragraph beyond its opening, the eight
 * feature descriptions, "the world we see" / "what we believe" / "how we win", and the star-tier
 * descriptors) are written faithfully from the founder's hints and marked // TODO(copy) — swap in
 * the verbatim text from the walkthrough doc when available.
 *
 * Editorial layout: Fraunces serif display headings (scoped like /v3), warm palette, generous
 * whitespace, no team photos.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

const SERIF: CSSProperties = { fontFamily: "var(--font-serif)" };
const CREAM = "#F5F2EC";

export const metadata: Metadata = {
  title: "About us — Invedi",
  description:
    "Invedi connects brokers and buyers with verified off-plan residential developments — only those that pass our evaluation on developer credibility, project quality and investment fundamentals.",
};

// ── What Invedi provides — eight capabilities. Labels are the founder's; descriptions are
//    ours from the founder's hints. // TODO(copy): replace with the founder's verbatim text.
const PROVIDES: { label: string; body: string; readMore?: boolean }[] = [
  {
    label: "Fully digital interactive process",
    body: "Browse, compare, shortlist and reserve entirely online — one connected flow from first look to signed reservation, without the back-and-forth email chains.",
  },
  {
    label: "Interactive project map",
    body: "Every development placed in its real geographic context. Explore by country, region and neighbourhood, and see exactly what surrounds each project.",
  },
  {
    label: "Data table overview",
    body: "Units, prices, sizes and availability laid out side by side — so brokers and buyers can compare on the facts, not the pitch.",
  },
  {
    label: "AI-powered sales agent, 24/7 — plus an Invedi sales agent",
    body: "An AI sales agent answers questions instantly, around the clock. When you need a person, an Invedi sales agent follows up within 12 hours.",
  },
  {
    label: "Reservation & Booking system",
    body: "Hold a specific unit for 12–24 hours while you decide — a clear, time-boxed reservation instead of an informal “we’ll hold it for you.”",
  },
  {
    label: "Referral broker network",
    body: "A network of vetted brokers and agents who can refer, co-broke and close deals together across markets.",
  },
  {
    label: "Real-time market intelligence",
    body: "Live pricing, availability and absorption data across markets — so decisions are made on where the market actually is today.",
  },
  {
    label: "Independent Invedi Rating",
    body: "An independent 1–3 star mark of quality and transparency, awarded only to projects that meet our public standard.",
    readMore: true,
  },
];

// ── The star tiers. // TODO(copy): founder to confirm the exact tier names/descriptors.
const STAR_TIERS: { stars: number; name: string; note: string }[] = [
  { stars: 1, name: "Recommended", note: "Meets the Invedi standard on the fundamentals." },
  { stars: 2, name: "Highly recommended", note: "Strong across developer, product and location." },
  { stars: 3, name: "Exceptional", note: "Best-in-class on every measure we assess." },
];

export default function AboutPage() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-background`}>
      <AppHeader />

      <main>
        {/* 1 ── Intro / positioning (verbatim) */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1000px] px-6 py-24 lg:px-10 lg:py-32">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">About Invedi</p>
            <h1
              className="mt-5 max-w-3xl text-[36px] font-light leading-[1.1] tracking-tight text-text sm:text-[48px] lg:text-[60px]"
              style={SERIF}
            >
              Trust, built in.<br />Buyers first. Always.
            </h1>
            {/* Verbatim founder positioning paragraph. */}
            <p className="mt-8 max-w-3xl text-[17px] leading-[1.7] text-text lg:text-[19px]">
              Invedi connects international and national real estate brokers (B2B) and direct buyers
              (B2C) with verified off-plan (newly built) residential development projects we genuinely
              believe in. We don’t list every off-plan project on the market — only those that have
              passed our evaluation on developer credibility, project quality and investment
              fundamentals.
            </p>
          </div>
        </section>

        {/* 2 ── The problem */}
        <Section>
          <Heading eyebrow="The problem">Value you can’t see into</Heading>
          {/* Opening sentence is the founder's; the remainder is a faithful placeholder. */}
          <Prose>
            <p>
              Unlike almost anything else of value, a new-build home is still bought largely in the
              dark. The information that should be open — real prices, real availability, a developer’s
              real track record — is fragmented across portals, brokers and spreadsheets, or held back
              behind intermediaries whose incentives aren’t always yours.
            </p>
            <p>
              {/* TODO(copy): founder's full "Unlike almost anything else of value…" paragraph. */}
              The result is a high entry barrier and a market that runs on opinion rather than evidence —
              where the buyer is usually the last to know, and the easiest project to sell wins over the
              best one to own.
            </p>
          </Prose>
        </Section>

        {/* 3 ── What Invedi provides (eight rows) */}
        <Section cream>
          <Heading eyebrow="What Invedi provides">One platform, end to end</Heading>
          <div className="mt-12 divide-y divide-[#e0d9ca] border-y border-[#e0d9ca]">
            {PROVIDES.map((f, i) => (
              <div
                key={f.label}
                className="grid grid-cols-1 gap-x-8 gap-y-2 py-7 md:grid-cols-[64px_minmax(0,1fr)] lg:py-8"
              >
                <span className="text-[15px] font-light tabular-nums text-text-muted" style={SERIF}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[20px] font-light leading-snug text-text lg:text-[24px]" style={SERIF}>
                    {f.label}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-[1.65] text-text-muted lg:text-[16px]">
                    {f.body}
                  </p>
                  {f.readMore && (
                    <Link
                      href="#"
                      className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-dark transition hover:gap-2.5"
                    >
                      {/* TODO(link): point at the Invedi Rating explainer once it exists. */}
                      Read more
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 4 ── Editorial trio: world we see / what we believe / what we're building */}
        <Section>
          <Heading eyebrow="The world we see">A market ready to open up</Heading>
          <Prose>
            {/* TODO(copy): founder's "the world we see" block. */}
            <p>
              New-build is where the next decade of homes and returns will be created — and it is the
              corner of real estate least served by clear, comparable information. Buyers and investors
              are ready to act across borders; what they lack is a trustworthy place to see the truth of
              a project before they commit.
            </p>
          </Prose>

          <div className="mt-16">
            <Heading eyebrow="What we believe">Transparency is the product</Heading>
            <Prose>
              {/* TODO(copy): founder's "what we believe" block. */}
              <p>
                Quality should be verifiable, not merely claimed. We believe the buyer’s interest comes
                first, that an independent standard beats a louder sales pitch, and that opening up the
                data — honestly and publicly — is what earns lasting trust.
              </p>
            </Prose>
          </div>

          <div className="mt-16">
            <Heading eyebrow="What we’re building">An independent standard — the Invedi Star</Heading>
            <Prose>
              {/* Michelin line — verbatim founder copy. */}
              <p>
                Like the Michelin star for restaurants, the Invedi star rating system is an independent
                mark of quality and transparency for new developments. We do not tell you which home is
                ‘best.’ We hold every project to a clear, public standard — and only those that meet it
                earn the star and are deserved to be listed on our platform.
              </p>
            </Prose>

            {/* Star tiers */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STAR_TIERS.map((t) => (
                <div key={t.stars} className="rounded-2xl border border-border bg-surface/50 p-6">
                  <InvediStars stars={t.stars} size="md" />
                  <h4 className="mt-4 text-[20px] font-light text-text" style={SERIF}>
                    {t.name}
                  </h4>
                  <p className="mt-1 text-[14px] leading-snug text-text-muted">{t.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-text-muted">
              {/* TODO(copy): founder to confirm exact tier names + descriptors. */}
              Projects scoring below the one-star threshold are not listed.
            </p>
          </div>
        </Section>

        {/* 5 ── How we win */}
        <Section cream>
          <Heading eyebrow="How we win">Curation creates trust</Heading>
          <Prose>
            {/* TODO(copy): founder's "how we win" / curation-creates-trust paragraph. */}
            <p>
              We don’t win by listing the most projects — we win by listing the right ones. Every
              development we turn away protects the value of the ones we keep. That discipline compounds:
              the more rigorously we curate, the more the star means, and the more brokers and buyers
              trust that anything on Invedi has already earned its place.
            </p>
          </Prose>
        </Section>

        {/* 6 ── Vision & Mission (verbatim) */}
        <Section>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <Statement label="Vision">
              A world where any new development, anywhere, can be bought with confidence — because its
              quality and its truth are open for everyone to see.
            </Statement>
            <Statement label="Mission">
              To set the independent standard for new-build property — vetting every development and
              rewarding transparency, so buyers and investors everywhere can act with trust.
            </Statement>
          </div>
        </Section>
      </main>

      <SiteFooter showSocials />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Section({ children, cream = false }: { children: React.ReactNode; cream?: boolean }) {
  return (
    <section style={cream ? { backgroundColor: CREAM } : undefined} className={cream ? "" : "bg-white"}>
      <div className="mx-auto max-w-[1000px] px-6 py-20 lg:px-10 lg:py-28">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">{eyebrow}</p>
      <h2
        className="mt-4 max-w-3xl text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[38px] lg:text-[46px]"
        style={SERIF}
      >
        {children}
      </h2>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 max-w-2xl space-y-5 text-[16px] leading-[1.75] text-text lg:text-[18px]">
      {children}
    </div>
  );
}

function Statement({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">{label}</p>
      <p className="mt-5 text-[24px] font-light leading-[1.3] tracking-tight text-text sm:text-[28px] lg:text-[32px]" style={SERIF}>
        {children}
      </p>
    </div>
  );
}
