// Exemplo super simples de como usar o logger

import { useLogger } from '../hooks/useLogger.js';
import Logger from '../utils/logger.js';

// Uso direto (sem React)
Logger.logError('Algo deu errado');
Logger.logCsvGeneration('Gerando relatório de eventos');
Logger.logChartGeneration('Criando gráfico de adequação');
Logger.logChartError('Falha ao renderizar gráfico');

// Uso em componente React
function MeuComponente() {
  const { logError, logCsv, logChart, logChartError } = useLogger();
  
  const handleError = () => {
    logError();
  };
  
  const handleCsv = () => {
    logCsv();
  };
  
  const handleChart = () => {
    logChart();
  };
  
  const handleChartError = () => {
    logChartError();
  };
  
  return (
    <div>
      <button onClick={handleError}>Log Erro</button>
      <button onClick={handleCsv}>Log CSV</button>
      <button onClick={handleChart}>Log Gráfico</button>
      <button onClick={handleChartError}>Log Erro Gráfico</button>
    </div>
  );
}
