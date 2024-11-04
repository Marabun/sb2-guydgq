import { FormErrors } from '../types';

export const validateForm = (values: Record<string, any>): boolean => {
  const errors: FormErrors = {};

  if (values.rate !== undefined) {
    const rate = parseFloat(values.rate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      errors.rate = 'Invalid rate';
      return false;
    }
  }

  if (values.period !== undefined) {
    const period = parseInt(values.period);
    if (isNaN(period) || period < 1) {
      errors.period = 'Invalid period';
      return false;
    }
  }

  if (values.principal !== undefined) {
    const principal = parseFloat(values.principal);
    if (isNaN(principal) || principal <= 0) {
      errors.principal = 'Invalid principal';
      return false;
    }
  }

  if (values.collateral !== undefined) {
    const collateral = parseFloat(values.collateral);
    if (isNaN(collateral) || collateral <= 0) {
      errors.collateral = 'Invalid collateral';
      return false;
    }
  }

  if (values.price !== undefined) {
    const price = parseFloat(values.price);
    if (isNaN(price) || price <= 0) {
      errors.price = 'Invalid price';
      return false;
    }
  }

  return Object.keys(errors).length === 0;
};