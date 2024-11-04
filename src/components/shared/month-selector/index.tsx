import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface MonthSelectorProps {
  value: number;
  onChange: (value: number) => void;
  initialMaxMonths?: number;
  monthsPerYear?: number;
  variant?: 'default' | 'minimal';
  onOpenChange?: (isOpen: boolean) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  value,
  onChange,
  initialMaxMonths = 24,
  monthsPerYear = 12,
  variant = 'default',
  onOpenChange
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [displayedYears, setDisplayedYears] = useState<number>(2);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: Math.max(16, rect.left + window.scrollX - 100), // Wider dropdown
          width: Math.min(window.innerWidth - 32, 480) // Max width with padding
        });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
      updateDropdownPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: Math.max(16, rect.left + window.scrollX - 100),
        width: Math.min(window.innerWidth - 32, 480)
      });
    }
    setIsOpen(!isOpen);
  };

  const handleShowMore = () => {
    setDisplayedYears(prev => prev === 2 ? 4 : 2);
  };

  const renderYearGroup = (yearIndex: number) => {
    const startMonth = yearIndex * monthsPerYear + 1;
    const months = Array.from({ length: monthsPerYear }, (_, i) => startMonth + i);

    return (
      <div key={yearIndex} className="space-y-3">
        <div className="px-2 py-1.5 bg-gray-50/80 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600">
            {t('year')} {yearIndex + 1}
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {months.map(month => (
            <motion.button
              key={`month-${month}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onChange(month);
                setIsOpen(false);
              }}
              className={`relative overflow-hidden rounded-lg h-10 font-medium transition-colors duration-200
                ${month === value 
                  ? 'text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span className="relative z-10">{month}</span>
              {month === value && (
                <motion.div
                  layoutId="selected-month-highlight"
                  className="absolute inset-0 bg-blue-100/80 backdrop-blur-sm"
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-40">
        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/5 backdrop-blur-[2px]"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                key="dropdown"
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="fixed z-50 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-xl shadow-lg"
                style={{
                  top: `${dropdownPosition.top + 8}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                  maxHeight: '80vh',
                  overflow: 'auto'
                }}
              >
                <div className="p-4 space-y-4">
                  {Array.from({ length: displayedYears }, (_, i) => renderYearGroup(i))}
                  
                  <motion.button
                    key="show-more-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShowMore}
                    className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-medium text-blue-600 
                             hover:text-blue-700 hover:bg-blue-50/80 transition-colors duration-200
                             flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {displayedYears === 2 ? t('showMore') : t('showLess')}
                    </span>
                    <motion.div
                      animate={{ rotate: displayedYears > 2 ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={toggleDropdown}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={
          variant === 'minimal'
            ? `flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium
               hover:bg-gray-100/80 active:bg-gray-200/80 transition-colors duration-200
               ${isOpen ? 'bg-gray-100/80' : ''}`
            : `w-full px-4 py-2.5 text-left bg-white/90 backdrop-blur-xl border border-gray-200/80 
               rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 
               flex justify-between items-center transition-all duration-200 
               hover:bg-white hover:shadow-sm
               ${isOpen ? 'bg-white shadow-sm' : ''}`
        }
      >
        <span className={variant === 'minimal' ? 'font-medium' : ''}>
          {value} {value === 1 ? t('month') : t('months')}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
      {renderDropdown()}
    </div>
  );
};

export default MonthSelector;