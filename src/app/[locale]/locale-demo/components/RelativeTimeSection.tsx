'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface RelativeTimeSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

const RELATIVE_TIMES: { value: number; unit: Intl.RelativeTimeFormatUnit; label: string }[] = [
  { value: -5, unit: 'second', label: '5 seconds ago' },
  { value: -2, unit: 'minute', label: '2 minutes ago' },
  { value: -1, unit: 'hour', label: '1 hour ago' },
  { value: -3, unit: 'day', label: '3 days ago' },
  { value: -1, unit: 'week', label: '1 week ago' },
  { value: -2, unit: 'month', label: '2 months ago' },
  { value: -1, unit: 'year', label: '1 year ago' },
  { value: 30, unit: 'minute', label: 'in 30 minutes' },
  { value: 5, unit: 'day', label: 'in 5 days' },
  { value: 3, unit: 'month', label: 'in 3 months' },
];

export default function RelativeTimeSection({ locale, browserLocale }: RelativeTimeSectionProps) {
  const isOverridden = locale !== browserLocale;

  const fmt = (value: number, unit: Intl.RelativeTimeFormatUnit, loc: string) => {
    try {
      return new Intl.RelativeTimeFormat(loc, { numeric: 'auto' }).format(value, unit);
    } catch {
      return 'N/A';
    }
  };

  return (
    <Section
      icon="⏱️"
      title="Relative Time"
      subtitle="Intl.RelativeTimeFormat — 'yesterday', '3 days ago', 'in 5 minutes'"
    >
      <div className="divide-y divide-gray-50">
        {RELATIVE_TIMES.map(({ value, unit, label }) => (
          <CompareRow
            key={label}
            label={label}
            browserValue={fmt(value, unit, browserLocale)}
            overrideValue={fmt(value, unit, locale)}
            isOverridden={isOverridden}
          />
        ))}
      </div>
    </Section>
  );
}
