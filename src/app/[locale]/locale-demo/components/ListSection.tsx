'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface ListSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

const ITEMS_SHORT = ['Alice', 'Bob', 'Carol'];
const ITEMS_LONG = ['Apples', 'Bananas', 'Cherries', 'Dates', 'Elderberries'];

export default function ListSection({ locale, browserLocale }: ListSectionProps) {
  const isOverridden = locale !== browserLocale;

  const fmt = (items: string[], type: Intl.ListFormatType, style: Intl.ListFormatStyle, loc: string) => {
    try {
      return new Intl.ListFormat(loc, { type, style }).format(items);
    } catch {
      return 'N/A';
    }
  };

  const rows: { label: string; items: string[]; type: Intl.ListFormatType; style: Intl.ListFormatStyle }[] = [
    { label: '3 items — conjunction (long)', items: ITEMS_SHORT, type: 'conjunction', style: 'long' },
    { label: '3 items — conjunction (short)', items: ITEMS_SHORT, type: 'conjunction', style: 'short' },
    { label: '3 items — disjunction', items: ITEMS_SHORT, type: 'disjunction', style: 'long' },
    { label: '5 items — conjunction', items: ITEMS_LONG, type: 'conjunction', style: 'long' },
    { label: '5 items — unit (narrow)', items: ITEMS_LONG, type: 'unit', style: 'narrow' },
  ];

  return (
    <Section
      icon="📋"
      title="List Formatting"
      subtitle="Intl.ListFormat — 'and' / 'or' connectors vary by locale"
    >
      <div className="divide-y divide-gray-50">
        {rows.map(({ label, items, type, style }) => (
          <CompareRow
            key={label}
            label={label}
            browserValue={fmt(items, type, style, browserLocale)}
            overrideValue={fmt(items, type, style, locale)}
            isOverridden={isOverridden}
          />
        ))}
      </div>
    </Section>
  );
}
