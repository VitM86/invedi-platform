"use client";

import { useEffect } from "react";
import {
  type CountryCode,
  type ResidencyStatus,
  type RateType,
  type CountryMortgageDefaults,
  formatEuro,
} from "@/data/mortgage";

interface Props {
  propertyPrice: number;
  country: CountryCode;
  energyLabel?: string;
  residency: ResidencyStatus;
  downPaymentPct: number;
  termYears: number;
  interestRate: number;
  rateType: RateType;
  effectiveRate: number;
  monthlyPayment: number;
  totalInterest: number;
  loanAmount: number;
  downPaymentEur: number;
  additionalCosts: {
    items: { label: string; amount: number; note?: string }[];
    total: number;
  };
  nlTaxBenefit: number;
  nhgEligible: boolean;
  minDownPct: number;
  defaults: CountryMortgageDefaults;
  onResidencyChange: (v: ResidencyStatus) => void;
  onDownPaymentChange: (v: number) => void;
  onTermChange: (v: number) => void;
  onRateChange: (v: number) => void;
  onRateTypeChange: (v: RateType) => void;
  onClose: () => void;
}

export function MortgagePanel({
  propertyPrice,
  country,
  energyLabel,
  residency,
  downPaymentPct,
  termYears,
  interestRate,
  rateType,
  effectiveRate,
  monthlyPayment,
  totalInterest,
  loanAmount,
  downPaymentEur,
  additionalCosts,
  nlTaxBenefit,
  nhgEligible,
  minDownPct,
  defaults,
  onResidencyChange,
  onDownPaymentChange,
  onTermChange,
  onRateChange,
  onRateTypeChange,
  onClose,
}: Props) {
  const totalUpfront = downPaymentEur + additionalCosts.total;

  function rangeProgress(value: number, min: number, max: number): React.CSSProperties {
    return { "--range-progress": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties;
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Mortgage Calculator
            </h2>
            <p className="text-sm text-text-muted">{defaults.label} · New-build</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 hover:bg-surface transition-colors"
          >
            <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Property section */}
          <div>
            <SectionLabel>Property</SectionLabel>
            <div className="space-y-2 mt-3">
              <Row label="Property price" value={formatEuro(propertyPrice)} />
              <Row label="Country" value={defaults.label} />
              <Row label="Type" value="New-build" />
              {energyLabel && <Row label="Energy label" value={energyLabel} />}
            </div>
          </div>

          {/* Your Situation */}
          <div>
            <SectionLabel>Your situation</SectionLabel>
            <div className="space-y-4 mt-3">
              {/* Residency */}
              <div>
                <label className="block text-sm text-text-muted mb-1.5">
                  I am a:
                </label>
                <select
                  value={residency}
                  onChange={(e) =>
                    onResidencyChange(e.target.value as ResidencyStatus)
                  }
                  className="w-full rounded border border-border bg-white px-3 py-2 text-xs text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                  <option value="resident">Resident</option>
                  <option value="eu-non-resident">EU Non-Resident</option>
                  <option value="non-eu-non-resident">Non-EU Non-Resident</option>
                </select>
              </div>

              {/* Down payment */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-text-muted">Down payment</label>
                  <span className="text-sm font-semibold text-text">
                    {formatEuro(downPaymentEur)}{" "}
                    <span className="text-text-muted font-normal">
                      ({downPaymentPct}%)
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min={minDownPct}
                  max={80}
                  step={1}
                  value={downPaymentPct}
                  onChange={(e) => onDownPaymentChange(Number(e.target.value))}
                  className="w-full"
                  style={rangeProgress(downPaymentPct, minDownPct, 80)}
                />
                <div className="flex justify-between text-xs text-text-muted mt-0.5">
                  <span>Min {minDownPct}%</span>
                  <span>80%</span>
                </div>
                {residency !== "resident" && (
                  <p className="text-xs text-amber-600 mt-1">
                    Non-residents in {defaults.label} typically need at least{" "}
                    {minDownPct}% down payment.
                  </p>
                )}
              </div>

              <Row label="Loan amount" value={formatEuro(loanAmount)} bold />

              {/* Term */}
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Mortgage term
                </label>
                <select
                  value={termYears}
                  onChange={(e) => onTermChange(Number(e.target.value))}
                  className="w-full rounded border border-border bg-white px-3 py-2 text-xs text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                  {defaults.termOptions.map((y) => (
                    <option key={y} value={y}>
                      {y} years
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate type */}
              {defaults.hasVariableRate && (
                <div>
                  <label className="block text-sm text-text-muted mb-1.5">
                    Rate type
                  </label>
                  <div className="flex gap-1 rounded bg-surface p-0.5">
                    {(["fixed", "variable"] as RateType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => onRateTypeChange(type)}
                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                          rateType === type
                            ? "bg-white text-text shadow-sm"
                            : "text-text-muted hover:text-text"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interest rate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-text-muted">Interest rate</label>
                  {residency !== "resident" && (
                    <span className="text-xs text-text-muted">
                      incl. +{defaults.nonResidentRateSurcharge}% non-res.
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step={0.1}
                    min={0.1}
                    max={15}
                    value={interestRate}
                    onChange={(e) =>
                      onRateChange(
                        Math.max(0.1, Math.min(15, Number(e.target.value)))
                      )
                    }
                    className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-text pr-8 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                    %
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Avg. {rateType} rate in {defaults.label}
                  {residency !== "resident" ? " for non-residents" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Payment */}
          <div>
            <SectionLabel>Monthly payment</SectionLabel>
            <div className="mt-3 rounded bg-primary/10 border border-primary/30 p-4">
              <p className="text-3xl font-bold text-text">
                {formatEuro(Math.round(monthlyPayment))}
                <span className="text-base font-normal text-text-muted">
                  {" "}
                  /month
                </span>
              </p>
              {nlTaxBenefit > 0 && (
                <div className="mt-2 pt-2 border-t border-primary/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Monthly tax benefit (est.)</span>
                    <span className="text-primary-dark font-medium">
                      −{formatEuro(Math.round(nlTaxBenefit))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium text-text">
                      Net monthly payment
                    </span>
                    <span className="font-bold text-primary-dark">
                      {formatEuro(Math.round(monthlyPayment - nlTaxBenefit))}/mo
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Based on {defaults.taxDeductionRate}% deduction rate. Benefit
                    decreases over the loan term.
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2 mt-3">
              <Row
                label={`Total interest over ${termYears} years`}
                value={formatEuro(Math.round(totalInterest))}
              />
              <Row
                label="Total amount repaid"
                value={formatEuro(Math.round(loanAmount + totalInterest))}
              />
            </div>
          </div>

          {/* NL specifics */}
          {country === "NL" && (
            <div>
              <SectionLabel>Netherlands specifics</SectionLabel>
              <div className="space-y-2 mt-3">
                <div
                  className={`rounded p-3 text-sm ${
                    nhgEligible
                      ? "bg-primary/10 text-primary-dark border border-primary/20"
                      : "bg-surface text-text-muted border border-border"
                  }`}
                >
                  {nhgEligible ? (
                    <div>
                      <p className="font-medium">✓ NHG eligible</p>
                      <p className="text-xs mt-1">
                        Premium: {formatEuro(Math.round(loanAmount * (defaults.nhgPremiumPct! / 100)))} (one-time) · Rate discount: −{defaults.nhgRateDiscount}%
                      </p>
                    </div>
                  ) : (
                    <p>NHG not available — price exceeds €435,000 limit</p>
                  )}
                </div>
                <Row
                  label="Tax deduction rate"
                  value={`${defaults.taxDeductionRate}%`}
                />
                {energyLabel && (
                  <Row label="Energy label" value={energyLabel} />
                )}
              </div>
            </div>
          )}

          {/* Acquisition Costs */}
          <div>
            <SectionLabel>
              Acquisition costs ({defaults.label}, new-build)
            </SectionLabel>
            <div className="space-y-2 mt-3">
              {additionalCosts.items.map((item) => (
                <div key={item.label}>
                  <Row label={item.label} value={formatEuro(item.amount)} />
                  {item.note && (
                    <p className="text-xs text-text-muted ml-0 mt-0.5">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <Row
                  label="Total additional costs"
                  value={formatEuro(additionalCosts.total)}
                  bold
                />
              </div>
            </div>
          </div>

          {/* Total upfront */}
          <div className="rounded bg-gray-900 text-white p-4">
            <p className="text-sm text-gray-400 mb-2">Total upfront required</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Down payment</span>
                <span>{formatEuro(downPaymentEur)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Additional costs</span>
                <span>{formatEuro(additionalCosts.total)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700 mt-2">
                <span>You need</span>
                <span>{formatEuro(totalUpfront)}</span>
              </div>
            </div>
          </div>

          {/* Lead gen CTA */}
          <div className="rounded border border-primary/30 bg-primary/10 p-4">
            <p className="font-medium text-text mb-1">
              Want a personalized mortgage offer?
            </p>
            <p className="text-sm text-text-muted mb-3">
              Our partner brokers can help you find the best rate for your
              situation in {defaults.label}.
            </p>
            <button className="w-full rounded bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
              Get a personalized offer →
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-text-muted leading-relaxed pb-6">
            This is an indicative estimate based on average market rates and
            standard terms. Actual mortgage terms depend on your personal
            financial situation, credit history, and the lender&apos;s assessment.
            Rates shown as of April 2026. Interest rates and regulations change
            frequently. Consult a qualified mortgage advisor before making any
            financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
      {children}
    </p>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? "font-medium text-text" : "text-text-muted"}`}>
        {label}
      </span>
      <span className={`text-sm ${bold ? "font-bold text-text" : "font-medium text-text"}`}>
        {value}
      </span>
    </div>
  );
}
