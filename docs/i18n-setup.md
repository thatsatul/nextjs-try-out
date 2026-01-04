# Internationalization (i18n) Setup with URL-based Routing

This project uses React i18next for internationalization with React 19 and Next.js 15, featuring URL-based language routing.

## Features

- ✅ Support for 4 languages: English (en), Spanish (es), French (fr), German (de)
- ✅ URL-based language routing (`/en`, `/es/home`, `/fr/about`, etc.)
- ✅ Automatic language detection from browser/Accept-Language header
- ✅ Language switcher component with URL navigation
- ✅ Client-side translations with React i18next
- ✅ Middleware-based locale handling
- ✅ TypeScript support with type-safe locale utilities
- ✅ Fallback language support
- ✅ Comprehensive test coverage

## URL Structure

The application now uses URL-based routing for languages:

```
/ → Redirects to /{preferred-language}
/en → English homepage
/es → Spanish homepage  
/fr → French homepage
/de → German homepage

/en/home → English home page
/es/test → Spanish test page
/fr/i18n-demo → French i18n demo page
```

## How It Works

1. **Middleware Detection**: The middleware (`src/middleware.ts`) detects if a URL contains a locale
2. **Automatic Redirect**: If no locale is present, it redirects to the user's preferred language
3. **Language Preference**: Determined by Accept-Language header or defaults to English
4. **Layout Sync**: The `[locale]` layout syncs the URL locale with i18next

## Usage

### Using translations in components

```tsx
'use client';

import { useTranslation } from 'react-i18next';

interface PageProps {
  params: { locale: string };
}

function MyPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { locale } = params;
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Language Switcher with URL Navigation

The language switcher now automatically updates the URL:

```tsx
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher';

function Header() {
  return (
    <header>
      <SimpleLanguageSwitcher />
    </header>
  );
}
```

### Creating Locale-aware Links

```tsx
import Link from 'next/link';

interface Props {
  locale: string;
}

function Navigation({ locale }: Props) {
  return (
    <nav>
      <Link href={`/${locale}/home`}>Home</Link>
      <Link href={`/${locale}/about`}>About</Link>
    </nav>
  );
}
```

## File Structure

```
src/
├── app/
│   ├── [locale]/              # Dynamic locale routes
│   │   ├── layout.tsx         # Locale-specific layout
│   │   ├── page.tsx           # Homepage with locale param
│   │   ├── home/
│   │   │   └── page.tsx       # Home page
│   │   ├── test/
│   │   └── i18n-demo/
│   ├── layout.tsx             # Root layout with I18nProvider
│   └── page.tsx               # Root redirect page
├── middleware.ts              # Locale detection & redirection
├── utils/
│   ├── locale.ts              # Locale utility functions
│   └── __tests__/
│       └── locale.test.ts     # Locale utilities tests
├── lib/
│   └── i18n.ts                # i18n configuration
└── components/
    └── SimpleLanguageSwitcher.tsx  # Updated for URL routing

public/locales/                # Translation files (optional)
├── en/common.json
├── es/common.json
├── fr/common.json
└── de/common.json
```

## Testing URLs

You can test different language URLs directly:

- English: `http://localhost:3002/en`
- Spanish: `http://localhost:3002/es`  
- French: `http://localhost:3002/fr`
- German: `http://localhost:3002/de`

Or specific pages:
- `http://localhost:3002/es/home`
- `http://localhost:3002/fr/test`
- `http://localhost:3002/de/i18n-demo`

## Middleware Configuration

The middleware (`src/middleware.ts`) handles:

1. **API Routes**: CORS headers for API endpoints
2. **Static Files**: Bypasses locale detection for static assets
3. **Locale Detection**: Checks URL for valid locale
4. **Redirection**: Redirects to preferred language if no locale in URL
5. **Language Preference**: Uses Accept-Language header or defaults

## Locale Utilities

The `src/utils/locale.ts` file provides type-safe utilities:

```typescript
import { isValidLocale, getLocaleFromPathname, addLocaleToPathname } from '@/utils/locale';

// Check if a locale is supported
isValidLocale('es') // true
isValidLocale('jp') // false

// Extract locale from URL path
getLocaleFromPathname('/es/home') // 'es'

// Add locale to path
addLocaleToPathname('/home', 'es') // '/es/home'
```

## Adding New Languages

1. Add the language code to `locales` array in `src/utils/locale.ts`
2. Create translation files in `public/locales/{lang}/common.json`
3. Add translations to `src/lib/i18n.ts` resources
4. Add the language to `SimpleLanguageSwitcher.tsx` languages array
5. Update the `[locale]` layout validation in `src/app/[locale]/layout.tsx`

## Best Practices

1. Always include locale parameter in page props: `{ params: { locale: string } }`
2. Use the language switcher for locale changes (handles URL updates)
3. Create locale-aware navigation with proper URL structures
4. Test different language URLs directly
5. Use the locale utility functions for URL manipulation
6. Keep translation keys consistent across all languages

## SEO Benefits

URL-based routing provides several SEO advantages:

- **Language-specific URLs**: Search engines can index content per language
- **Proper hreflang support**: Can implement hreflang meta tags
- **User bookmarks**: Users can bookmark language-specific pages
- **Direct access**: Share language-specific URLs directly
