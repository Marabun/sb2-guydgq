export interface Position {
  principal: string;
  collateral: string;
}

export interface Rate {
  rate: string;
  period: string;
}

export interface FormErrors {
  rate?: string;
  period?: string;
  principal?: string;
  collateral?: string;
  price?: string;
}

export interface LoanCalculatorState {
  loanDuration: number;
  positions: Position[];
  rates: Rate[];
  prices: string[];
  newPosition: Position;
  newRate: Rate;
  newPrice: string;
  adjustmentNotification: string | null;
  errors: FormErrors;
  isMonthSelectorOpen: boolean;
  showRateHighlight: boolean;
}