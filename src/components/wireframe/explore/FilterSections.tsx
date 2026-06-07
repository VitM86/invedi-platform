"use client";

/**
 * FilterSections — filter controls bound to the Filters object. Each section is a labelled
 * block (FieldLabel + control) so the desktop FilterBar popovers and the mobile FilterSheet
 * render identical wiring, just arranged differently.
 */

import {
  AMENITIES,
  countryOptions,
  regionsForCountries,
  type CountryCode,
} from "@/lib/mock-data";
import {
  AREA_THRESHOLDS,
  BED_MAX,
  COMPLETION_OPTIONS,
  areaLabel,
  bedLabel,
  type Filters,
} from "./types";
import {
  AmenityPills,
  FieldLabel,
  MultiSelectDropdown,
  PriceHistogramSlider,
  SegmentedGroup,
  ShortTermToggle,
  Stepper,
} from "./filterControls";

type SectionProps = { filters: Filters; set: (patch: Partial<Filters>) => void };

export function PriceSection({ filters, set }: SectionProps) {
  return (
    <div>
      <FieldLabel>Price range</FieldLabel>
      <PriceHistogramSlider
        valueMin={filters.priceMin}
        valueMax={filters.priceMax}
        onChange={(priceMin, priceMax) => set({ priceMin, priceMax })}
      />
    </div>
  );
}

export function BedsSection({ filters, set }: SectionProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <FieldLabel>Bedrooms</FieldLabel>
      <Stepper value={filters.bedrooms} max={BED_MAX} format={bedLabel} onChange={(bedrooms) => set({ bedrooms })} />
    </div>
  );
}

export function AreaSection({ filters, set }: SectionProps) {
  const idx = Math.max(0, AREA_THRESHOLDS.indexOf(filters.areaMin));
  return (
    <div className="flex items-center justify-between gap-4">
      <FieldLabel>Living area</FieldLabel>
      <Stepper
        value={idx}
        max={AREA_THRESHOLDS.length - 1}
        format={(i) => areaLabel(AREA_THRESHOLDS[i])}
        onChange={(i) => set({ areaMin: AREA_THRESHOLDS[i] })}
      />
    </div>
  );
}

export function CompletionSection({ filters, set }: SectionProps) {
  return (
    <div>
      <FieldLabel>Completion</FieldLabel>
      <SegmentedGroup
        options={COMPLETION_OPTIONS}
        value={filters.completion}
        onChange={(completion) => set({ completion })}
      />
    </div>
  );
}

export function AmenitiesSection({ filters, set }: SectionProps) {
  return (
    <div>
      <FieldLabel>Amenities</FieldLabel>
      <AmenityPills
        all={AMENITIES}
        selected={filters.amenities}
        onToggle={(a) =>
          set({
            amenities: filters.amenities.includes(a)
              ? filters.amenities.filter((x) => x !== a)
              : [...filters.amenities, a],
          })
        }
      />
    </div>
  );
}

export function ShortTermSection({ filters, set }: SectionProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <FieldLabel>Short-term letting</FieldLabel>
        <p className="-mt-1 text-xs text-text-muted">Only projects where short-term letting is allowed.</p>
      </div>
      <ShortTermToggle on={filters.shortTermOnly} onChange={(shortTermOnly) => set({ shortTermOnly })} />
    </div>
  );
}

/** Country + Region multi-selects. `inline` lays them in a row (desktop bar) vs stacked (sheet). */
export function CountryRegionSection({ filters, set, inline }: SectionProps & { inline?: boolean }) {
  const regionOptions = regionsForCountries(filters.countries).map((r) => ({ value: r, label: r }));

  const toggleCountry = (code: CountryCode) => {
    const countries = filters.countries.includes(code)
      ? filters.countries.filter((c) => c !== code)
      : [...filters.countries, code];
    // Drop any selected regions no longer offered by the new country set.
    const valid = new Set(regionsForCountries(countries));
    set({ countries, regions: filters.regions.filter((r) => valid.has(r)) });
  };
  const toggleRegion = (r: string) =>
    set({ regions: filters.regions.includes(r) ? filters.regions.filter((x) => x !== r) : [...filters.regions, r] });

  return (
    <div className={inline ? "flex gap-2" : "space-y-3"}>
      {!inline && <FieldLabel>Where</FieldLabel>}
      <MultiSelectDropdown
        label="Countries"
        emptyLabel="Any country"
        options={countryOptions.map((c) => ({ value: c.code, label: c.label }))}
        selected={filters.countries}
        onToggle={toggleCountry}
      />
      <MultiSelectDropdown
        label="Regions"
        emptyLabel="Any region"
        options={regionOptions}
        selected={filters.regions}
        onToggle={toggleRegion}
      />
    </div>
  );
}
