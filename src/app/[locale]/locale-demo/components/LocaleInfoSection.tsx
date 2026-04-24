'use client';

import Section from './Section';
import { Row } from './Row';

interface LocaleInfoSectionProps {
  readonly locale: string;
}

export default function LocaleInfoSection({ locale }: LocaleInfoSectionProps) {
  const resolved = new Intl.Locale(locale);

  const rows: { label: string; value: string }[] = [
    { label: 'Locale tag', value: locale },
    { label: 'Language', value: resolved.language ?? 'N/A' },
    { label: 'Region', value: resolved.region ?? 'N/A' },
    { label: 'Script', value: resolved.script ?? 'Auto-detected' },
    { label: 'Calendar', value: resolved.calendar ?? 'N/A' },
    { label: 'Numbering system', value: resolved.numberingSystem ?? 'N/A' },
    { label: 'Case first', value: resolved.caseFirst ?? 'default' },
    { label: 'Collation', value: resolved.collation ?? 'default' },
    { label: 'Hour cycle', value: resolved.hourCycle ?? 'N/A' },
    { label: 'Text direction', value: ['ar', 'he', 'fa', 'ur'].includes(resolved.language) ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)' },
  ];

  // Sample text in the locale
  const sampleNumbers = [1, 2, 3, 4, 5].map(n =>
    new Intl.NumberFormat(locale).format(n)
  ).join(', ');

  return (
    <Section
      icon="🌐"
      title="Locale Metadata"
      subtitle="Intl.Locale — the parsed properties of the active locale tag"
    >
      <div className="divide-y divide-gray-50">
        {rows.map(r => <Row key={r.label} label={r.label} value={r.value} />)}
      </div>
      <div className="mt-4 bg-indigo-50 rounded-lg p-3 text-sm">
        <span className="text-indigo-600 font-medium">Native digits 1–5:</span>{' '}
        <span className="font-bold text-indigo-800">{sampleNumbers}</span>
      </div>
    </Section>
  );
}
