"use client";

import { useState, useMemo, useCallback } from "react";
import {
  type CountryCode,
  type ResidencyStatus,
  type RateType,
  mortgageDefaults,
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateAdditionalCosts,
  calculateNLTaxBenefit,
  formatEuro,
} from "@/data/mortgage";
import { MortgagePanel } from "./MortgagePanel";

interface Props {
  propertyPrice: number;
  country: CountryCode;
  energyLabel?: string;
}

export function MortgageWidget({ propertyPrice, country, energyLabel }: Props) {
  const defaults = mortgageDefaults[country];

  const [residency, setResidency] = useState<ResidencyStatus>("resident");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const isNonResident = residency !== "resident";
  const minDownPct = isNonResident
    ? defaults.minDownPctNonResident
    : defaults.minDownPctResident;
  const defaultDownPct = Math.max(
    minDownPct,
    100 - (isNonResident ? defaults.ltvNonResident : defaults.ltvResident)
  );

  const [downPaymentPct, setDownPaymentPct] = useState(defaultDownPct);
  const [termYears, setTermYears] = useState(defaults.defaultTermYears);
  const [interestRate, setInterestRate] = useState(defaults.defaultRateFixed);
  const [rateType, setRateType] = useState<RateType>("fixed");

  const effectiveDownPct = Math.max(downPaymentPct, minDownPct);
  const downPaymentEur = Math.round(propertyPrice * (effectiveDownPct / 100));
  const loanAmount = propertyPrice - downPaymentEur;

  const rangeProgress = useCallback(
    (value: number, min: number, max: number) => ({
      "--range-progress": `${((value - min) / (max - min)) * 100}%`,
    } as React.CSSProperties),
    []
  );

  const effectiveRate = useMemo(() => {
    let rate =
      rateType === "variable" && defaults.defaultRateVariable
        ? defaults.defaultRateVariable
        : interestRate;
    if (isNonResident) rate += defaults.nonResidentRateSurcharge;
    return rate;
  }, [interestRate, rateType, isNonResident, defaults]);

  const monthlyPayment = useMemo(
    () => calculateMonthlyPayment(loanAmount, effectiveRate, termYears),
    [loanAmount, effectiveRate, termYears]
  );

  const totalInterest = useMemo(
    () => calculateTotalInterest(monthlyPayment, loanAmount, termYears),
    [monthlyPayment, loanAmount, termYears]
  );

  const additionalCosts = useMemo(
    () =>
      calculateAdditionalCosts(
        propertyPrice,
        loanAmount,
        defaults.additionalCosts
      ),
    [propertyPrice, loanAmount, defaults.additionalCosts]
  );

  const nlTaxBenefit =
    country === "NL" && defaults.taxDeductionRate
      ? calculateNLTaxBenefit(loanAmount, effectiveRate, defaults.taxDeductionRate)
      : 0;

  const nhgEligible =
    country === "NL" &&
    defaults.nhgLimit !== undefined &&
    propertyPrice <= defaults.nhgLimit;

  function handleResidencyChange(value: ResidencyStatus) {
    setResidency(value);
    const newMinDown =
      value !== "resident"
        ? defaults.minDownPctNonResident
        : defaults.minDownPctResident;
    const newDefault = Math.max(
      newMinDown,
      100 -
        (value !== "resident"
          ? defaults.ltvNonResident
          : defaults.ltvResident)
    );
    setDownPaymentPct(newDefault);

    const baseRate =
      rateType === "variable" && defaults.defaultRateVariable
        ? defaults.defaultRateVariable
        : defaults.defaultRateFixed;
    setInterestRate(baseRate);
  }

  function handleRateTypeChange(type: RateType) {
    setRateType(type);
    if (type === "variable" && defaults.defaultRateVariable) {
      setInterestRate(defaults.defaultRateVariable);
    } else {
      setInterestRate(defaults.defaultRateFixed);
    }
  }

  return (
    <>
      <section className="rounded border border-border bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          <h3 className="text-base font-semibold text-text">
            Mortgage Estimate
          </h3>
        </div>

        {/* Monthly payment hero */}
        <div className="mb-5 rounded bg-white p-4 border border-border">
          <p className="text-sm font-medium text-text-muted mb-1">Est. monthly payment</p>
          <p className="text-3xl font-bold text-text">
            {formatEuro(Math.round(monthlyPayment))}
            <span className="text-lg font-normal text-text-muted"> /mo</span>
          </p>
          {nlTaxBenefit > 0 && (
            <p className="text-sm text-primary-dark mt-1">
              Net after tax deduction: {formatEuro(Math.round(monthlyPayment - nlTaxBenefit))}/mo
            </p>
          )}
          <p className="text-sm text-text-muted mt-1">
            Based on {effectiveDownPct}% down · {termYears} years ·{" "}
            {effectiveRate.toFixed(2)}% {rateType}
          </p>
        </div>

        {/* Down payment slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-text">
              Down payment
            </label>
            <span className="text-sm font-semibold text-text">
              {formatEuro(downPaymentEur)}{" "}
              <span className="text-text-muted font-normal">
                ({effectiveDownPct}%)
              </span>
            </span>
          </div>
          <input
            type="range"
            min={minDownPct}
            max={80}
            step={1}
            value={effectiveDownPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full"
            style={rangeProgress(effectiveDownPct, minDownPct, 80)}
          />
          <div className="flex justify-between text-xs text-text-muted mt-0.5">
            <span>{minDownPct}%</span>
            <span>80%</span>
          </div>
        </div>

        {/* Term and Rate */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Loan term
            </label>
            <select
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            >
              {defaults.termOptions.map((y) => (
                <option key={y} value={y}>
                  {y} years
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Interest rate
            </label>
            <div className="relative">
              <input
                type="number"
                step={0.1}
                min={0.1}
                max={15}
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(
                    Math.max(0.1, Math.min(15, Number(e.target.value)))
                  )
                }
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-text pr-8 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Total costs summary */}
        <div className="mb-4 rounded bg-white p-3 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Est. additional costs</span>
            <span className="text-sm font-semibold text-text">
              {formatEuro(additionalCosts.total)}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Taxes, notary, registration, fees ({defaults.label})
          </p>
        </div>

        {/* Residency toggle */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-text mb-1.5">
            I am a:
          </label>
          <div className="flex gap-0.5 rounded bg-border p-0.5">
            {(
              [
                ["resident", "Resident"],
                ["eu-non-resident", "EU Non-Res."],
                ["non-eu-non-resident", "Non-EU"],
              ] as [ResidencyStatus, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => handleResidencyChange(value)}
                className={`flex-1 rounded px-2 py-1.5 text-[13px] font-semibold transition-colors ${
                  residency === value
                    ? "bg-white text-text shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* NHG badge (NL only) */}
        {country === "NL" && (
          <div
            className={`mb-4 rounded p-3 text-sm ${
              nhgEligible
                ? "bg-primary/10 text-primary-dark border border-primary/30"
                : "bg-surface text-text-muted border border-border"
            }`}
          >
            {nhgEligible ? (
              <>
                <span className="font-semibold">✓ NHG eligible</span> — price
                within €435,000 limit. Potential rate discount of{" "}
                {defaults.nhgRateDiscount}%.
              </>
            ) : (
              <>
                <span className="font-semibold">NHG not available</span> — price
                exceeds €435,000 limit.
              </>
            )}
          </div>
        )}

        {/* CTA — ghost/secondary style */}
        <button
          onClick={() => setIsPanelOpen(true)}
          className="w-full h-12 rounded bg-accent/10 text-lg font-semibold text-accent hover:bg-accent/20 transition"
        >
          Detailed calculation →
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-text-muted mt-3 leading-relaxed">
          Indicative estimate only. Actual terms depend on your personal
          situation and lender assessment. Rates as of April 2026. Consult a
          qualified mortgage advisor.
        </p>
      </section>

      {/* Side panel */}
      {isPanelOpen && (
        <MortgagePanel
          propertyPrice={propertyPrice}
          country={country}
          energyLabel={energyLabel}
          residency={residency}
          downPaymentPct={effectiveDownPct}
          termYears={termYears}
          interestRate={interestRate}
          rateType={rateType}
          effectiveRate={effectiveRate}
          monthlyPayment={monthlyPayment}
          totalInterest={totalInterest}
          loanAmount={loanAmount}
          downPaymentEur={downPaymentEur}
          additionalCosts={additionalCosts}
          nlTaxBenefit={nlTaxBenefit}
          nhgEligible={nhgEligible}
          minDownPct={minDownPct}
          defaults={defaults}
          onResidencyChange={handleResidencyChange}
          onDownPaymentChange={setDownPaymentPct}
          onTermChange={setTermYears}
          onRateChange={setInterestRate}
          onRateTypeChange={handleRateTypeChange}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </>
  );
}
