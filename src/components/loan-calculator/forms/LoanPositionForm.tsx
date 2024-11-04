import React, { useState, KeyboardEvent } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Position } from '../types';
import { DollarSign, Bitcoin, Plus } from 'lucide-react';
import DataTag from '../../shared/data-tag';
import TagList from '../../shared/tag-list';

interface LoanPositionFormProps {
  positions: Position[];
  onAddPosition: (position: Position) => void;
  onRemovePosition: (index: number) => void;
}

const LoanPositionForm: React.FC<LoanPositionFormProps> = ({
  positions,
  onAddPosition,
  onRemovePosition,
}) => {
  const { t } = useLanguage();
  const [newPosition, setNewPosition] = useState<Position>({ principal: '', collateral: '' });

  const handleSubmit = () => {
    if (newPosition.principal && newPosition.collateral) {
      onAddPosition(newPosition);
      setNewPosition({ principal: '', collateral: '' });
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
        <DollarSign className="w-5 h-5 text-green-600" />
        <span>{t('loanPositions')}</span>
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1.5">{t('principal')}</label>
            <div className="relative">
              <input
                type="number"
                className="input-field pl-8"
                placeholder="0.00"
                value={newPosition.principal}
                onChange={(e) => setNewPosition(prev => ({ ...prev, principal: e.target.value }))}
                onKeyDown={handleKeyDown}
                min="0"
                step="0.01"
              />
              <DollarSign className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1.5">{t('collateral')}</label>
            <div className="relative">
              <input
                type="number"
                className="input-field pl-8"
                placeholder="0.00000000"
                value={newPosition.collateral}
                onChange={(e) => setNewPosition(prev => ({ ...prev, collateral: e.target.value }))}
                onKeyDown={handleKeyDown}
                min="0"
                step="0.00000001"
              />
              <Bitcoin className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleSubmit}
              className="button-primary h-[42px] w-[42px] !p-0"
              disabled={!newPosition.principal || !newPosition.collateral}
              title={t('add')}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <TagList items={positions.map((position, index) => (
          <DataTag key={index} onRemove={() => onRemovePosition(index)}>
            <DollarSign className="w-3.5 h-3.5 text-green-600" />
            <span>{position.principal} USDT</span>
            <span className="tag-divider" />
            <Bitcoin className="w-3.5 h-3.5 text-orange-500" />
            <span>{position.collateral} BTC</span>
          </DataTag>
        ))} />
      </div>
    </div>
  );
};

export default LoanPositionForm;