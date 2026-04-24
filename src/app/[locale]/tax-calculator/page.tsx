'use client';

import { useState, useMemo } from 'react';

// ─── Tax slab types ───────────────────────────────────────────────
interface Slab {
  min: number;
  max: number | null; // null = no upper bound
  rate: number;       // percentage
}

// ─── FY 2025-26 New Regime slabs (post-Budget 2025) ──────────────
const NEW_REGIME_SLABS: Slab[] = [
  { min: 0,         max: 400000,  rate: 0  },
  { min: 400000,    max: 800000,  rate: 5  },
  { min: 800000,    max: 1200000, rate: 10 },
  { min: 1200000,   max: 1600000, rate: 15 },
  { min: 1600000,   max: 2000000, rate: 20 },
  { min: 2000000,   max: 2400000, rate: 25 },
  { min: 2400000,   max: null,    rate: 30 },
];

// ─── Old Regime slabs (below 60 yrs) ─────────────────────────────
const OLD_REGIME_SLABS: Slab[] = [
  { min: 0,        max: 250000,  rate: 0  },
  { min: 250000,   max: 500000,  rate: 5  },
  { min: 500000,   max: 1000000, rate: 20 },
  { min: 1000000,  max: null,    rate: 30 },
];

// ─── Slab tax computation ─────────────────────────────────────────
function computeSlabTax(income: number, slabs: Slab[]): { tax: number; breakdown: { label: string; taxable: number; rate: number; tax: number }[] } {
  let tax = 0;
  const breakdown: { label: string; taxable: number; rate: number; tax: number }[] = [];

  for (const slab of slabs) {
    if (income <= slab.min) break;
    const upper = slab.max ?? Infinity;
    const taxable = Math.min(income, upper) - slab.min;
    const slabTax = (taxable * slab.rate) / 100;
    tax += slabTax;

    const label = slab.max
      ? `₹${fmt(slab.min)} – ₹${fmt(slab.max)}`
      : `Above ₹${fmt(slab.min)}`;

    breakdown.push({ label, taxable, rate: slab.rate, tax: slabTax });
  }

  return { tax, breakdown };
}

// ─── Surcharge (regime-aware) ────────────────────────────────────
// Old regime:  10% (>₹50L), 15% (>₹1Cr), 25% (>₹2Cr), 37% (>₹5Cr)
// New regime:  capped at 25% from Budget 2023 — no 37% bracket
function surchargeRatePct(income: number, newRegime = false): number {
  if (!newRegime && income > 50000000) return 37;
  if (income > 20000000) return 25;
  if (income > 10000000) return 15;
  if (income > 5000000)  return 10;
  return 0;
}
function surcharge(income: number, tax: number, newRegime = false): number {
  return tax * surchargeRatePct(income, newRegime) / 100;
}

// ─── Number formatter ─────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat('en-IN').format(Math.round(n));
}

