'use client';

import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notFound } from 'next/navigation';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

const locales = new Set(['en', 'es', 'fr', 'de']);

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;
  const { i18n } = useTranslation();

  // Validate locale
  if (!locales.has(locale)) {
    notFound();
  }

  // Change language when locale changes
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <div className="locale-wrapper" data-locale={locale}>
      {children}
    </div>
  );
}
