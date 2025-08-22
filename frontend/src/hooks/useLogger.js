import Logger from '../utils/logger.js';

/**
 * Hook React super simples para usar logs
 */
export function useLogger() {
  return {
    logError: Logger.logError,
    logCsv: Logger.logCsvGeneration, 
    logChart: Logger.logChartGeneration,
    logChartError: Logger.logChartError
  };
}
