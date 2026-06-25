"use client";

/**
 * FractionalSection — Fractional landing composition + selection-state owner.
 *
 * Mirrors BulkSection's shape (intro banner → content blocks) so the two sub-sections
 * read as siblings. Selection state for both grids lives here so part 5 can lift it into
 * a real filter-params type and hand it to a deal-list component.
 *
 * NOTE: the deliberate Bulk/Fractional mismatch — Bulk roster is CITIES, Fractional roster
 * is COUNTRIES — is flagged in fractionalMockData.ts and on the founder backlog as an
 * open question.
 *
 * // TODO: wire category + country selection to fractional params in part 5.
 */

import { useState } from "react";
import { FractionalIntroBanner } from "./FractionalIntroBanner";
import { FractionalCategoryGrid } from "./FractionalCategoryGrid";
import { FractionalCountryGrid } from "./FractionalCountryGrid";

function useMultiToggle() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return [selected, toggle] as const;
}

export function FractionalSection() {
  const [categories, toggleCategory] = useMultiToggle();
  const [countries, toggleCountry] = useMultiToggle();

  return (
    <div className="space-y-10 lg:space-y-14">
      <FractionalIntroBanner />
      <FractionalCategoryGrid selected={categories} onToggle={toggleCategory} />
      <FractionalCountryGrid selected={countries} onToggle={toggleCountry} />
    </div>
  );
}
