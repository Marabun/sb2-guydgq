import React from 'react';
import LoanCalculator from './components/loan-calculator';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/shared/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <LoanCalculator />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;