// Fractional landing — built in part 4.
//
// Shell only at this stage: a labelled placeholder so the toggle has something to render
// against. Real content (hero / how fractional works / share split UI / sample fractionalised
// projects) lands in a follow-up build. No props yet so the part-4 author can shape the API
// without needing to break anything here first.

export function FractionalSection() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center sm:py-24">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
        Placeholder
      </p>
      <h2 className="mt-3 text-xl font-semibold text-text sm:text-2xl">
        Fractional ownership content
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-muted">
        Share-split explainer, fractionalised inventory, and group-onboarding flows land here
        in a follow-up build.
      </p>
    </section>
  );
}
