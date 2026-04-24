'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface PluralSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

const COUNTS = [0, 1, 2, 3, 5, 11, 12, 100, 1000];

export default function PluralSection({ locale, browserLocale }: PluralSectionProps) {
  const isOverridden = locale !== browserLocale;

  const category = (n: number, loc: string) => {
    try {
      return new Intl.PluralRules(loc).select(n);
    } catch {
      return 'N/A';
    }
  };

  const ordinal = (n: number, loc: string) => {
    try {
      return new Intl.PluralRules(loc, { type: 'ordinal' }).select(n);
    } catch {
      return 'N/A';
    }
  };

  return (
    <Section
      icon="🔀"
      title="Plural Rules"
      subtitle="Intl.PluralRules — 'one/other' vs complex rules (Arabic has 6 forms!)"
    >
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cardinal (counting)</p>
        <div className="divide-y divide-gray-50">
          {COUNTS.map(n => (
            <CompareRow
              key={`card-${n}`}
              label={`n = ${n}`}
              browserValue={`${n} → ${category(n, browserLocale)}`}
              overrideValue={`${n} → ${category(n, locale)}`}
              isOverridden={isOverridden}
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ordinal (1st, 2nd, 3rd…)</p>
        <div className="divide-y divide-gray-50">
          {[1, 2, 3, 4, 11, 12, 21, 22].map(n => (
            <CompareRow
              key={`ord-${n}`}
              label={`n = ${n}`}
              browserValue={`${n} → ${ordinal(n, browserLocale)}`}
              overrideValue={`${n} → ${ordinal(n, locale)}`}
              isOverridden={isOverridden}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
