// Bulk landing — built in part 2.
//
// Shell only at this stage: a labelled placeholder so the toggle has something to render
// against. Real content (hero / discount tiers / multi-unit cart logic / sample developer
// projects with bulk pricing) lands in a follow-up build. The component intentionally has
// no props yet so part 2 can shape its own API freely without a migration step.

export function BulkSection() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center sm:py-24">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
        Placeholder
      </p>
      <h2 className="mt-3 text-xl font-semibold text-text sm:text-2xl">
        Bulk discounts content
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-muted">
        Multi-unit reservation flows, discount tiers, and bulk-qualifying inventory land here
        in a follow-up build.
      </p>
    </section>
  );
}