// ─── Deduction row component ──────────────────────────────────────
function DeductionRow({
  label, sublabel, value, onChange, max, disabled = false
}: {
  label: string; sublabel: string; value: number;
  onChange: (v: number) => void; max: number; disabled?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0 ${disabled ? 'opacity-40' : ''}`}>
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <span className="bg-gray-50 px-2 py-1.5 text-sm text-gray-500 border-r border-gray-200">₹</span>
          <input
            type="number"
            disabled={disabled}
            min={0} max={max}
            value={value || ''}
            placeholder="0"
            onChange={e => onChange(Math.min(Number(e.target.value), max))}
            className="w-32 px-2 py-1.5 text-sm text-right focus:outline-none disabled:bg-gray-50"
          />
        </div>
        <span className="text-xs text-gray-400">Max ₹{fmt(max)}</span>
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────
function ResultCard({
  regime, grossSalary, taxableIncome, slabTax,
  surchargeAmt, surchargeRate, cess, rebate, finalTax,
  breakdown, isRecommended,
}: {
  regime: string; grossSalary: number; taxableIncome: number;
  slabTax: number; surchargeAmt: number; surchargeRate: number; cess: number;
  rebate: number; finalTax: number;
  breakdown: { label: string; taxable: number; rate: number; tax: number }[];
  isRecommended: boolean;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const effectiveRate = grossSalary > 0 ? (finalTax / grossSalary) * 100 : 0;
  const monthlyTax = finalTax / 12;
  const takeHome = grossSalary - finalTax;

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${isRecommended ? 'border-green-400 shadow-lg shadow-green-100' : 'border-gray-200'}`}>
      {/* Header */}
      <div className={`px-5 py-3 flex items-center justify-between ${isRecommended ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
        <h3 className="font-bold text-base">{regime}</h3>
        {isRecommended && (
          <span className="bg-white text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">✓ BETTER CHOICE</span>
        )}
      </div>

      {/* Key numbers */}
      <div className="bg-white px-5 py-4 grid grid-cols-2 gap-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Taxable Income</p>
          <p className="text-lg font-bold text-gray-800">₹{fmt(taxableIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Tax Payable</p>
          <p className={`text-lg font-bold ${isRecommended ? 'text-green-600' : 'text-red-500'}`}>₹{fmt(finalTax)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Effective Tax Rate</p>
          <p className="text-base font-semibold text-gray-700">{effectiveRate.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Monthly TDS</p>
          <p className="text-base font-semibold text-gray-700">₹{fmt(monthlyTax)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-400">Annual Take-Home</p>
          <p className="text-xl font-bold text-indigo-600">₹{fmt(takeHome)}</p>
        </div>
      </div>

      {/* Tax computation summary */}
      <div className="bg-white px-5 py-4 space-y-2 text-sm border-b border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Slab Tax</span><span className="font-medium">₹{fmt(slabTax)}</span>
        </div>
        {rebate > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Rebate u/s 87A</span><span className="font-medium">− ₹{fmt(rebate)}</span>
          </div>
        )}
        {surchargeAmt > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Surcharge ({surchargeRate}% on slab tax)</span>
            <span className="font-medium">+ ₹{fmt(surchargeAmt)}</span>
          </div>
        )}
        {surchargeAmt === 0 && taxableIncome > 0 && (
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Surcharge</span><span>₹0 (income ≤ ₹50L)</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Health & Education Cess (4%)</span><span className="font-medium">+ ₹{fmt(cess)}</span>
        </div>
        <div className="flex justify-between text-gray-800 font-bold border-t pt-2">
          <span>Net Tax Payable</span><span>₹{fmt(finalTax)}</span>
        </div>
      </div>

      {/* Slab breakdown toggle */}
      <div className="bg-white px-5 pb-4">
        <button
          onClick={() => setShowBreakdown(v => !v)}
          className="text-xs text-indigo-500 hover:text-indigo-700 mt-3 flex items-center gap-1"
        >
          {showBreakdown ? '▲ Hide' : '▼ Show'} slab-wise breakdown
        </button>
        {showBreakdown && (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 text-xs">
            <div className="grid grid-cols-4 bg-gray-50 px-3 py-1.5 font-semibold text-gray-500">
              <span className="col-span-2">Slab</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Tax</span>
            </div>
            {breakdown.map(b => (
              <div key={b.label} className={`grid grid-cols-4 px-3 py-1.5 border-t border-gray-50 ${b.tax === 0 ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="col-span-2">{b.label}</span>
                <span className="text-right">{b.rate}%</span>
                <span className="text-right">₹{fmt(b.tax)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function TaxCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState<number>(0);

  // Old regime deductions
  const [sec80C,  setSec80C]  = useState(0);
  const [sec80D,  setSec80D]  = useState(0);
  const [monthlyRent, setMonthlyRent] = useState(0);  // for HRA calculation
  const [actualHraReceived, setActualHraReceived] = useState(0); // annual HRA received from employer
  const [isMetro, setIsMetro] = useState(true);        // metro = 50% of basic, non-metro = 40%
  const [lta,     setLta]     = useState(0);
  const [other80, setOther80] = useState(0);

  // Employer NPS % — available in both regimes (Sec 80CCD(2))
  const [npsNewPct, setNpsNewPct] = useState(0); // max 14% in new regime
  const [npsOldPct, setNpsOldPct] = useState(0); // max 10% in old regime

  // Additional income sources
  const [otherIncome, setOtherIncome]               = useState(0); // annual (business, interest, etc.)
  const [monthlyRentalIncome, setMonthlyRentalIncome] = useState(0); // monthly rent received
  const [rentalHomeLoanInterest, setRentalHomeLoanInterest] = useState(0); // annual home loan interest on rental property (Sec 24(b))

  const results = useMemo(() => {
    if (!grossSalary) return null;

    // ── Additional income sources ─────────────────────────────
    // Rental income: Sec 24(a) — 30% standard deduction on annual rental
    // Sec 24(b) — actual home loan interest on rental property (no cap for let-out property)
    const annualRentalIncome  = monthlyRentalIncome * 12;
    const rentalStdDeduction  = Math.round(annualRentalIncome * 0.3);
    const taxableRentalIncome = Math.max(0, annualRentalIncome - rentalStdDeduction - rentalHomeLoanInterest);
    const totalGrossIncome    = grossSalary + otherIncome + taxableRentalIncome;

    // ── Employer PF (auto) ────────────────────────────────────
    // Basic = 50% of gross salary (salary component only)
    const basic            = grossSalary * 0.5;
    const employerPF       = Math.round(basic * 0.12);
    // Exempt up to ₹7,50,000 (Sec 17(2)(vii) — combined EPF+NPS+superannuation cap)
    const employerPFExempt = Math.min(employerPF, 750000);
    // Amount above ₹7.5L stays in income (already part of CTC/gross)
    const employerPFTaxable = Math.max(0, employerPF - 750000);
    // Sec 17(2)(vii): combined PF + NPS + superannuation cap = ₹7.5L
    // NPS deduction is limited to the cap remaining after PF
    const remainingCap = Math.max(0, 750000 - employerPFExempt);

    // ── HRA Exemption — Sec 10(13A) (Old Regime only) ────────
    // Three components of the formula:
    const hraBasicPct    = isMetro ? basic * 0.5 : basic * 0.4;  // ② 50%/40% of basic
    const annualRent     = monthlyRent * 12;
    const hraRentSurplus = Math.max(0, annualRent - basic * 0.1); // ③ rent paid − 10% of basic
    // Exempt = min(① actual HRA received, ② basic%, ③ rent surplus)
    const hraExempt      = (actualHraReceived > 0 && monthlyRent > 0)
      ? Math.min(actualHraReceived, hraBasicPct, hraRentSurplus)
      : 0;

    // ── Employer NPS — Sec 80CCD(2) + combined cap ────────────
    // New regime: max 14% of basic; Old regime: max 10% of basic
    // Deductible is further capped by remaining ₹7.5L after PF (Sec 17(2)(vii))
    const npsNewAmt        = Math.round(basic * npsNewPct / 100);
    const npsOldAmt        = Math.round(basic * npsOldPct / 100);
    const npsNewDeductible = Math.min(npsNewAmt, remainingCap); // capped at remaining limit
    const npsOldDeductible = Math.min(npsOldAmt, remainingCap);

    // Regime-specific effective income (total gross − PF exempt − NPS deductible)
    // Different because NPS% and deductible amounts differ per regime
    const effectiveIncomeNew = totalGrossIncome - employerPFExempt - npsNewDeductible;
    const effectiveIncomeOld = totalGrossIncome - employerPFExempt - npsOldDeductible;

    // ── NEW REGIME ──────────────────────────────────────────────
    const newStdDeduction  = 75000;
    const newTaxableIncome = Math.max(0, effectiveIncomeNew - newStdDeduction);
    const { tax: newSlabTax, breakdown: newBreakdown } = computeSlabTax(newTaxableIncome, NEW_REGIME_SLABS);
    const newRebate        = newTaxableIncome <= 1200000 ? newSlabTax : 0;
    const newAfterRebate   = Math.max(0, newSlabTax - newRebate);
    const newSurcharge     = surcharge(newTaxableIncome, newAfterRebate, true); // new regime: capped at 25%
    const newSurchargeRate = surchargeRatePct(newTaxableIncome, true);
    const newCess          = (newAfterRebate + newSurcharge) * 0.04;
    const newFinalTax      = newAfterRebate + newSurcharge + newCess;

    // ── OLD REGIME ──────────────────────────────────────────────
    const oldStdDeduction  = 50000;
    const totalDeductions  =
      oldStdDeduction +
      Math.min(sec80C, 150000) +
      Math.min(sec80D, 100000) +
      hraExempt +
      lta +
      other80; // NPS is already in effectiveIncomeOld (under combined ₹7.5L cap)
    const oldTaxableIncome = Math.max(0, effectiveIncomeOld - totalDeductions);
    const { tax: oldSlabTax, breakdown: oldBreakdown } = computeSlabTax(oldTaxableIncome, OLD_REGIME_SLABS);
    const oldRebate        = oldTaxableIncome <= 500000 ? Math.min(oldSlabTax, 12500) : 0;
    const oldAfterRebate   = Math.max(0, oldSlabTax - oldRebate);
    const oldSurcharge     = surcharge(oldTaxableIncome, oldAfterRebate); // old regime: up to 37%
    const oldSurchargeRate = surchargeRatePct(oldTaxableIncome);
    const oldCess          = (oldAfterRebate + oldSurcharge) * 0.04;
    const oldFinalTax      = oldAfterRebate + oldSurcharge + oldCess;

    return {
      basic,
      employerPF,
      employerPFExempt,
      employerPFTaxable,
      remainingCap,
      effectiveIncomeNew,
      effectiveIncomeOld,
      totalGrossIncome,
      annualRentalIncome,
      rentalStdDeduction,
      taxableRentalIncome,
      rentalHomeLoanInterest,
      npsNewAmt,
      npsOldAmt,
      npsNewDeductible,
      npsOldDeductible,
      hraBasicPct,
      hraRentSurplus,
      hraExempt,
      monthlyRent,
      isMetro,
      new: {
        taxableIncome: newTaxableIncome,
        slabTax: newSlabTax,
        rebate: newRebate,
        surcharge: newSurcharge,
        surchargeRate: newSurchargeRate,
        cess: newCess,
        finalTax: newFinalTax,
        breakdown: newBreakdown,
      },
      old: {
        taxableIncome: oldTaxableIncome,
        slabTax: oldSlabTax,
        rebate: oldRebate,
        surcharge: oldSurcharge,
        surchargeRate: oldSurchargeRate,
        cess: oldCess,
        finalTax: oldFinalTax,
        breakdown: oldBreakdown,
      },
    };
  }, [grossSalary, otherIncome, monthlyRentalIncome, rentalHomeLoanInterest, sec80C, sec80D, monthlyRent, actualHraReceived, isMetro, lta, other80, npsNewPct, npsOldPct]);

  const newIsBetter = results ? results.new.finalTax <= results.old.finalTax : false;
  const saving = results ? Math.abs(results.old.finalTax - results.new.finalTax) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🇮🇳 Income Tax Calculator</h1>
          <p className="text-gray-500 text-sm mt-1">FY 2025-26 · Old Regime vs New Regime · Individual (below 60 yrs)</p>
        </div>

        {/* Salary input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Gross Salary (CTC / Total Income)
          </label>
          <p className="text-xs text-gray-400 mb-3">Enter your total annual income before any deductions</p>
          <div className="flex items-center border-2 border-indigo-300 focus-within:border-indigo-500 rounded-xl overflow-hidden">
            <span className="bg-indigo-50 px-4 py-3 text-indigo-600 font-bold text-lg border-r border-indigo-200">₹</span>
            <input
              type="number"
              min={0}
              value={grossSalary || ''}
              placeholder="e.g. 1200000"
              onChange={e => setGrossSalary(Number(e.target.value))}
              className="flex-1 px-4 py-3 text-lg font-semibold text-gray-800 focus:outline-none"
            />
            {grossSalary > 0 && (
              <span className="px-4 text-sm text-gray-400 whitespace-nowrap">
                ₹{fmt(grossSalary / 100000)} L
              </span>
            )}
          </div>
        </div>

        {/* Additional income sources */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-1">➕ Additional Income Sources</h2>
          <p className="text-xs text-gray-400 mb-4">Added on top of your salary to compute total gross income.</p>

          {/* Other Income */}
          <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Other Income</p>
              <p className="text-xs text-gray-400">Business, capital gains, interest, dividends, etc. (annual amount)</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <span className="bg-gray-50 px-2 py-1.5 text-sm text-gray-500 border-r border-gray-200">₹</span>
                <input
                  type="number"
                  min={0}
                  value={otherIncome || ''}
                  placeholder="0"
                  onChange={e => setOtherIncome(Number(e.target.value))}
                  className="w-36 px-2 py-1.5 text-sm text-right focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rental Income */}
          <div className="py-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium text-gray-700">Rental Income</p>
                <p className="text-xs text-gray-400">Monthly rent received. Sec 24(a) 30% std deduction + Sec 24(b) home loan interest auto-applied.</p>
              </div>
              {/* Monthly rent */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                <span className="bg-gray-50 px-2 py-1.5 text-xs text-gray-500 border-r border-gray-200">₹/mo rent</span>
                <input
                  type="number"
                  min={0}
                  value={monthlyRentalIncome || ''}
                  placeholder="0"
                  onChange={e => setMonthlyRentalIncome(Number(e.target.value))}
                  className="w-32 px-2 py-1.5 text-sm text-right focus:outline-none"
                />
              </div>
            </div>

            {/* Home loan interest on rental property */}
            {monthlyRentalIncome > 0 && (
              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600">Home Loan Interest on Rental Property</p>
                  <p className="text-xs text-gray-400">Sec 24(b) — Full deduction allowed (no cap for let-out property)</p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                  <span className="bg-gray-50 px-2 py-1.5 text-xs text-gray-500 border-r border-gray-200">₹/yr</span>
                  <input
                    type="number"
                    min={0}
                    value={rentalHomeLoanInterest || ''}
                    placeholder="0"
                    onChange={e => setRentalHomeLoanInterest(Number(e.target.value))}
                    className="w-32 px-2 py-1.5 text-sm text-right focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Rental income breakdown */}
            {monthlyRentalIncome > 0 && (() => {
              const annualR = monthlyRentalIncome * 12;
              const stdDed  = Math.round(annualR * 0.3);
              const afterStd = annualR - stdDed;
              const taxable  = Math.max(0, afterStd - rentalHomeLoanInterest);
              return (
                <div className="mt-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-xs space-y-0.5 text-teal-700">
                  <p>Annual rental = ₹{fmt(monthlyRentalIncome)} × 12 = <strong>₹{fmt(annualR)}</strong></p>
                  <p>Sec 24(a) std deduction (30%) = <strong className="text-red-600">− ₹{fmt(stdDed)}</strong></p>
                  {rentalHomeLoanInterest > 0 && (
                    <p>Sec 24(b) home loan interest = <strong className="text-red-600">− ₹{fmt(rentalHomeLoanInterest)}</strong></p>
                  )}
                  <p className="font-semibold text-teal-800 pt-0.5 border-t border-teal-200">
                    Taxable rental income = <strong>₹{fmt(taxable)}</strong>
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Total income summary */}
          {grossSalary > 0 && (otherIncome > 0 || monthlyRentalIncome > 0) && results && (
            <div className="mt-1 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm">
              <p className="font-semibold text-indigo-800 mb-1">📊 Total Gross Income Breakdown</p>
              <div className="space-y-0.5 text-xs text-indigo-700">
                <p>Salary (CTC): ₹{fmt(grossSalary)}</p>
                {otherIncome > 0 && <p>+ Other Income: ₹{fmt(otherIncome)}</p>}
                {monthlyRentalIncome > 0 && (
                  <p>+ Taxable Rental (after 30% std{rentalHomeLoanInterest > 0 ? ' + home loan interest' : ''}, from ₹{fmt(results.annualRentalIncome)}): ₹{fmt(results.taxableRentalIncome)}</p>
                )}
                <p className="text-indigo-900 font-bold text-sm pt-1 border-t border-indigo-200">
                  = Total Gross Income: ₹{fmt(results.totalGrossIncome)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Old regime deductions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-gray-800">📝 Deductions & Taxable Income Waterfall</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5">Enter deductions below. The waterfall shows how each one reduces your taxable income — per regime.</p>

          {/* Employer PF info */}
          {grossSalary > 0 && results && (
            <div className="mb-5 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-lg mt-0.5">🏦</span>
              <div className="space-y-0.5">
                <p className="font-semibold text-blue-800">Employer PF Contribution (auto-calculated)</p>
                <p className="text-blue-700">
                  Basic = 50% × ₹{fmt(grossSalary)} = <strong>₹{fmt(results.basic)}</strong>
                </p>
                <p className="text-blue-700">
                  Employer PF = 12% × ₹{fmt(results.basic)} = <strong>₹{fmt(results.employerPF)}</strong>
                </p>
                <p className="text-blue-700">
                  Exempt (u/s 17(2)(vii), up to ₹7.5L): <strong className="text-green-700">₹{fmt(results.employerPFExempt)}</strong>{' '}
                  — deducted from taxable income (it&apos;s part of CTC but goes to PF).
                  {results.employerPFTaxable > 0 && (
                    <> The remaining <strong className="text-red-600">₹{fmt(results.employerPFTaxable)}</strong> exceeds the ₹7.5L cap and stays in income.</>
                  )}
                </p>
                {results.employerPFTaxable === 0 && (
                  <p className="text-xs text-green-700 mt-1">✅ Entire employer PF (₹{fmt(results.employerPF)}) is within the ₹7.5L cap and is deducted from taxable income.</p>
                )}
              </div>
            </div>
          )}

          {/* Employer NPS contribution dropdowns */}
          {grossSalary > 0 && results && (
            <div className="mb-5 flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-lg mt-0.5">🏛️</span>
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-purple-800">
                  Employer NPS Contribution — Sec 80CCD(2){' '}
                  <span className="ml-2 text-[10px] font-normal bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">Both Regimes</span>
                </p>
                <p className="text-xs text-purple-600">
                  Basic = 50% × ₹{fmt(grossSalary)} = <strong>₹{fmt(results.basic)}</strong>.
                  Employer&apos;s NPS contribution is fully deductible under 80CCD(2) — up to 14% of basic in the New Regime and 10% in the Old Regime.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* New Regime dropdown */}
                  <div className="bg-white rounded-lg border border-purple-200 px-3 py-2 space-y-1.5">
                    <p className="text-xs font-semibold text-purple-700">New Regime <span className="text-gray-400 font-normal">(max 14%)</span></p>
                    <select
                      value={npsNewPct}
                      onChange={e => setNpsNewPct(Number(e.target.value))}
                      className="w-full text-sm border border-purple-200 rounded-md px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      {[0, 5, 8, 10, 12, 14].map(p => (
                        <option key={p} value={p}>{p}%</option>
                      ))}
                    </select>
                    {npsNewPct > 0 && (
                      <p className="text-xs text-green-700 font-medium">
                        Deduction: − ₹{fmt(results.npsNewAmt)}
                      </p>
                    )}
                  </div>
                  {/* Old Regime dropdown */}
                  <div className="bg-white rounded-lg border border-purple-200 px-3 py-2 space-y-1.5">
                    <p className="text-xs font-semibold text-purple-700">Old Regime <span className="text-gray-400 font-normal">(max 10%)</span></p>
                    <select
                      value={npsOldPct}
                      onChange={e => setNpsOldPct(Number(e.target.value))}
                      className="w-full text-sm border border-purple-200 rounded-md px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      {[0, 5, 8, 10].map(p => (
                        <option key={p} value={p}>{p}%</option>
                      ))}
                    </select>
                    {npsOldPct > 0 && (
                      <p className="text-xs text-green-700 font-medium">
                        Deduction: − ₹{fmt(results.npsOldAmt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input rows */}
          <DeductionRow
            label="Section 80C" sublabel="PPF, ELSS, LIC, EPF, home loan principal, tuition fees"
            value={sec80C} onChange={setSec80C} max={150000}
          />
          <DeductionRow
            label="Section 80D" sublabel="Health insurance premium (self + family)"
            value={sec80D} onChange={setSec80D} max={100000}
          />

          {/* HRA — custom section with HRA input + rent input + metro toggle */}
          <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                HRA Exemption{' '}
                <span className="text-[11px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">old only</span>
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Section 10(13A) — Exempt = <strong>min</strong>(① HRA received, ② 50%/40% of basic, ③ rent − 10% of basic)
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {/* ① HRA received from employer */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">① HRA received (annual)</p>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <span className="bg-gray-50 px-2 py-1.5 text-xs text-gray-500 border-r border-gray-200">₹/yr</span>
                    <input
                      type="number"
                      min={0}
                      value={actualHraReceived || ''}
                      placeholder="e.g. 300000"
                      onChange={e => setActualHraReceived(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm text-right focus:outline-none"
                    />
                  </div>
                </div>
                {/* Monthly rent paid */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">③ Rent paid (monthly)</p>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <span className="bg-gray-50 px-2 py-1.5 text-xs text-gray-500 border-r border-gray-200">₹/mo</span>
                    <input
                      type="number"
                      min={0}
                      value={monthlyRent || ''}
                      placeholder="e.g. 25000"
                      onChange={e => setMonthlyRent(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm text-right focus:outline-none"
                    />
                  </div>
                </div>
                {/* Metro toggle */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">② City type (for basic %)</p>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-medium">
                    <button
                      onClick={() => setIsMetro(true)}
                      className={`flex-1 px-3 py-1.5 transition-colors ${isMetro ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      Metro (50%)
                    </button>
                    <button
                      onClick={() => setIsMetro(false)}
                      className={`flex-1 px-3 py-1.5 border-l border-gray-200 transition-colors ${isMetro ? 'bg-white text-gray-500 hover:bg-gray-50' : 'bg-indigo-600 text-white'}`}
                    >
                      Non-Metro (40%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Formula breakdown */}
              {grossSalary > 0 && results && actualHraReceived > 0 && monthlyRent > 0 && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs space-y-1 text-amber-800">
                  <p>① HRA received (from employer): <strong>₹{fmt(actualHraReceived)}</strong></p>
                  <p>② {isMetro ? '50' : '40'}% × basic ₹{fmt(results.basic)}: <strong>₹{fmt(results.hraBasicPct)}</strong></p>
                  <p>③ Rent ₹{fmt(monthlyRent * 12)} − 10% of basic ₹{fmt(results.basic * 0.1)}: <strong>₹{fmt(results.hraRentSurplus)}</strong></p>
                  <p className="font-bold text-green-700 pt-1 border-t border-amber-300">
                    Exempt = min(①, ②, ③) = ₹{fmt(results.hraExempt)}
                  </p>
                </div>
              )}
              {(actualHraReceived === 0 || monthlyRent === 0) && (() => {
                let msg = 'Enter HRA received and monthly rent to calculate exemption.';
                if (actualHraReceived === 0 && monthlyRent > 0) msg = 'Enter annual HRA received from employer.';
                if (actualHraReceived > 0 && monthlyRent === 0) msg = 'Enter monthly rent paid.';
                return <p className="text-xs text-gray-400 mt-2">{msg}</p>;
              })()}
            </div>
            {grossSalary > 0 && results && (
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-green-700">− ₹{fmt(results.hraExempt)}</p>
                <p className="text-xs text-gray-400">auto-calculated</p>
              </div>
            )}
          </div>
          <DeductionRow
            label="LTA" sublabel="Leave Travel Allowance exemption"
            value={lta} onChange={setLta} max={100000}
          />
          <DeductionRow
            label="Other Deductions" sublabel="80E, 80G, NPS (80CCD), home loan interest, etc."
            value={other80} onChange={setOther80} max={500000}
          />

          {/* Side-by-side waterfall */}
          {grossSalary > 0 && results && (() => {
            const {
              effectiveIncomeNew, effectiveIncomeOld,
              employerPF, employerPFExempt, employerPFTaxable,
              npsNewAmt, npsOldAmt, npsNewDeductible, npsOldDeductible,
              hraExempt, totalGrossIncome: tgi, remainingCap,
            } = results;

            // Post-PF income (before NPS) — same for both regimes
            const afterPF = tgi - employerPFExempt;

            // Old regime running totals (start from effectiveIncomeOld — PF+NPS already deducted)
            const oldStd      = 50000;
            const oldAfterStd = Math.max(0, effectiveIncomeOld - oldStd);
            const oldAfter80C = Math.max(0, oldAfterStd - Math.min(sec80C, 150000));
            const oldAfter80D = Math.max(0, oldAfter80C - Math.min(sec80D, 100000));
            const oldAfterHRA = Math.max(0, oldAfter80D - hraExempt);
            const oldAfterLTA = Math.max(0, oldAfterHRA - lta);
            const oldAfterOth = Math.max(0, oldAfterLTA - other80);

            // New regime running totals (start from effectiveIncomeNew — PF+NPS already deducted)
            const newStd      = 75000;
            const newAfterStd = Math.max(0, effectiveIncomeNew - newStd);

            type WaterfallRow = {
              label: string;
              sublabel?: string;
              oldDed: number;
              newDed: number;
              oldRunning: number;
              newRunning: number;
              onlyOld?: boolean;
              auto?: boolean;
              isAdd?: boolean;
              bothRegimes?: boolean;
            };

            const hraCityLabel = isMetro ? 'Metro (50%)' : 'Non-Metro (40%)';

            // NPS cap sublabel
            const npsCapHit   = npsNewDeductible < npsNewAmt || npsOldDeductible < npsOldAmt;
            const npsSublabel = npsCapHit
              ? `Capped at ₹7.5L limit (remaining cap ₹${fmt(remainingCap)}) · New: ₹${fmt(npsNewDeductible)} of ₹${fmt(npsNewAmt)} · Old: ₹${fmt(npsOldDeductible)} of ₹${fmt(npsOldAmt)}`
              : `New Regime: ${npsNewPct}% × ₹${fmt(results.basic)} = ₹${fmt(npsNewAmt)} · Old Regime: ${npsOldPct}% × ₹${fmt(results.basic)} = ₹${fmt(npsOldAmt)}`;

            const rows: WaterfallRow[] = [
              // ── Employer PF ──────────────────────────────────────────
              {
                label: 'Employer PF — Exempt Deduction',
                sublabel: employerPFTaxable > 0
                  ? `12% × ₹${fmt(results.basic)} = ₹${fmt(employerPF)} · ₹${fmt(employerPFTaxable)} above ₹7.5L cap stays in income`
                  : `12% × ₹${fmt(results.basic)} = ₹${fmt(employerPF)} · fully within ₹7.5L cap`,
                oldDed: employerPFExempt,
                newDed: employerPFExempt,
                oldRunning: afterPF,
                newRunning: afterPF,
                auto: true,
                bothRegimes: true,
              },
              // ── Employer NPS (right after PF — same combined cap) ────
              {
                label: 'Employer NPS — 80CCD(2)',
                sublabel: npsSublabel,
                oldDed: npsOldDeductible,
                newDed: npsNewDeductible,
                oldRunning: effectiveIncomeOld,
                newRunning: effectiveIncomeNew,
                bothRegimes: npsNewDeductible > 0 || npsOldDeductible > 0 ? true : undefined,
                auto: true,
              },
              {
                label: 'Standard Deduction',
                oldDed: oldStd,
                newDed: newStd,
                oldRunning: oldAfterStd,
                newRunning: newAfterStd,
              },
              {
                label: 'Section 80C',
                sublabel: 'PPF, ELSS, LIC, EPF, home loan principal, tuition fees',
                oldDed: Math.min(sec80C, 150000),
                newDed: 0,
                oldRunning: oldAfter80C,
                newRunning: newAfterStd,
                onlyOld: true,
              },
              {
                label: 'Section 80D',
                sublabel: 'Health insurance premium',
                oldDed: Math.min(sec80D, 100000),
                newDed: 0,
                oldRunning: oldAfter80D,
                newRunning: newAfterStd,
                onlyOld: true,
              },
              {
                label: 'HRA Exemption',
                sublabel: monthlyRent > 0
                  ? `Monthly rent ₹${fmt(monthlyRent)} · ${hraCityLabel} · Auto-calculated`
                  : 'Enter monthly rent to calculate',
                oldDed: hraExempt,
                newDed: 0,
                oldRunning: oldAfterHRA,
                newRunning: newAfterStd,
                onlyOld: true,
              },
              {
                label: 'LTA',
                oldDed: lta,
                newDed: 0,
                oldRunning: oldAfterLTA,
                newRunning: newAfterStd,
                onlyOld: true,
              },
              {
                label: 'Other Deductions',
                sublabel: '80E, 80G, home loan interest, etc.',
                oldDed: other80,
                newDed: 0,
                oldRunning: oldAfterOth,
                newRunning: newAfterStd,
                onlyOld: true,
              },
            ];

            return (
              <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden text-sm">
                {/* Header */}
                <div className="grid grid-cols-[1fr_auto_auto] bg-gray-800 text-white text-xs font-semibold">
                  <div className="px-4 py-2.5">Deduction</div>
                  <div className="px-4 py-2.5 w-44 text-center border-l border-gray-600">
                    Old Regime <span className="font-normal opacity-70">(std ₹50k)</span>
                  </div>
                  <div className="px-4 py-2.5 w-44 text-center border-l border-gray-600">
                    New Regime <span className="font-normal opacity-70">(std ₹75k)</span>
                  </div>
                </div>

                {/* Gross row */}
                <div className="grid grid-cols-[1fr_auto_auto] bg-gray-50 border-b border-gray-100 font-semibold">
                  <div className="px-4 py-2.5 text-gray-700 flex items-center gap-2 flex-wrap">
                    <span>💼</span>
                    <span>Total Gross Income</span>
                    {(otherIncome > 0 || monthlyRentalIncome > 0) && (
                      <span className="text-[10px] font-normal text-gray-400">
                        Salary ₹{fmt(grossSalary)}{otherIncome > 0 ? ` + Other ₹${fmt(otherIncome)}` : ''}{results.taxableRentalIncome > 0 ? ` + Rental ₹${fmt(results.taxableRentalIncome)}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="px-4 py-2.5 w-44 text-center text-gray-800 border-l border-gray-100">
                    ₹{fmt(results.totalGrossIncome)}
                  </div>
                  <div className="px-4 py-2.5 w-44 text-center text-gray-800 border-l border-gray-100">
                    ₹{fmt(results.totalGrossIncome)}
                  </div>
                </div>

                {/* Deduction rows */}
                {rows.map((row) => {
                  const hasOld = row.oldDed !== 0;
                  const hasNew = row.newDed !== 0;
                  const inactive = !hasOld && !hasNew && !row.auto;

                  const cellBg = (has: boolean) => {
                    if (row.isAdd) return 'bg-orange-50';
                    return has ? 'bg-red-50' : 'bg-gray-50';
                  };

                  const cellValue = (ded: number) => {
                    if (row.isAdd) return <span className="text-orange-600 font-medium">+ ₹{fmt(Math.abs(ded))}</span>;
                    if (ded > 0)   return <span className="text-red-500 font-medium">− ₹{fmt(ded)}</span>;
                    if (row.onlyOld && ded === 0) return <span className="text-gray-300 text-xs">₹0 (not allowed)</span>;
                    return <span className="text-green-600 text-xs font-medium">✅ Exempt</span>;
                  };

                  return (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[1fr_auto_auto] border-b border-gray-100 transition-opacity ${inactive ? 'opacity-35' : ''}`}
                    >
                      {/* Label */}
                      <div className="px-4 py-2.5 text-gray-600">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={row.isAdd ? 'text-orange-300' : 'text-gray-300'}>{row.isAdd ? '➕' : '➖'}</span>
                          <span>{row.label}</span>
                          {row.auto && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">auto</span>
                          )}
                          {row.bothRegimes && (
                            <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">both regimes</span>
                          )}
                          {row.onlyOld && !row.bothRegimes && (
                            <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">old only</span>
                          )}
                        </div>
                        {row.sublabel && (
                          <p className="text-[11px] text-gray-400 ml-5 mt-0.5">{row.sublabel}</p>
                        )}
                      </div>

                      {/* Old regime cell */}
                      <div className={`px-4 py-2.5 w-44 border-l border-gray-100 ${cellBg(hasOld)}`}>
                        <div className="text-center">{cellValue(row.oldDed)}</div>
                        <div className="text-center mt-0.5">
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            ₹{fmt(row.oldRunning)}
                          </span>
                        </div>
                      </div>

                      {/* New regime cell */}
                      <div className={`px-4 py-2.5 w-44 border-l border-gray-100 ${cellBg(hasNew)}`}>
                        <div className="text-center">{cellValue(row.newDed)}</div>
                        <div className="text-center mt-0.5">
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            ₹{fmt(row.newRunning)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Final row */}
                <div className="grid grid-cols-[1fr_auto_auto]">
                  <div className="px-4 py-3 font-bold text-white bg-indigo-700 flex items-center gap-2">
                    <span>🎯</span> Final Taxable Income
                  </div>
                  <div className="px-4 py-3 w-44 bg-indigo-700 border-l border-indigo-600 text-center font-bold text-white text-base">
                    ₹{fmt(oldAfterOth)}
                  </div>
                  <div className="px-4 py-3 w-44 bg-indigo-700 border-l border-indigo-600 text-center font-bold text-white text-base">
                    ₹{fmt(newAfterStd)}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Results */}
        {results && (
          <>
            {/* Savings banner */}
            {saving > 0 && (
              <div className={`rounded-xl px-5 py-4 flex items-center gap-3 ${newIsBetter ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                <span className="text-2xl">{newIsBetter ? '🎉' : '💡'}</span>
                <div>
                  <p className="font-bold text-gray-800">
                    {newIsBetter ? 'New Regime saves you' : 'Old Regime saves you'}{' '}
                    <span className={newIsBetter ? 'text-green-600' : 'text-blue-600'}>₹{fmt(saving)}</span> per year
                  </p>
                  <p className="text-xs text-gray-500">
                    That&apos;s ₹{fmt(saving / 12)}/month · {((saving / results.totalGrossIncome) * 100).toFixed(2)}% of your total income
                  </p>
                </div>
              </div>
            )}

            {/* Side-by-side cards */}
            <div className="grid md:grid-cols-2 gap-5">
              <ResultCard
                regime="New Regime (FY 2025-26)"
                grossSalary={results.totalGrossIncome}
                taxableIncome={results.new.taxableIncome}
                slabTax={results.new.slabTax}
                rebate={results.new.rebate}
                surchargeAmt={results.new.surcharge}
                surchargeRate={results.new.surchargeRate}
                cess={results.new.cess}
                finalTax={results.new.finalTax}
                breakdown={results.new.breakdown}
                isRecommended={newIsBetter}
              />
              <ResultCard
                regime="Old Regime"
                grossSalary={results.totalGrossIncome}
                taxableIncome={results.old.taxableIncome}
                slabTax={results.old.slabTax}
                rebate={results.old.rebate}
                surchargeAmt={results.old.surcharge}
                surchargeRate={results.old.surchargeRate}
                cess={results.old.cess}
                finalTax={results.old.finalTax}
                breakdown={results.old.breakdown}
                isRecommended={!newIsBetter}
              />
            </div>

            {/* Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
              <p className="font-semibold mb-2">📌 Key assumptions</p>
              <p>• Age: below 60 years (resident individual)</p>
              <p>• New regime: Standard deduction ₹75,000 applied automatically; no other deductions allowed except 80CCD(2)</p>
              <p>• New regime: Full tax rebate u/s 87A if taxable income ≤ ₹12,00,000 (zero tax)</p>
              <p>• Old regime: Rebate u/s 87A up to ₹12,500 if taxable income ≤ ₹5,00,000</p>
              <p>• Employer NPS (80CCD(2)): Deductible up to 14% of basic in New Regime, 10% in Old Regime</p>
              <p>• Employer PF exempt up to ₹7,50,000 combined (Sec 17(2)(vii)). Excess is a taxable perquisite in both regimes.</p>
              <p>• Cess: 4% Health & Education Cess on (tax + surcharge)</p>
              <p>• Surcharge (Old Regime): 10% (&gt;₹50L), 15% (&gt;₹1Cr), 25% (&gt;₹2Cr), 37% (&gt;₹5Cr)</p>
              <p>• Surcharge (New Regime): Capped at 25% from Budget 2023 — 10% (&gt;₹50L), 15% (&gt;₹1Cr), 25% (&gt;₹2Cr and above)</p>
              <p>• This is an estimate. Consult a CA for precise tax filing.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
