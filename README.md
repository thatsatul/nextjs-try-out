# Finance Calculator - Next.js with React 19 & Internationalization

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), enhanced with React 19 and comprehensive internationalization support.

## 🌍 Internationalization (i18n) with URL Routing

This project includes a complete i18n setup with URL-based language routing:
- **English (en)** - `/en` - Default language
- **Spanish (es)** - `/es`
- **French (fr)** - `/fr`  
- **German (de)** - `/de`

### Features
- ✅ URL-based language routing (`/en/home`, `/es/test`, etc.)
- ✅ Automatic language detection and redirection
- ✅ Language switcher component with URL navigation
- ✅ Client-side translations with react-i18next
- ✅ Middleware-based locale handling
- ✅ TypeScript support with type-safe utilities
- ✅ Comprehensive test coverage

### Quick Start with I18n
- Root URL: `http://localhost:3002/` → Redirects to your preferred language
- English: `http://localhost:3002/en`
- Spanish: `http://localhost:3002/es`  
- I18n Demo: `http://localhost:3002/en/i18n-demo`

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

The application runs on port 3002: [http://localhost:3002](http://localhost:3002)

### Using Translations with URL Routing

In any client page component:

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
│   ├── [locale]/          # Dynamic locale routes
│   │   ├── layout.tsx     # Locale-specific layout  
│   │   ├── page.tsx       # Homepage with locale param
│   │   ├── home/          # Locale-aware pages
│   │   ├── test/
│   │   └── i18n-demo/
│   ├── layout.tsx         # Root layout with I18nProvider
│   └── page.tsx           # Root redirect page
├── middleware.ts          # Locale detection & redirection
├── components/            # React components
│   ├── SimpleLanguageSwitcher.tsx  # URL-aware language switcher
│   ├── I18nDemo.tsx
│   └── __tests__/         # Component tests
├── utils/
│   ├── locale.ts          # Type-safe locale utilities
│   └── __tests__/
│       └── locale.test.ts # Locale utilities tests
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
