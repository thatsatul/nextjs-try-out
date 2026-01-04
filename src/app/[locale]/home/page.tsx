'use client';

import React from 'react';
import HomeContainer from '@/containers/HomeContainer';
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HomePageProps {
    params: { locale: string };
}

const HomePage: React.FC<HomePageProps> = ({ params }) => {
    const { t } = useTranslation();
    const { locale } = params;

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t('common.welcome')}</h1>
                    <p className="text-sm text-gray-500 mt-1">Locale: {locale}</p>
                </div>
                <SimpleLanguageSwitcher />
            </div>
            
            <div className="mb-8">
                <h2 className="text-xl mb-4">{t('navigation.home')}</h2>
                <p className="text-gray-600">{t('finance.title')}</p>
            </div>
            
            <HomeContainer />
        </div>
    );
};

export default HomePage;
