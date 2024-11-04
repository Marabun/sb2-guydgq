import { useCallback } from 'react';
import { logger } from '../utils/logger';

export const useLogger = (component: string) => {
  const logInfo = useCallback((action: string, data?: Record<string, unknown>) => {
    logger.info(`[${component}] ${action}`, data);
  }, [component]);

  const logWarning = useCallback((action: string, data?: Record<string, unknown>) => {
    logger.warn(`[${component}] ${action}`, data);
  }, [component]);

  const logError = useCallback((action: string, data?: Record<string, unknown>) => {
    logger.error(`[${component}] ${action}`, data);
  }, [component]);

  const logDebug = useCallback((action: string, data?: Record<string, unknown>) => {
    logger.debug(`[${component}] ${action}`, data);
  }, [component]);

  return {
    logInfo,
    logWarning,
    logError,
    logDebug
  };
};