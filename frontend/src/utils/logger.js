import { post } from './authFetch.js';

/**
 * Logger simples que só faz console.warn para cada caso
 */
const Logger = {
  // Log de erros
  logError() {
    console.warn(`[ERRO]`);
  },
  
  // Log de geração CSV
  logCsvGeneration() {
    post('/api/log-veiculo/adicionar', {
      "acao": "geracao_csv"
    }).catch(error => {
      console.warn('[CSV] Erro ao enviar log para o backend:', error);
    });
  },
  
  // Log de geração gráfico
  logChartGeneration() {
    post('/api/log-veiculo/adicionar', {
      "acao": "geracao_grafico"
    }).catch(error => {
      console.warn('[CHART] Erro ao enviar log para o backend:', error);
    });
  },
  
  // Log de erro gráfico
  logChartError() {
    post('/api/log-veiculo/adicionar', {
      "acao": "erro_grafico"
    }).catch(error => {
      console.warn('[CHART] Erro ao enviar log para o backend:', error);
    });
  }
}

export default Logger;
