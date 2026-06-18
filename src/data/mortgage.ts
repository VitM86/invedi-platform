export type CountryCode = "NL" | "ES" | "PT" | "FR" | "DE" | "GR";
export type ResidencyStatus = "resident" | "eu-non-resident" | "non-eu-non-resident";
export type RateType = "fixed" | "variable";

export interface CountryMortgageDefaults {
  label: string;
  defaultTermYears: number;
  maxTermYears: number;
  termOptions: number[];
  defaultRateFixed: number;
  defaultRateVariable: number | null;
  nonResidentRateSurcharge: number;
  ltvResident: number;
  ltvNonResident: number;
  minDownPctResident: number;
  minDownPctNonResident: number;
  hasVariableRate: boolean;
  additionalCosts: CostItem[];
  nhgLimit?: number;
  nhgPremiumPct?: number;
  nhgRateDiscount?: number;
  taxDeductionRate?: number;
}

export interface CostItem {
  label: string;
  type: "pct-price" | "pct-loan" | "fixed";
  value: number;
  note?: string;
}

export const mortgageDefaults: Record<CountryCode, CountryMortgageDefaults> = {
  NL: {
    label: "Netherlands",
    defaultTermYears: 30,
    maxTermYears: 30,
    termOptions: [10, 15, 20, 25, 30],
    defaultRateFixed: 3.8,
    defaultRateVariable: null,
    nonResidentRateSurcharge: 0.3,
    ltvResident: 100,
    ltvNonResident: 85,
    minDownPctResident: 0,
    minDownPctNonResident: 15,
    hasVariableRate: false,
    nhgLimit: 435000,
    nhgPremiumPct: 0.6,
    nhgRateDiscount: 0.3,
    taxDeductionRate: 36.97,
    additionalCosts: [
      { label: "Transfer tax", type: "pct-price", value: 2, note: "0% for first-time buyers (≤€510K)" },
      { label: "Notary (purchase deed)", type: "fixed", value: 750 },
      { label: "Notary (mortgage deed)", type: "fixed", value: 700 },
      { label: "Valuation", type: "fixed", value: 600 },
      { label: "Advisor / broker fee", type: "fixed", value: 3000 },
      { label: "Bank guarantee", type: "fixed", value: 500 },
    ],
  },
  ES: {
    label: "Spain",
    defaultTermYears: 25,
    maxTermYears: 30,
    termOptions: [10, 15, 20, 25, 30],
    defaultRateFixed: 3.5,
    defaultRateVariable: 3.2,
    nonResidentRateSurcharge: 0.4,
    ltvResident: 80,
    ltvNonResident: 65,
    minDownPctResident: 20,
    minDownPctNonResident: 30,
    hasVariableRate: true,
    additionalCosts: [
      { label: "IVA (VAT, new-build)", type: "pct-price", value: 10 },
      { label: "AJD (stamp duty)", type: "pct-price", value: 1.5 },
      { label: "Notary fees", type: "fixed", value: 900 },
      { label: "Land registry", type: "fixed", value: 550 },
      { label: "Legal fees", type: "pct-price", value: 1 },
      { label: "Valuation", type: "fixed", value: 450 },
      { label: "Mortgage arrangement", type: "pct-loan", value: 0.75 },
    ],
  },
  PT: {
    label: "Portugal",
    defaultTermYears: 30,
    maxTermYears: 40,
    termOptions: [10, 15, 20, 25, 30, 35, 40],
    defaultRateFixed: 3.5,
    defaultRateVariable: 3.0,
    nonResidentRateSurcharge: 0.3,
    ltvResident: 80,
    ltvNonResident: 65,
    minDownPctResident: 10,
    minDownPctNonResident: 25,
    hasVariableRate: true,
    additionalCosts: [
      { label: "IMT (transfer tax)", type: "pct-price", value: 6 },
      { label: "Stamp duty (IS)", type: "pct-price", value: 0.8 },
      { label: "Notary fees", type: "fixed", value: 750 },
      { label: "Land registry", type: "fixed", value: 375 },
      { label: "Legal fees", type: "pct-price", value: 0.75 },
      { label: "Valuation", type: "fixed", value: 375 },
      { label: "Mortgage stamp duty", type: "pct-loan", value: 0.6 },
    ],
  },
  FR: {
    label: "France",
    defaultTermYears: 20,
    maxTermYears: 25,
    termOptions: [10, 15, 20, 25],
    defaultRateFixed: 3.4,
    defaultRateVariable: null,
    nonResidentRateSurcharge: 0.2,
    ltvResident: 80,
    ltvNonResident: 75,
    minDownPctResident: 10,
    minDownPctNonResident: 20,
    hasVariableRate: false,
    additionalCosts: [
      { label: "Droits de mutation (notary fees incl.)", type: "pct-price", value: 2.5, note: "Reduced rate for new-builds" },
      { label: "Notary emoluments", type: "fixed", value: 1500 },
      { label: "Legal fees", type: "fixed", value: 2000 },
      { label: "Valuation", type: "fixed", value: 350 },
      { label: "Mortgage arrangement", type: "pct-loan", value: 0.5 },
    ],
  },
  DE: {
    label: "Germany",
    defaultTermYears: 20,
    maxTermYears: 30,
    termOptions: [10, 15, 20, 25, 30],
    defaultRateFixed: 3.6,
    defaultRateVariable: null,
    nonResidentRateSurcharge: 0.4,
    ltvResident: 80,
    ltvNonResident: 65,
    minDownPctResident: 20,
    minDownPctNonResident: 30,
    hasVariableRate: false,
    additionalCosts: [
      { label: "Grunderwerbsteuer (transfer tax)", type: "pct-price", value: 5, note: "Varies 3.5-6.5% by state" },
      { label: "Notary fees", type: "pct-price", value: 1.2 },
      { label: "Land registry", type: "pct-price", value: 0.5 },
      { label: "Legal fees", type: "fixed", value: 2500 },
      { label: "Valuation", type: "fixed", value: 1000 },
      { label: "Mortgage arrangement", type: "pct-loan", value: 0.75 },
    ],
  },
  GR: {
    label: "Greece",
    defaultTermYears: 20,
    maxTermYears: 30,
    termOptions: [10, 15, 20, 25, 30],
    defaultRateFixed: 5.0,
    defaultRateVariable: 4.5,
    nonResidentRateSurcharge: 0.7,
    ltvResident: 75,
    ltvNonResident: 60,
    minDownPctResident: 20,
    minDownPctNonResident: 40,
    hasVariableRate: true,
    additionalCosts: [
      { label: "Transfer tax", type: "pct-price", value: 3.09 },
      { label: "Notary fees", type: "pct-price", value: 0.75 },
      { label: "Land registry", type: "pct-price", value: 0.6 },
      { label: "Legal fees", type: "pct-price", value: 0.75 },
      { label: "Valuation", type: "fixed", value: 350 },
      { label: "Mortgage arrangement", type: "pct-loan", value: 1 },
    ],
  },
};

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  if (annualRate <= 0) return principal / (termYears * 12);
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateTotalInterest(
  monthlyPayment: number,
  principal: number,
  termYears: number
): number {
  return monthlyPayment * termYears * 12 - principal;
}

