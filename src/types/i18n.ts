// i18next-resources-to-backend.d.ts
declare module 'i18next-resources-to-backend' {
  export default function resourcesToBackend(resources: any): any;
}

// Type definitions for our translation keys
export interface TranslationKeys {
  common: {
    welcome: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    home: string;
    about: string;
    contact: string;
    language: string;
  };
  navigation: {
    home: string;
    test: string;
    expression: string;
    timer: string;
    'infinite-scroll': string;
    'web-components': string;
  };
  finance: {
    title: string;
    tax_calculation: string;
    income: string;
    tax_rate: string;
    calculate: string;
    result: string;
  };
}

export type SupportedLanguages = 'en' | 'es' | 'fr' | 'de';
