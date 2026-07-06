"use client";

/**
 * StoryTemplate — the ONE editorial "story" landing template rendered by /story/[slug]. Every
 * project with a filled `project.story` renders from this component and its data alone; a new
 * project needs zero template changes (all new sections are gated on optional story fields). Style
 * = our own design system (Fraunces serif via --font-serif set by the route, warm off-whites
 * #F5F2EC / #e6dfd2, teal for CTAs only). Motion comes from ./motion (scroll-reveals + a parallax
 * full-bleed moment, all reduced-motion aware). Voice is the neutral Invedi evaluator — facts and
 * assessment, no pressure, no urgency theatrics, no exclamation marks. This page sits BEFORE the
 * gate: its job is to make people want to buy, then drive the qualification flow
 * (useUnlock().requestUnlock()).
 *
 * // TODO(content): placeholder editorial, to be authored per project via admin later.
 * // TODO(photo): several image slots are placeholders — see the photo shopping list for the
 * //   lifestyle-with-people shots to source (scene + suggested filename per slot).
 */

import { useState } from "react";
import Link from "next/link";
import {
  formatPriceFull,
  scoreToStars,
  type Project,
  type ProjectStory,
} from "@/lib/mock-data";
import { InvediStars } from "../project/StarScore";
import { RegionImage } from "../explore/RegionImage";
import { LogoImage } from "../LogoImage";
import { useUnlock } from "../UnlockProvider";
import { Slideshow } from "../landing-v3/HeroBackground";
import { Reveal, MaskReveal, ScaleIn, Parallax } from "./motion";
import { Lightbox } from "./Lightbox";

const SERIF = { fontFamily: "var(--font-serif)" } as const;
const CONTAINER = "mx-auto max-w-[1280px] px-6 lg:px-10";
const CREAM = "#F5F2EC";
const HAIRLINE = "#e6dfd2";
const WARM_IMG_FALLBACK = "bg-gradient-to-br from-[#cbb59b] via-[#a98a6b] to-[#4a4034]";

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

/** Shared sign-up CTA — opens the qualification flow. Not auth; session-only unlock. */
function SignupButton({
  label,
  size = "md",
  variant = "solid",
}: {
  label: string;
  size?: "md" | "lg";
  variant?: "solid" | "white";
}) {
  const { requestUnlock } = useUnlock();
  const sz = size === "lg" ? "h-14 px-8 text-base" : "h-11 px-6 text-sm";
  const look =
    variant === "white"
      ? "bg-white text-primary-dark hover:bg-white/90"
      : "bg-primary text-white hover:bg-primary-hover";
  return (
    <button
      type="button"
      onClick={requestUnlock}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold shadow-sm transition ${sz} ${look}`}
    >
      {label}
      <Arrow />
    </button>
  );
}

/** Anchor id of the residences/units section — the scroll target for the units CTAs. */
const RESIDENCES_ID = "residences";

/** "villa" for all-villa projects, "unit" otherwise — keeps CTA copy data-driven. */
function unitNoun(project: Project): string {
  return project.units.every((u) => u.type.toLowerCase().includes("villa")) ? "villa" : "unit";
}

/**
 * Units CTA (advisor feedback): promises content instead of a generic sign-up ask. Scrolls to
 * the residences section; anonymous visitors get the usual signup gate right after the scroll
 * starts (same requestUnlock mechanic, just deferred so the movement reads first). Signed-up
 * users simply land on the units.
 */
function UnitsCtaButton({
  label,
  size = "md",
  variant = "solid",
}: {
  label: string;
  size?: "md" | "lg";
  /** outline = quiet secondary treatment for in-page placements on light backgrounds. */
  variant?: "solid" | "outline";
}) {
  const { unlocked, requestUnlock } = useUnlock();
  const sz = size === "lg" ? "h-14 px-8 text-base" : "h-11 px-6 text-sm";
  const look =
    variant === "outline"
      ? "border border-text/25 bg-transparent text-text hover:border-text/50 hover:bg-white"
      : "bg-primary text-white shadow-sm hover:bg-primary-hover";
  const onClick = () => {
    document.getElementById(RESIDENCES_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!unlocked) setTimeout(requestUnlock, 450);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition ${sz} ${look}`}
    >
      {label}
      {/* Down arrow — this CTA moves you down the page, not away from it. */}
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25 12 15.75 4.5 8.25" />
      </svg>
    </button>
  );
}

