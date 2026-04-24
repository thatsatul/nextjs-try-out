'use client';

const SAMPLE_LOCALES = [
  { code: 'en-US', label: '🇺🇸 English (US)' },
  { code: 'en-GB', label: '🇬🇧 English (UK)' },
  { code: 'de-DE', label: '🇩🇪 German (Germany)' },
  { code: 'fr-FR', label: '🇫🇷 French (France)' },
  { code: 'ja-JP', label: '🇯🇵 Japanese (Japan)' },
  { code: 'ar-SA', label: '🇸🇦 Arabic (Saudi Arabia)' },
  { code: 'hi-IN', label: '🇮🇳 Hindi (India)' },
  { code: 'zh-CN', label: '🇨🇳 Chinese (Simplified)' },
  { code: 'pt-BR', label: '🇧🇷 Portuguese (Brazil)' },
  { code: 'es-MX', label: '🇲🇽 Spanish (Mexico)' },
  { code: 'it-IT', label: '🇮🇹 Italian (Italy)' },
];

interface LocaleSelectorProps {
  browserLocale: string;
  selectedLocale: string;
  onLocaleChange: (locale: string) => void;
}

export default function LocaleSelector({ browserLocale, selectedLocale, onLocaleChange }: LocaleSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-700 rounded-full p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Browser Locale</p>
            <p className="font-bold text-gray-800">{browserLocale}</p>
          </div>
        </div>

        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">Override with:</span>
          <select
            value={selectedLocale}
            onChange={(e) => onLocaleChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[220px]"
          >
            <option value={browserLocale}>↩ Reset to Browser Default</option>
            {SAMPLE_LOCALES.filter(l => l.code !== browserLocale).map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLocale !== browserLocale && (
        <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm">
          <span>⚠️</span>
          <span>You are viewing with overridden locale <strong>{selectedLocale}</strong>. All sections below reflect this locale.</span>
        </div>
      )}
    </div>
  );
}
