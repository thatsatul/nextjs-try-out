'use client';

import { useState, useEffect } from 'react';
import LocaleSelector from './components/LocaleSelector';
import LocaleInfoSection from './components/LocaleInfoSection';
import DateTimeSection from './components/DateTimeSection';
import NumberSection from './components/NumberSection';
import CurrencySection from './components/CurrencySection';
import TimezoneSection from './components/TimezoneSection';
import RelativeTimeSection from './components/RelativeTimeSection';
import CollationSection from './components/CollationSection';
import ListSection from './components/ListSection';
import PluralSection from './components/PluralSection';

export default function LocaleDemoPage() {
  const [browserLocale, setBrowserLocale] = useState('en-US');
  const [selectedLocale, setSelectedLocale] = useState('en-US');

  useEffect(() => {
    const detected = navigator.language || 'en-US';
    setBrowserLocale(detected);
    setSelectedLocale(detected);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">🌍 Browser Locale Explorer</h1>
          <p className="text-gray-500 mt-2 text-sm">
            See how formatting changes based on browser locale.
            Override it below to compare differences.
          </p>
        </div>

        {/* Locale Selector — always sticky at top */}
        <div className="sticky top-4 z-10">
          <LocaleSelector
            browserLocale={browserLocale}
            selectedLocale={selectedLocale}
            onLocaleChange={setSelectedLocale}
          />
        </div>

        {/* Jump-to nav */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Sections</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['#locale-info', '🌐 Locale Info'],
              ['#datetime', '📅 Date & Time'],
              ['#numbers', '🔢 Numbers'],
              ['#currency', '💰 Currency'],
              ['#timezone', '🕐 Timezones'],
              ['#relative', '⏱️ Relative Time'],
              ['#collation', '🔤 Sorting'],
              ['#list', '📋 Lists'],
              ['#plural', '🔀 Plural Rules'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div id="locale-info"><LocaleInfoSection locale={selectedLocale} /></div>
        <div id="datetime"><DateTimeSection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="numbers"><NumberSection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="currency"><CurrencySection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="timezone"><TimezoneSection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="relative"><RelativeTimeSection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="collation"><CollationSection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="list"><ListSection locale={selectedLocale} browserLocale={browserLocale} /></div>
        <div id="plural"><PluralSection locale={selectedLocale} browserLocale={browserLocale} /></div>
      </div>
    </div>
  );
}
