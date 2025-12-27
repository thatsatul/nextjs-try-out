# Finance Calculator - Next.js with React 19 & Internationalization

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), enhanced with React 19 and comprehensive internationalization support.

## 🌍 Internationalization (i18n)

This project includes a complete i18n setup with support for:
- **English (en)** - Default language
- **Spanish (es)**
- **French (fr)**
- **German (de)**

### Features
- ✅ Client-side translations with react-i18next
- ✅ Automatic language detection from browser/localStorage
- ✅ Language switcher component
- ✅ TypeScript support
- ✅ Fallback language support
- ✅ Comprehensive test coverage

### Quick Start with I18n
Visit `/i18n-demo` to see the internationalization features in action!

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

The application runs on port 3002: [http://localhost:3002](http://localhost:3002)

### Using Translations

In any client component:

```tsx
'use client';
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Language Switcher

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

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

The i18n setup includes comprehensive tests in `/src/components/__tests__/I18n.test.tsx`.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── i18n-demo/         # I18n demonstration page
│   └── ...
├── components/             # React components
│   ├── SimpleLanguageSwitcher.tsx
│   ├── I18nDemo.tsx
│   └── __tests__/         # Component tests
├── lib/
│   └── i18n.ts            # i18n configuration
├── providers/
│   └── I18nProvider.tsx   # i18n React provider
├── hooks/
│   └── useI18n.ts         # Custom i18n hook
└── types/
    └── i18n.ts            # TypeScript definitions

public/locales/             # Translation files (optional)
├── en/common.json
├── es/common.json
├── fr/common.json
└── de/common.json
```

## 🚀 Technologies

- **Next.js 15.4.6** with App Router
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **i18next & react-i18next** for internationalization
- **Jest & Testing Library** for testing
- **Redux Toolkit** for state management

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React i18next Documentation](https://react.i18next.com/)
- [Detailed I18n Setup Guide](./docs/i18n-setup.md)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