export function calculateAdditionalCosts(
  propertyPrice: number,
  loanAmount: number,
  costs: CostItem[]
): { items: { label: string; amount: number; note?: string }[]; total: number } {
  const items = costs.map((cost) => {
    let amount = 0;
    if (cost.type === "pct-price") amount = propertyPrice * (cost.value / 100);
    else if (cost.type === "pct-loan") amount = loanAmount * (cost.value / 100);
    else amount = cost.value;
    return { label: cost.label, amount: Math.round(amount), note: cost.note };
  });
  return { items, total: items.reduce((sum, i) => sum + i.amount, 0) };
}

export function calculateNLTaxBenefit(
  principal: number,
  annualRate: number,
  deductionRate: number
): number {
  if (annualRate <= 0 || principal <= 0) return 0;
  const monthlyInterest = principal * (annualRate / 100 / 12);
  return (monthlyInterest * deductionRate) / 100;
}

/**
 * Mortgage-scoped EUR formatter. Mirrors the platform-wide `formatPriceFull` convention:
 * period thousands separator (NL/DE/PT/ES audience), whole euros, no decimals.
 * Defined locally instead of importing because mortgage.ts is a leaf data module — keeping
 * it dependency-free preserves easy tree-shaking in the mortgage widget bundle.
 */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
