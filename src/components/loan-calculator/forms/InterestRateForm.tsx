import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Rate } from '../types';
import { Percent, Plus } from 'lucide-react';
import DataTag from '../../shared/data-tag';
import TagList from '../../shared/tag-list';
import Notification from '../../shared/notification';

interface InterestRateFormProps {
  rates: Rate[];
  remainingMonths: number;
  showHighlight: boolean;
  notification: string | null;
  onAddRate: (rate: Rate) => void;
  onRemoveRate: (index: number) => void;
}

const InterestRateForm: React.FC<InterestRateFormProps> = ({
  rates,
  remainingMonths,
  showHighlight,
  notification,
  onAddRate,
  onRemoveRate,
}) => {
  const { t } = useLanguage();
  const [newRate, setNewRate] = useState<Rate>({ rate: '', period: '' });

  useEffect(() => {
    setNewRate(prev => ({ ...prev, period: '' }));
  }, [remainingMonths]);

  const handleSubmit = () => {
    if (newRate.rate && remainingMonths > 0) {
      onAddRate({
        rate: newRate.rate,
        period: newRate.period || remainingMonths.toString()
      });
      setNewRate({ rate: '', period: '' });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    if (!value) {
      setNewRate(prev => ({ ...prev, period: '' }));
      return;
    }

    if (numValue > 0) {
      const limitedValue = Math.min(numValue, remainingMonths).toString();
      setNewRate(prev => ({ ...prev, period: limitedValue }));
    }
  };

  return (
    <div className="card p-6">
      <h3 className="section-title mb-6 flex items-center gap-2">
        <Percent className="w-5 h-5 text-blue-600" />
        <span>{t('interestRates')}</span>
      </h3>

      {notification && (
        <Notification message={notification} />
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">{t('rate')}</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newRate.rate}
                onChange={(e) => setNewRate(prev => ({ ...prev, rate: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                className="input-field pl-8"
              />
              <Percent className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">{t('period')}</label>
            <input
              type="number"
              min="1"
              max={remainingMonths}
              value={newRate.period}
              onChange={handlePeriodChange}
              onKeyDown={handleKeyDown}
              placeholder={remainingMonths > 0 ? remainingMonths.toString() : "0"}
              className={`input-field ${showHighlight ? 'ring-2 ring-blue-500 border-blue-400 animate-pulse' : ''}`}
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleSubmit}
              className="button-primary h-[42px] w-[42px] !p-0"
              disabled={!newRate.rate || remainingMonths === 0}
              title={t('add')}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <TagList items={rates.map((rate, index) => (
          <DataTag key={index} onRemove={() => onRemoveRate(index)}>
            <Percent className="w-3.5 h-3.5 text-blue-600" />
            <span>{rate.rate}%</span>
            <span className="tag-divider" />
            <span>{rate.period} {parseInt(rate.period) === 1 ? t('month') : t('months')}</span>
          </DataTag>
        ))} />

        {remainingMonths > 0 && rates.length > 0 && (
          <div className="text-sm text-blue-600">
            {remainingMonths} {remainingMonths === 1 ? t('month') : t('months')} {t('monthsLeft')}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestRateForm;