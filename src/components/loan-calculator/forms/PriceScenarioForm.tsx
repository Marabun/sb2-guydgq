import React, { useState, KeyboardEvent } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DollarSign, Bitcoin, Plus } from 'lucide-react';
import DataTag from '../../shared/data-tag';
import TagList from '../../shared/tag-list';

interface PriceScenarioFormProps {
  prices: string[];
  onAddPrice: (price: string) => void;
  onRemovePrice: (index: number) => void;
}

const PriceScenarioForm: React.FC<PriceScenarioFormProps> = ({
  prices,
  onAddPrice,
  onRemovePrice,
}) => {
  const { t } = useLanguage();
  const [newPrice, setNewPrice] = useState('');

  const handleSubmit = () => {
    if (newPrice) {
      onAddPrice(newPrice);
      setNewPrice('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="card p-6">
      <h3 className="section-title mb-6 flex items-center gap-2">
        <Bitcoin className="w-5 h-5 text-orange-500" />
        <span>{t('btcPriceScenarios')}</span>
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1.5">{t('price')}</label>
            <div className="relative">
              <input
                type="number"
                className="input-field pl-8"
                placeholder="0.00"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                min="0"
                step="0.01"
              />
              <DollarSign className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleSubmit}
              className="button-primary h-[42px] w-[42px] !p-0"
              disabled={!newPrice}
              title={t('add')}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <TagList items={prices.map((price, index) => (
          <DataTag key={index} onRemove={() => onRemovePrice(index)}>
            <DollarSign className="w-3.5 h-3.5 text-green-600" />
            <span>{price} USDT</span>
          </DataTag>
        ))} />
      </div>
    </div>
  );
};

export default PriceScenarioForm;