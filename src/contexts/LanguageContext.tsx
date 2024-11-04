import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'uk';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    title: 'Crypto Loan Calculator',
    help: 'Help',
    howToUse: 'How to Use',
    loanPositions: 'Loan Positions',
    addPosition: 'Add Position',
    interestRates: 'Interest Rates',
    addRate: 'Add Rate',
    btcPriceScenarios: 'BTC Price Scenarios',
    addPrice: 'Add Price',
    results: 'Results',
    initialDebt: 'Initial Debt',
    totalInterest: 'Total Interest',
    monthlyInterest: 'Monthly Interest',
    finalDebt: 'Final Debt',
    effectiveRate: 'Effective Rate',
    totalCollateral: 'Total Collateral',
    priceScenarios: 'Price Scenarios',
    requiredBtc: 'Required BTC',
    remainingBtc: 'Remaining BTC',
    worth: 'Worth',
    ofCollateral: 'of collateral',
    loanDuration: 'Loan duration',
    principal: 'Principal',
    collateral: 'Collateral',
    rate: 'Rate',
    period: 'Period',
    price: 'Price',
    month: 'month',
    months: 'months',
    monthsLeft: 'left',
    showMore: 'Show more months',
    showLess: 'Show fewer months',
    showMoreMonths: 'Show months 25-48',
    backToStart: 'Back to start',
    ratesAdjusted: 'Rate periods adjusted',
    add: 'Add',
    fillRates: 'Please fill all rate periods',
    year: 'Year',
    specifyRates: 'Please specify interest rates for the entire loan duration',
    adjustedRates: 'Interest rates have been adjusted for the new loan duration'
  },
  uk: {
    title: 'Калькулятор Крипто Позик',
    help: 'Допомога',
    howToUse: 'Як користуватися',
    loanPositions: 'Позиції позики',
    addPosition: 'Додати позицію',
    interestRates: 'Процентні ставки',
    addRate: 'Додати ставку',
    btcPriceScenarios: 'Сценарії ціни BTC',
    addPrice: 'Додати ціну',
    results: 'Результати',
    initialDebt: 'Початковий борг',
    totalInterest: 'Загальні відсотки',
    monthlyInterest: 'Щомісячні відсотки',
    finalDebt: 'Кінцевий борг',
    effectiveRate: 'Ефективна ставка',
    totalCollateral: 'Загальна застава',
    priceScenarios: 'Цінові сценарії',
    requiredBtc: 'Необхідно BTC',
    remainingBtc: 'Залишок BTC',
    worth: 'Вартість',
    ofCollateral: 'від застави',
    loanDuration: 'Тривалість позики',
    principal: 'Сума',
    collateral: 'Застава',
    rate: 'Ставка',
    period: 'Період',
    price: 'Ціна',
    month: 'місяць',
    months: 'місяців',
    monthsLeft: 'залишилось',
    showMore: 'Показати більше місяців',
    showLess: 'Показати менше місяців',
    showMoreMonths: 'Місяці 25-48',
    backToStart: 'На початок',
    ratesAdjusted: 'Періоди скориговано',
    add: 'Додати',
    fillRates: 'Заповніть всі періоди',
    year: 'Рік',
    specifyRates: 'Будь ласка, вкажіть процентні ставки на весь термін позики',
    adjustedRates: 'Процентні ставки було скориговано для нової тривалості позики'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}