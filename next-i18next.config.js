module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
  },
  react: {
    useSuspense: false,
  },
  fallbackLng: {
    'es': ['en'],
    'fr': ['en'],
    'de': ['en'],
    'default': ['en']
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
