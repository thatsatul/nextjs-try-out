'use client';

import Section from './Section';
import { CompareRow } from './Row';

interface CurrencySectionProps {
  readonly locale: string;
  readonly browserLocale: string;
}

const CURRENCIES: { currency: string; label: string; amount: number }[] = [
  { currency: 'USD', label: 'US Dollar', amount: 1234.56 },
  { currency: 'EUR', label: 'Euro', amount: 1234.56 },
  { currency: 'GBP', label: 'British Pound', amount: 1234.56 },
  { currency: 'JPY', label: 'Japanese Yen', amount: 1234 },
  { currency: 'INR', label: 'Indian Rupee', amount: 1234.56 },
  { currency: 'CNY', label: 'Chinese Yuan', amount: 1234.56 },
  { currency: 'AED', label: 'UAE Dirham', amount: 1234.56 },
  { currency: 'BRL', label: 'Brazilian Real', amount: 1234.56 },
];

export default function CurrencySection({ locale, browserLocale }: CurrencySectionProps) {
  const isOverridden = locale !== browserLocale;

  const fmt = (amount: number, currency: string, loc: string) => {
    try {
      return new Intl.NumberFormat(loc, { style: 'currency', currency }).format(amount);
    } catch {
      return 'N/A';
    }
  };

  return (
    <Section
      icon="💰"
      title="Currency Formatting"
      subtitle="Intl.NumberFormat with currency style — symbol position, decimal separator"
    >
      <div className="divide-y divide-gray-50">
        {CURRENCIES.map(({ currency, label, amount }) => (
          <CompareRow
            key={currency}
            label={`${label} (${currency})`}
            browserValue={fmt(amount, currency, browserLocale)}
            overrideValue={fmt(amount, currency, locale)}
            isOverridden={isOverridden}
          />
        ))}
      </div>
    </Section>
  );
}
