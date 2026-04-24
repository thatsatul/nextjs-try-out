'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface CollationSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

const WORDS = ['banana', 'apple', 'éclair', 'äpfel', 'cherry', 'über', 'Zebra', 'mango', 'cafe', 'café'];

export default function CollationSection({ locale, browserLocale }: CollationSectionProps) {
  const isOverridden = locale !== browserLocale;

  const sorted = (loc: string) =>
    [...WORDS].sort((a, b) => a.localeCompare(b, loc)).join(', ');

  const caseInsensitive = (loc: string) =>
    [...WORDS].sort((a, b) => a.localeCompare(b, loc, { sensitivity: 'base' })).join(', ');

  return (
    <Section
      icon="🔤"
      title="String Sorting & Collation"
      subtitle="String.localeCompare — sort order differs across locales (e.g. ä, é, ü)"
    >
      <div className="divide-y divide-gray-50">
        <CompareRow
          label="Default sort"
          browserValue={sorted(browserLocale)}
          overrideValue={sorted(locale)}
          isOverridden={isOverridden}
        />
        <CompareRow
          label="Case-insensitive sort"
          browserValue={caseInsensitive(browserLocale)}
          overrideValue={caseInsensitive(locale)}
          isOverridden={isOverridden}
        />
      </div>
      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
        <strong>Input words:</strong> {WORDS.join(', ')}
      </div>
    </Section>
  );
}