function Overline({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`text-[11px] font-medium uppercase tracking-[0.22em] ${tone === "light" ? "text-white/70" : "text-text-muted"}`}>
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- Hero */

function StoryHeader() {
  const { requestUnlock } = useUnlock();
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className={`${CONTAINER} flex items-center justify-between py-5`}>
        <Link href="/" aria-label="Invedi — home" className="inline-flex items-center drop-shadow">
          <LogoImage
            src="/images/logo-light.png"
            className="h-9 w-auto sm:h-10"
            fallbackColorClass="text-white"
          />
        </Link>
        <button
          type="button"
          onClick={requestUnlock}
          className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-primary-dark shadow-sm backdrop-blur transition hover:bg-white"
        >
          Sign up for full access
        </button>
      </div>
    </header>
  );
}

function Hero({ project, story }: { project: Project; story: ProjectStory }) {
  const stars = scoreToStars(project.review.score);

  // CTA promises content (advisor feedback): price list where prices are public, the unit
  // list itself where they aren't. Counts and nouns come from data — nothing hardcoded.
  const noun = unitNoun(project);
  const ctaLabel = project.priceOnRequest
    ? `View all ${project.totalUnits} ${noun}s`
    : "Browse price list";

  // Scarcity from real availability — neutral phrasing only, no countdowns. Nothing sold yet
  // → lead with how few there are in total instead of a meaningless "8 of 8".
  const available = project.units.filter((u) => u.status === "available").length;
  const scarcity =
    available === project.totalUnits
      ? `${project.totalUnits} ${noun}s only`
      : `${available} of ${project.totalUnits} remaining`;

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-[#3d3a35]">
      <ScaleIn className="absolute inset-0">
        {/* Slideshow when the project supplies ≥2 hero slides (reuses the /v3 crossfade
            mechanism); otherwise the single still. Either way the overlays + content below sit
            on top unchanged. */}
        {story.heroSlides && story.heroSlides.length > 1 ? (
          <Slideshow slides={story.heroSlides} />
        ) : (
          <RegionImage
            src={story.collage[0]}
            label={project.name}
            loading="eager"
            fetchPriority="high"
            showLabel={false}
            gradientClassName="bg-gradient-to-br from-[#7a6f5e] via-[#5a544a] to-[#3d3a35]"
            className="h-full w-full"
          />
        )}
      </ScaleIn>
      {/* Single bottom-up scrim — per founder feedback the render should breathe: the top ~30%
          of the image stays completely clear (and the shading is barely-there until the text
          zone), the gradient only darkens where the compact block sits. Fades out at 70% (not
          lower) so the eyebrow — the block's top line, which reaches higher on desktop where
          the serif title is two 80px lines — always sits on scrim, even on the brightest slide. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.36)_32%,rgba(0,0,0,0)_70%)]" />

      <StoryHeader />

      {/* Compact overlay — essentials only, anchored bottom-left. Everything else (residences,
          location, completion, availability) moved to the KeyFacts bar below the hero. */}
      <div className={`${CONTAINER} relative flex min-h-[92vh] flex-col justify-end pb-14 pt-28 lg:pb-20`}>
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/80">{story.statusLine}</p>
          <h1 className="mt-3 text-[42px] font-light leading-[1.02] tracking-tight text-white sm:text-[62px] lg:text-[80px]" style={SERIF}>
            <MaskReveal delay={0.15} trigger="mount">{project.name}</MaskReveal>
          </h1>

          {stars >= 1 && (
            <div className="mt-4 flex items-center gap-3">
              <InvediStars stars={stars} size="lg" />
              <span className="text-sm font-medium text-white/85">
                Assessed by Invedi{project.review.preliminary ? " · Preliminary" : ""}
              </span>
            </div>
          )}

          {/* From price — one line, small label + full amount (global €715.000 format).
              Price-on-request projects show the label line without an amount. */}
          {project.priceOnRequest ? (
            <p className="mt-4 text-[24px] font-light leading-none text-white sm:text-[27px]" style={SERIF}>
              Price on request
            </p>
          ) : (
            <p className="mt-4 flex items-baseline gap-2.5 text-white">
              <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/70">From</span>
              <span className="text-[26px] font-light leading-none sm:text-[30px]" style={SERIF}>
                {formatPriceFull(project.priceMin)}
              </span>
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <UnitsCtaButton label={ctaLabel} size="lg" />
            {/* Scarcity line — real data, no urgency theatrics. */}
            <p className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden />
              {scarcity}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Key facts bar */

/** Slim key-facts bar directly below the hero — carries the fields that used to crowd the
 *  overlay. 4-in-a-row on desktop, 2×2 on mobile. Same label/value treatment as the rest of
 *  the template's small-caps facts. */
function KeyFacts({ project }: { project: Project }) {
  // Scarcity, computed from availability — neutral phrasing only (no countdown, no urgency).
  const remaining = project.units.filter((u) => u.status === "available").length;
  const facts = [
    { label: "Residences", value: `${project.totalUnits}` },
    { label: "Location", value: `${project.city}, ${project.countryLabel}` },
    { label: "Completion", value: project.completion },
    {
      label: "Availability",
      value: remaining > 0 ? `${remaining} of ${project.totalUnits} residences remaining` : "Sold out",
    },
  ];
  return (
    <section className="border-b bg-white" style={{ borderColor: HAIRLINE }}>
      <div className={`${CONTAINER} grid grid-cols-2 gap-x-8 gap-y-6 py-8 md:grid-cols-4 lg:py-10`}>
        {facts.map((f) => (
          <div key={f.label}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">{f.label}</p>
            <p className="mt-1 text-[15px] font-medium leading-snug text-text sm:text-base">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------- Editorial intro + Why */

function StarTeaser({ project }: { project: Project }) {
  const stars = scoreToStars(project.review.score);
  return (
    <div className="rounded-2xl border p-7" style={{ borderColor: HAIRLINE, backgroundColor: "#ffffff" }}>
      {stars >= 1 && <InvediStars stars={stars} size="lg" />}
      <p className="mt-4 text-xl font-light leading-snug text-text" style={SERIF}>
        {project.review.preliminary ? "Preliminary assessment by Invedi." : "Assessed by Invedi."}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        The full analysis — scores, strengths and points of attention — is available after sign-up.
      </p>
      <div className="mt-5">
        <SignupButton label="Unlock the full analysis" size="md" />
      </div>
    </div>
  );
}

function IntroWhy({ project, story }: { project: Project; story: ProjectStory }) {
  return (
    <section style={{ backgroundColor: CREAM }}>
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="max-w-2xl text-[22px] font-light leading-[1.5] text-text sm:text-[27px] sm:leading-[1.45]">
                {story.intro}
              </p>
            </Reveal>

            <div className="mt-16">
              <Overline>Why Invedi</Overline>
              <h2 className="mt-3 max-w-2xl text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[40px]" style={SERIF}>
                {story.whyInvedi.heading}
              </h2>
              <div className="mt-7 max-w-2xl space-y-5">
                {story.whyInvedi.body.map((para, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <p className="text-[17px] font-light leading-[1.75] text-text/90">{para}</p>
                  </Reveal>
                ))}
              </div>
              <p className="mt-8 text-sm font-medium tracking-wide text-text-muted">— {story.whyInvedi.curator}</p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <StarTeaser project={project} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Statement line */

function StatementLine({ story }: { story: ProjectStory }) {
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} py-24 text-center lg:py-36`}>
        <h2 className="text-[38px] font-light leading-[1.04] tracking-tight text-text sm:text-[60px] lg:text-[80px]" style={SERIF}>
          <MaskReveal>{story.tagline}</MaskReveal>
        </h2>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Collage */

// Cinematic asymmetric editorial grid over a 12-col track: a tall feature pair, a triptych, then a
// full-width wide plate. Generous heights; images slow-zoom on hover.
// TODO(photo): at least half of these should become lifestyle-with-people shots (see shopping list).
const COLLAGE_SPANS = [
  "md:col-span-7 h-[360px] sm:h-[440px] md:h-[600px]",
  "md:col-span-5 h-[300px] sm:h-[360px] md:h-[600px]",
  "md:col-span-4 h-[280px] md:h-[400px]",
  "md:col-span-4 h-[280px] md:h-[400px]",
  "md:col-span-4 h-[280px] md:h-[400px]",
  "md:col-span-12 h-[340px] sm:h-[420px] md:h-[540px]",
];

function Collage({ project, story }: { project: Project; story: ProjectStory }) {
  const images = story.collage.slice(0, COLLAGE_SPANS.length);
  // null = closed; otherwise the index of the open image within `images`.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxImages = images.map((src, i) => ({
    src,
    alt: `${project.name} — photo ${i + 1}`,
  }));

  return (
    <section style={{ backgroundColor: CREAM }}>
      <div className={`${CONTAINER} py-20 lg:py-28`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {images.map((src, i) => (
            <Reveal
              key={`${src}-${i}`}
              delay={(i % 3) * 0.05}
              className={`group overflow-hidden rounded-xl md:rounded-2xl ${COLLAGE_SPANS[i]}`}
            >
              {/* Every collage image opens the lightbox at its index. */}
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`View photo ${i + 1} of ${images.length}`}
                className="block h-full w-full cursor-zoom-in"
              >
                <RegionImage
                  src={src}
                  label={project.name}
                  showLabel={false}
                  gradientClassName={WARM_IMG_FALLBACK}
                  className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </section>
  );
}

/* ------------------------------------------------- Mid-page CTA */

/** Quiet secondary route to the units, roughly halfway down the page (after the editorial
 *  sections + collage). Outline treatment on the cream ground so it doesn't compete with the
 *  hero CTA; same scroll-then-gate behaviour. */
function MidUnitsCta() {
  return (
    <section style={{ backgroundColor: CREAM }}>
      <div className={`${CONTAINER} flex justify-center pb-20 lg:pb-28`}>
        <UnitsCtaButton label="View all units" size="md" variant="outline" />
      </div>
    </section>
  );
}

/* ----------------------------------------------- Full-bleed moment */

function FullBleed({ project, story }: { project: Project; story: ProjectStory }) {
  if (!story.fullBleed) return null;
  const { image, caption } = story.fullBleed;
  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-[#2b2a26]">
      <Parallax className="absolute inset-0" amount={12}>
        <RegionImage
          src={image}
          label={project.name}
          showLabel={false}
          gradientClassName={WARM_IMG_FALLBACK}
          className="h-full w-full"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/15" />
      {caption && (
        <div className={`${CONTAINER} pointer-events-none absolute inset-x-0 bottom-0`}>
          <p className="max-w-2xl pb-10 text-[26px] font-light leading-[1.1] tracking-tight text-white drop-shadow sm:pb-14 sm:text-[36px] lg:text-[46px]" style={SERIF}>
            {caption}
          </p>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------- Lifestyle */

function Lifestyle({ story }: { story: ProjectStory }) {
  const { lifestyle } = story;
  // Paired image: a project lifestyle shot when available, else a collage frame.
  const image = story.lifestyleImage ?? story.collage[2] ?? story.collage[0];
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <Overline>Lifestyle</Overline>
            <h2 className="mt-3 text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[40px]" style={SERIF}>
              {lifestyle.heading}
            </h2>
            <p className="mt-6 max-w-xl text-[17px] font-light leading-[1.75] text-text/90">{lifestyle.body}</p>
            <ul className="mt-8 space-y-3">
              {lifestyle.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[15px] leading-snug text-text">
                  <Check />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="group relative h-[420px] overflow-hidden rounded-2xl lg:h-[560px]">
            <RegionImage
              src={image}
              label={lifestyle.heading}
              showLabel={false}
              gradientClassName={WARM_IMG_FALLBACK}
              className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- Sample units */

function SampleUnits({ project, story }: { project: Project; story: ProjectStory }) {
  return (
    // Scroll target for the units CTAs; scroll-mt keeps the heading clear of the viewport edge.
    <section id={RESIDENCES_ID} className="scroll-mt-6" style={{ backgroundColor: CREAM }}>
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <Reveal>
          <Overline>The residences</Overline>
          <h2 className="mt-3 max-w-2xl text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[40px]" style={SERIF}>
            A first look at the homes
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {story.sampleUnits.map((u, i) => (
            <Reveal
              key={u.name}
              delay={(i % 3) * 0.07}
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <div className="h-56 overflow-hidden" style={{ borderColor: HAIRLINE }}>
                <RegionImage src={u.image} label={u.name} showLabel={false} gradientClassName={WARM_IMG_FALLBACK} className="h-full w-full" />
              </div>
              <div className="border-t p-6" style={{ borderColor: HAIRLINE }}>
                <h3 className="text-xl font-light text-text" style={SERIF}>{u.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{u.sizeRange}</p>
                <p className="mt-3 text-lg font-medium text-primary-dark">
                  {u.priceFrom ? `From ${formatPriceFull(u.priceFrom)}` : "Price on request"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-col items-start gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: HAIRLINE }}>
            <p className="text-[15px] text-text-muted">
              <span className="font-semibold text-text">{project.totalUnits} units in total.</span> Sign up to see all units, prices and availability.
            </p>
            <SignupButton label="See all units" size="md" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Location */

function Location({ project, story }: { project: Project; story: ProjectStory }) {
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Overline>Location</Overline>
            <h2 className="mt-3 text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[40px]" style={SERIF}>
              {project.city}, {project.countryLabel}
            </h2>
            <p className="mt-6 max-w-xl text-[17px] font-light leading-[1.75] text-text/90">{story.location.body}</p>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Mont-Reve pattern: bold distance + label. Two columns desktop, one column mobile. */}
            <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
              {story.location.distances.map((d) => (
                <div key={d.label} className="border-b py-4" style={{ borderColor: HAIRLINE }}>
                  <p className="text-xl font-light text-text" style={SERIF}>{d.distance}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{d.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- Region trajectory */

function Trajectory({ project, story }: { project: Project; story: ProjectStory }) {
  const t = story.trajectory;
  if (!t) return null;
  return (
    <section style={{ backgroundColor: CREAM }}>
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <Reveal>
          <Overline>Region trajectory</Overline>
          <h2 className="mt-3 max-w-3xl text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[40px]" style={SERIF}>
            Where {project.region} is heading
          </h2>
          {t.intro && <p className="mt-5 max-w-2xl text-[17px] font-light leading-[1.7] text-text/90">{t.intro}</p>}
        </Reveal>

        {/* Timeline — thin rule with a dot per milestone; small-caps period + line. */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {t.milestones.map((m, i) => (
            <Reveal key={m.period} delay={i * 0.06} className="relative border-t pt-7" >
              <span className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">{m.period}</p>
              <p className="mt-3 text-[17px] font-light leading-snug text-text">{m.label}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 max-w-3xl text-[19px] font-light leading-[1.55] text-text" style={SERIF}>
            {t.takeaway}
          </p>
        </Reveal>

        {/* Stats strip — three quantified proof points, data-clean. */}
        <Reveal delay={0.12}>
          <div
            className="mt-14 grid grid-cols-1 divide-y border-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            style={{ borderColor: HAIRLINE }}
          >
            {t.stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center" style={{ borderColor: HAIRLINE }}>
                <p className="text-[30px] font-light leading-none text-text sm:text-[36px]" style={SERIF}>{s.value}</p>
                <p className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------- Developer & Operator */

function TrustColumn({
  heading,
  name,
  body,
  highlights,
}: {
  heading: string;
  name: string;
  body: string;
  highlights: string[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-8 lg:p-9" style={{ borderColor: HAIRLINE }}>
      <Overline>{heading}</Overline>
      <h3 className="mt-3 text-[24px] font-light leading-tight text-text sm:text-[28px]" style={SERIF}>{name}</h3>
      <p className="mt-4 text-[16px] font-light leading-[1.7] text-text/90">{body}</p>
      <ul className="mt-6 space-y-2.5">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-[14px] text-text">
            <Check />
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeveloperOperator({ project, story }: { project: Project; story: ProjectStory }) {
  const hasOperator = !!story.operator;
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <Reveal>
          <Overline>Behind the project</Overline>
          <h2 className="mt-3 text-[30px] font-light leading-[1.12] tracking-tight text-text sm:text-[40px]" style={SERIF}>
            The developer{hasOperator ? " and operator" : ""}
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={`mt-12 grid grid-cols-1 gap-6 ${hasOperator ? "lg:grid-cols-2" : "lg:max-w-3xl"}`}>
            <TrustColumn
              heading="About the developer"
              name={project.developer}
              body={story.developer.body}
              highlights={story.developer.highlights}
            />
            {story.operator && (
              <TrustColumn
                heading="About the operator"
                name={story.operator.name}
                body={story.operator.body}
                highlights={story.operator.highlights}
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------- Guide teaser */

function GuideCover({ country }: { country: string }) {
  // Mock document cover thumbnail (no real PDF). // TODO(asset): guide PDF later.
  return (
    <div className="w-36 flex-none sm:w-40">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-lg border shadow-xl"
        style={{ borderColor: HAIRLINE, backgroundColor: "#efe9dc" }}
      >
        <div className="flex h-full flex-col p-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-primary-dark">Invedi Guide</p>
          <p className="mt-auto text-[17px] font-light leading-[1.1] text-text" style={SERIF}>
            Buying in {country}
          </p>
          <div className="mt-3 h-px w-8 bg-primary/60" />
          <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-text-muted">10-page PDF</p>
        </div>
      </div>
    </div>
  );
}

function GuideTeaser({ project }: { project: Project }) {
  const country = project.countryLabel;
  return (
    <section style={{ backgroundColor: CREAM }}>
      <div className={`${CONTAINER} py-16 lg:py-20`}>
        <Reveal>
          <div
            className="flex flex-col items-center gap-8 rounded-2xl border bg-white p-8 text-center shadow-sm sm:flex-row sm:p-10 sm:text-left"
            style={{ borderColor: HAIRLINE }}
          >
            <GuideCover country={country} />
            <div className="flex-1">
              <Overline>Free guide</Overline>
              <h3 className="mt-2 text-[24px] font-light leading-[1.12] text-text sm:text-[30px]" style={SERIF}>
                Buying in {country}: the complete guide
              </h3>
              <p className="mt-3 max-w-xl text-[16px] font-light leading-relaxed text-text-muted">
                Legal, tax and costs explained in one 10-page PDF. Free after sign-up.
              </p>
              <div className="mt-6 flex justify-center sm:justify-start">
                <SignupButton label="Get the guide" size="md" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Final CTA */

function FinalCta({ project }: { project: Project }) {
  return (
    <section style={{ backgroundColor: "#3D4852" }} className="text-white">
      <div className={`${CONTAINER} py-24 text-center lg:py-32`}>
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[32px] font-light leading-[1.1] tracking-tight sm:text-[46px]" style={SERIF}>
            Want full access to all the information?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-light text-white/80">
            Answer four quick questions and unlock every unit, price and the full Invedi analysis.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <SignupButton label="Complete and unlock" size="lg" variant="white" />
            <Link
              href={`/projects/${project.slug}`}
              className="text-sm font-medium text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              See full project details
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StoryFooter({ project }: { project: Project }) {
  return (
    <footer className="border-t bg-white" style={{ borderColor: HAIRLINE }}>
      <div className={`${CONTAINER} flex flex-col items-center justify-between gap-4 py-10 sm:flex-row`}>
        <Link href="/" aria-label="Invedi — home" className="inline-flex items-center">
          <LogoImage
            src="/images/logo-dark.png"
            className="h-7 w-auto"
            fallbackColorClass="text-primary-dark"
          />
        </Link>
        <p className="text-xs text-text-muted">© 2026 Invedi · Prototype — placeholder editorial, not for distribution.</p>
        <Link href={`/projects/${project.slug}`} className="text-xs font-medium text-text-muted transition hover:text-text">
          See full project details →
        </Link>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------ Template */

export function StoryTemplate({ project }: { project: Project }) {
  const story = project.story;
  if (!story) return null; // route guards this; defensive.

  return (
    <div className="bg-white">
      <Hero project={project} story={story} />
      <KeyFacts project={project} />
      <IntroWhy project={project} story={story} />
      <StatementLine story={story} />
      <Collage project={project} story={story} />
      <MidUnitsCta />
      <FullBleed project={project} story={story} />
      <Lifestyle story={story} />
      <SampleUnits project={project} story={story} />
      <Location project={project} story={story} />
      <Trajectory project={project} story={story} />
      <DeveloperOperator project={project} story={story} />
      <GuideTeaser project={project} />
      <FinalCta project={project} />
      <StoryFooter project={project} />
    </div>
  );
}
