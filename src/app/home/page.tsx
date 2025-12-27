'use client';

import React from 'react';
import HomeContainer from '@/containers/HomeContainer';
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('common.welcome')}</h1>
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
