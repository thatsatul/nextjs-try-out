'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher';
import { useI18n } from '@/hooks/useI18n';

const I18nDemo = () => {
  const { t } = useTranslation();
  const { getCurrentLanguage } = useI18n();

  const navigationItems = [
    { key: 'navigation.home', href: '/home' },
    { key: 'navigation.test', href: '/test' },
    { key: 'navigation.expression', href: '/expression' },
    { key: 'navigation.timer', href: '/timer' },
    { key: 'navigation.infinite-scroll', href: '/infinite-scroll' },
    { key: 'navigation.web-components', href: '/web-components' },
  ];

  const commonActions = [
    'common.save',
    'common.edit',
    'common.delete',
    'common.add',
    'common.search',
    'common.filter',
    'common.cancel',
  ];

  const financeTerms = [
    'finance.title',
    'finance.tax_calculation',
    'finance.income',
    'finance.tax_rate',
    'finance.calculate',
    'finance.result',
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('common.welcome')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Current Language: <span className="font-semibold">{getCurrentLanguage()}</span>
          </p>
        </div>
        <SimpleLanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Navigation Items
          </h2>
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Actions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Common Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {commonActions.map((action) => (
              <button
                key={action}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                {t(action)}
              </button>
            ))}
          </div>
        </div>

        {/* Finance Terms Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Finance Terms
          </h2>
          <ul className="space-y-2">
            {financeTerms.map((term) => (
              <li key={term} className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{term.split('.')[1]}:</span> {t(term)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Interactive Demo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Status Messages
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">{t('common.success')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">{t('common.error')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Contact Information
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('common.home')}:</span> /home
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('common.about')}:</span> /about
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('common.contact')}:</span> /contact
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          How to Use I18n in Your Components
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4">
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
            <code>{`import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default I18nDemo;
