import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { HelpCircle } from 'lucide-react';
import MonthSelector from '../shared/month-selector';
import LanguageToggle from '../shared/language-toggle';
import Results from '../shared/results';
import InterestRateForm from './forms/InterestRateForm';
import LoanPositionForm from './forms/LoanPositionForm';
import PriceScenarioForm from './forms/PriceScenarioForm';
import { useLoanCalculator } from './state/useLoanCalculator';

const LoanCalculator: React.FC = () => {
  const { t } = useLanguage();
  const {
    loanDuration,
    positions,
    rates,
    prices,
    remainingMonths,
    showRateHighlight,
    adjustmentNotification,
    handleDurationChange,
    handleAddPosition,
    handleRemovePosition,
    handleAddRate,
    handleRemoveRate,
    handleAddPrice,
    handleRemovePrice
  } = useLoanCalculator();

  const canShowResults = positions.length > 0 && rates.length > 0 && remainingMonths === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-bg to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t('title')}
          </h1>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl">
              <span className="text-sm font-medium text-blue-900">{t('loanDuration')}:</span>
              <MonthSelector
                value={loanDuration}
                onChange={handleDurationChange}
                variant="minimal"
              />
            </div>
            <button className="button-secondary">
              <HelpCircle className="w-4 h-4" />
              <span>{t('help')}</span>
            </button>
            <LanguageToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <InterestRateForm
            rates={rates}
            remainingMonths={remainingMonths}
            showHighlight={showRateHighlight}
            notification={adjustmentNotification}
            onAddRate={handleAddRate}
            onRemoveRate={handleRemoveRate}
          />

          <LoanPositionForm
            positions={positions}
            onAddPosition={handleAddPosition}
            onRemovePosition={handleRemovePosition}
          />

          <PriceScenarioForm
            prices={prices}
            onAddPrice={handleAddPrice}
            onRemovePrice={handleRemovePrice}
          />
        </div>

        {canShowResults && (
          <Results
            positions={positions}
            rates={rates}
            prices={prices}
            loanDuration={loanDuration}
          />
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;