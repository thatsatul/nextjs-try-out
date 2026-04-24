'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface NumberSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

export default function NumberSection({ locale, browserLocale }: NumberSectionProps) {
  const isOverridden = locale !== browserLocale;

  const fmt = (value: number, opts: Intl.NumberFormatOptions, loc: string) =>
    new Intl.NumberFormat(loc, opts).format(value);

  const rows: { label: string; value: number; opts: Intl.NumberFormatOptions }[] = [
    { label: 'Integer', value: 1234567, opts: {} },
    { label: 'Decimal (2 places)', value: 1234567.89, opts: { minimumFractionDigits: 2 } },
    { label: 'Percent', value: 0.4256, opts: { style: 'percent', minimumFractionDigits: 1 } },
    { label: 'Compact (short)', value: 1500000, opts: { notation: 'compact', compactDisplay: 'short' } },
    { label: 'Compact (long)', value: 1500000, opts: { notation: 'compact', compactDisplay: 'long' } },
    { label: 'Scientific', value: 123456789, opts: { notation: 'scientific' } },
    { label: 'Unit (km/h)', value: 120, opts: { style: 'unit', unit: 'kilometer-per-hour' } },
    { label: 'Unit (Celsius)', value: 36.6, opts: { style: 'unit', unit: 'celsius' } },
    { label: 'Unit (Liter)', value: 2.5, opts: { style: 'unit', unit: 'liter', unitDisplay: 'long' } },
  ];

  return (
    <Section
      icon="🔢"
      title="Number Formatting"
      subtitle="Intl.NumberFormat — decimal separators, grouping, notation"
    >
      <div className="divide-y divide-gray-50">
        {rows.map(({ label, value, opts }) => (
          <CompareRow
            key={label}
            label={label}
            browserValue={fmt(value, opts, browserLocale)}
            overrideValue={fmt(value, opts, locale)}
            isOverridden={isOverridden}
          />
        ))}
      </div>
    </Section>
  );
}
