import React from 'react';
import { Percent } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RateInputProps {
  id: number;
  rate: string;
  period: string;
  onRateChange: (id: number, value: string) => void;
  onPeriodChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  showRemove: boolean;
  remainingMonths: number;
  highlight?: boolean;
  rateOnly?: boolean;
  periodOnly?: boolean;
}

const RateInput: React.FC<RateInputProps> = ({
  id,
  rate,
  period,
  onRateChange,
  onPeriodChange,
  onRemove,
  showRemove,
  remainingMonths,
  highlight,
  rateOnly,
  periodOnly
}) => {
  const { t } = useLanguage();

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    if (!value) {
      onPeriodChange(id, '');
      return;
    }

    if (numValue > 0) {
      const limitedValue = Math.min(numValue, remainingMonths).toString();
      onPeriodChange(id, limitedValue);
    }
  };

  if (rateOnly) {
    return (
      <input
        type="number"
        step="0.01"
        min="0"
        value={rate}
        onChange={(e) => onRateChange(id, e.target.value)}
        placeholder={t('rate')}
        className="input-field"
      />
    );
  }

  if (periodOnly) {
    return (
      <input
        type="number"
        min="1"
        max={remainingMonths}
        value={period}
        onChange={handlePeriodChange}
        placeholder={remainingMonths > 0 ? remainingMonths.toString() : "0"}
        className={`input-field w-full ${highlight ? 'border-blue-300 ring-2 ring-blue-100' : ''}`}
      />
    );
  }

  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={rate}
          onChange={(e) => onRateChange(id, e.target.value)}
          placeholder={t('rate')}
          className="input-field pl-8"
        />
        <Percent className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex-1">
        <input
          type="number"
          min="1"
          max={remainingMonths}
          value={period}
          onChange={handlePeriodChange}
          placeholder={remainingMonths > 0 ? remainingMonths.toString() : "0"}
          className={`input-field ${highlight ? 'border-blue-300 ring-2 ring-blue-100' : ''}`}
        />
      </div>
      <button
        onClick={() => onRemove(id)}
        className={`text-gray-400 hover:text-red-500 transition-colors ${!showRemove ? 'invisible' : ''}`}
        aria-label="Remove rate"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
    </div>
  );
};

export default RateInput;