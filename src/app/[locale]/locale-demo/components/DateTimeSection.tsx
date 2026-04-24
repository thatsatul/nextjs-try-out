'use client';

import Section from './Section';
import { CompareRow } from './Row';

const SAMPLE_DATE = new Date('2026-04-16T14:30:00');

interface DateTimeSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

export default function DateTimeSection({ locale, browserLocale }: DateTimeSectionProps) {
  const isOverridden = locale !== browserLocale;

  const fmt = (opts: Intl.DateTimeFormatOptions, loc: string) =>
    new Intl.DateTimeFormat(loc, opts).format(SAMPLE_DATE);

  const rows: { label: string; opts: Intl.DateTimeFormatOptions }[] = [
    { label: 'Short date', opts: { dateStyle: 'short' } },
    { label: 'Medium date', opts: { dateStyle: 'medium' } },
    { label: 'Long date', opts: { dateStyle: 'long' } },
    { label: 'Full date', opts: { dateStyle: 'full' } },
    { label: 'Short time', opts: { timeStyle: 'short' } },
    { label: 'Medium time', opts: { timeStyle: 'medium' } },
    { label: 'Date + Time', opts: { dateStyle: 'medium', timeStyle: 'short' } },
    { label: 'Weekday', opts: { weekday: 'long' } },
    { label: 'Month + Year', opts: { month: 'long', year: 'numeric' } },
  ];

  return (
    <Section
      icon="📅"
      title="Date & Time Formatting"
      subtitle={`Intl.DateTimeFormat — sample: ${SAMPLE_DATE.toISOString()}`}
    >
      <div className="divide-y divide-gray-50">
        {rows.map(({ label, opts }) => (
          <CompareRow
            key={label}
            label={label}
            browserValue={fmt(opts, browserLocale)}
            overrideValue={fmt(opts, locale)}
            isOverridden={isOverridden}
          />
        ))}
      </div>
    </Section>
  );
}
