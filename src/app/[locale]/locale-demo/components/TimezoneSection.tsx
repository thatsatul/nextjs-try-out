'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface TimezoneSectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

const TIMEZONES = [
  { tz: 'America/New_York', label: 'New York' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles' },
  { tz: 'Europe/London', label: 'London' },
  { tz: 'Europe/Paris', label: 'Paris' },
  { tz: 'Asia/Kolkata', label: 'India (IST)' },
  { tz: 'Asia/Tokyo', label: 'Tokyo' },
  { tz: 'Asia/Dubai', label: 'Dubai' },
  { tz: 'Australia/Sydney', label: 'Sydney' },
  { tz: 'Pacific/Auckland', label: 'Auckland' },
];

const NOW = new Date('2026-04-16T14:30:00Z');

export default function TimezoneSection({ locale, browserLocale }: TimezoneSectionProps) {
  const isOverridden = locale !== browserLocale;

  const fmt = (tz: string, loc: string) =>
    new Intl.DateTimeFormat(loc, {
      timeZone: tz,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(NOW);

  const tzName = (tz: string, loc: string) => {
    try {
      return new Intl.DateTimeFormat(loc, { timeZone: tz, timeZoneName: 'long' })
        .formatToParts(NOW)
        .find(p => p.type === 'timeZoneName')?.value ?? tz;
    } catch {
      return tz;
    }
  };

  return (
    <Section
      icon="🕐"
      title="Timezone Display"
      subtitle="Same UTC instant rendered across timezones — names vary by locale"
    >
      <p className="text-xs text-gray-400 mb-3">UTC reference: {NOW.toUTCString()}</p>
      <div className="divide-y divide-gray-50">
        {TIMEZONES.map(({ tz, label }) => (
          <CompareRow
            key={tz}
            label={`${label} — ${tzName(tz, locale)}`}
            browserValue={fmt(tz, browserLocale)}
            overrideValue={fmt(tz, locale)}
            isOverridden={isOverridden}
          />
        ))}
      </div>
    </Section>
  );
}
