# Internationalization (i18n) Setup

This project uses React i18next for internationalization with React 19 and Next.js 15.

## Features

- ✅ Support for 4 languages: English (en), Spanish (es), French (fr), German (de)
- ✅ Language switcher component
- ✅ Client-side translations with React i18next
- ✅ Next.js i18n routing configuration
- ✅ TypeScript support
- ✅ Fallback language support

## Usage

### Using translations in components

```tsx
'use client';

import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('finance.title')}</p>
    </div>
  );
}
```

### Using the custom hook

```tsx
import { useI18n } from '@/hooks/useI18n';

function MyComponent() {
  const { t, changeLanguage, getCurrentLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => changeLanguage('es')}>
        Switch to Spanish
      </button>
      <p>Current language: {getCurrentLanguage()}</p>
    </div>
  );
}
```

### Language Switcher

Import and use the language switcher component:

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

## Translation Files

Translation files are organized in the following structure:

```
public/locales/
├── en/common.json
├── es/common.json
├── fr/common.json
└── de/common.json
```

Each translation file contains three main sections:
- `common`: Common UI elements (buttons, labels, etc.)
- `navigation`: Navigation and menu items
- `finance`: Finance-specific terminology

## Configuration

### Next.js Configuration (next.config.ts)

```typescript
const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'es', 'fr', 'de'],
    defaultLocale: 'en',
  },
  // ... other config
};
```

### i18n Configuration (src/lib/i18n.ts)

The main i18n configuration is in `src/lib/i18n.ts` which sets up:
- Supported languages
- Translation resources
- Fallback language
- React suspense configuration

## Adding New Languages

1. Add the language code to `locales` array in `next.config.ts`
2. Create a new translation file in `public/locales/{lang}/common.json`
3. Add the language to the `languages` array in `SimpleLanguageSwitcher.tsx`
4. Update the inline translations in `src/lib/i18n.ts`

## Adding New Translation Keys

1. Add the new keys to all language files in `public/locales/`
2. Update the inline translations in `src/lib/i18n.ts`
3. Optionally update the TypeScript types in `src/types/i18n.ts`

## Best Practices

1. Always use translation keys instead of hardcoded strings
2. Use the `useTranslation` hook in client components
3. Organize translation keys logically (common, navigation, domain-specific)
4. Use descriptive key names that indicate the context
5. Provide fallback content for missing translations

## Testing Translations

To test different languages:
1. Use the language switcher in the UI
2. Or change the language programmatically:

```tsx
import { useI18n } from '@/hooks/useI18n';

// In your component
const { changeLanguage } = useI18n();
changeLanguage('es'); // Switch to Spanish
```
