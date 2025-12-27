import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import I18nProvider from '@/providers/I18nProvider';
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher';
import { useTranslation } from 'react-i18next';

// Mock component that uses translations
const TestComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1 data-testid="welcome">{t('common.welcome')}</h1>
      <p data-testid="finance-title">{t('finance.title')}</p>
      <SimpleLanguageSwitcher />
    </div>
  );
};

describe('I18n Setup', () => {
  it('renders English translations by default', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome');
    expect(screen.getByTestId('finance-title')).toHaveTextContent('Finance Calculator');
  });

  it('renders language switcher', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    const languageSwitcher = screen.getByRole('button', { name: /english/i });
    expect(languageSwitcher).toBeInTheDocument();
  });

  it('shows language options when dropdown is opened', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    const languageSwitcher = screen.getByRole('button', { name: /english/i });
    fireEvent.click(languageSwitcher);

    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });
});
