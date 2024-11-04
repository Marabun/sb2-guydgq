import { useState, useCallback, useEffect } from 'react';
import { useLogger } from '../../../hooks/useLogger';
import { useLanguage } from '../../../contexts/LanguageContext';
import { validateForm } from '../utils/validators';
import { Position, Rate } from '../types';

type NotificationType = 'specify' | 'adjusted' | null;

export const useLoanCalculator = () => {
  const { t } = useLanguage();
  const { logInfo, logWarning, logError } = useLogger('LoanCalculator');
  const [loanDuration, setLoanDuration] = useState(12);
  const [positions, setPositions] = useState<Position[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState<NotificationType>(null);
  const [showRateHighlight, setShowRateHighlight] = useState(false);

  const calculateRemainingMonths = useCallback(() => {
    const totalMonths = rates.reduce((sum, rate) => sum + (parseInt(rate.period) || 0), 0);
    return Math.max(0, loanDuration - totalMonths);
  }, [rates, loanDuration]);

  const remainingMonths = calculateRemainingMonths();

  const handleDurationChange = useCallback((duration: number) => {
    logInfo('Loan duration changed', { duration });
    setLoanDuration(duration);
    adjustRatePeriods(duration);
  }, []);

  const adjustRatePeriods = (duration: number) => {
    let totalPeriod = 0;
    const adjustedRates = rates.map((rate, index) => {
      const remainingDuration = duration - totalPeriod;
      if (remainingDuration <= 0) return null;
      
      const periodNum = Math.min(parseInt(rate.period) || 0, remainingDuration);
      totalPeriod += periodNum;
      
      return {
        ...rate,
        period: periodNum.toString()
      };
    }).filter((rate): rate is Rate => rate !== null);

    if (adjustedRates.length !== rates.length || totalPeriod < duration) {
      logInfo('Adjusting rate periods for new duration', { duration, adjustedRates });
      setRates(adjustedRates);
      setNotificationType('specify');
      setShowRateHighlight(true);
      setTimeout(() => {
        setNotificationType(null);
        setShowRateHighlight(false);
      }, 5000);
    } else if (adjustedRates.some((rate, i) => rate.period !== rates[i].period)) {
      setRates(adjustedRates);
      setNotificationType('adjusted');
      setTimeout(() => {
        setNotificationType(null);
      }, 5000);
    }
  };

  const getNotificationMessage = useCallback(() => {
    if (!notificationType) return null;
    return notificationType === 'specify' ? t('specifyRates') : t('adjustedRates');
  }, [notificationType, t]);

  const handleAddRate = useCallback((rate: Rate) => {
    if (validateForm(rate)) {
      const currentRemaining = calculateRemainingMonths();
      const periodNum = Math.min(parseInt(rate.period), currentRemaining);
      
      if (periodNum > 0) {
        logInfo('Adding new rate', { ...rate, period: periodNum.toString() });
        setRates(prev => [...prev, { ...rate, period: periodNum.toString() }]);
        return true;
      }
    }
    return false;
  }, [calculateRemainingMonths]);

  const handleRemoveRate = useCallback((index: number) => {
    logInfo('Removing rate', { index });
    setRates(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddPosition = useCallback((position: Position) => {
    if (validateForm(position)) {
      logInfo('Adding new position', position);
      setPositions(prev => [...prev, position]);
      return true;
    }
    return false;
  }, []);

  const handleRemovePosition = useCallback((index: number) => {
    logInfo('Removing position', { index });
    setPositions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddPrice = useCallback((price: string) => {
    if (validateForm({ price })) {
      logInfo('Adding new price', { price });
      setPrices(prev => [...prev, price]);
      return true;
    }
    return false;
  }, []);

  const handleRemovePrice = useCallback((index: number) => {
    logInfo('Removing price', { index });
    setPrices(prev => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    const remaining = calculateRemainingMonths();
    if (remaining === 0) {
      setShowRateHighlight(false);
      setNotificationType(null);
    }
  }, [rates, calculateRemainingMonths]);

  return {
    loanDuration,
    positions,
    rates,
    prices,
    remainingMonths,
    showRateHighlight,
    adjustmentNotification: getNotificationMessage(),
    handleDurationChange,
    handleAddPosition,
    handleRemovePosition,
    handleAddRate,
    handleRemoveRate,
    handleAddPrice,
    handleRemovePrice
  };
};