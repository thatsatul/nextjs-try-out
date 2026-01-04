export const locales = ['en', 'es', 'fr', 'de'] as const;
export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  return isValidLocale(potentialLocale) ? potentialLocale : null;
}

export function getPreferredLocale(acceptLanguage?: string): Locale {
  // Try to get from Accept-Language header
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());
    
    for (const language of languages) {
      // Check exact match
      if (isValidLocale(language)) {
        return language;
      }
      // Check language code only (e.g., 'en' from 'en-US')
      const langCode = language.split('-')[0];
      if (isValidLocale(langCode)) {
        return langCode;
      }
    }
  }

  return defaultLocale;
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (locale) {
    return pathname.slice(`/${locale}`.length) || '/';
  }
  return pathname;
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const strippedPath = stripLocaleFromPathname(pathname);
  return `/${locale}${strippedPath === '/' ? '' : strippedPath}`;
}
