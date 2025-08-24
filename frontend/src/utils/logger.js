import { post } from './authFetch.js';

/**
 * Logger com sistema de retry automático para logs que falharam
 * Agora suporta envio com e sem autenticação baseado no status do usuário
 */
class LoggerClass {
  constructor() {
    // Fila de logs pendentes para reenvio
    this._pendingLogs = [];
    
    // Timeout para reenvio (30 segundos)
    this._retryTimeout = 30000;
    
    // ID do timer para controle
    this._retryTimer = null;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  _isUserAuthenticated() {
    try {
      const loginData = localStorage.getItem('login');
      if (!loginData || loginData === 'undefined' || loginData === 'null') {
        return false;
      }
      
      const parsed = JSON.parse(loginData);
      return parsed?.isLoggedIn && parsed?.accessToken;
    } catch (error) {
      console.warn('[LOGGER] Erro ao verificar autenticação:', error);
      return false;
    }
  }

  /**
   * Adiciona um log à fila de pendentes para reenvio
   */
  _addToPendingQueue(endpoint, payload, logType) {
    this._pendingLogs.push({
      endpoint,
      payload,
      logType,
      timestamp: Date.now(),
      attempts: 0
    });
    
    // Inicia o timer de retry se não estiver rodando
    if (!this._retryTimer) {
      this._startRetryTimer();
    }
  }
  
  /**
   * Inicia o timer para reenvio de logs pendentes
   */
  _startRetryTimer() {
    this._retryTimer = setTimeout(() => {
      this._processRetryQueue();
    }, this._retryTimeout);
  }
  
  /**
   * Processa a fila de logs pendentes tentando reenviar
   */
  async _processRetryQueue() {
    if (this._pendingLogs.length === 0) {
      this._retryTimer = null;
      return;
    }
    
    console.warn(`[LOGGER] Tentando reenviar ${this._pendingLogs.length} logs pendentes...`);
    
    const logsToRetry = [...this._pendingLogs];
    this._pendingLogs = [];
    
    for (const logItem of logsToRetry) {
      logItem.attempts++;
      
      try {
        const requireAuth = this._isUserAuthenticated();
        console.log(`[${logItem.logType}] Reenvio ${logItem.attempts}/3 ${requireAuth ? 'COM' : 'SEM'} autenticação`);
        
        await post(logItem.endpoint, logItem.payload, {}, requireAuth);
        console.warn(`[${logItem.logType}] Log reenviado com sucesso após ${logItem.attempts} tentativa(s)`);
      } catch (error) {
        // Máximo de 3 tentativas para evitar loop infinito
        if (logItem.attempts < 3) {
          this._pendingLogs.push(logItem);
          console.warn(`[${logItem.logType}] Falha no reenvio (tentativa ${logItem.attempts}/3):`, error);
        } else {
          console.warn(`[${logItem.logType}] Log descartado após 3 tentativas falharam:`, error);
        }
      }
    }
    
    // Se ainda há logs pendentes, programa próxima tentativa
    if (this._pendingLogs.length > 0) {
      this._startRetryTimer();
    } else {
      this._retryTimer = null;
    }
  }
  
  /**
   * Método auxiliar para envio de logs com retry automático
   * Agora verifica se o usuário está autenticado e envia com ou sem auth
   */
  async _sendLog(endpoint, payload, logType) {
    try {
      const requireAuth = this._isUserAuthenticated();
      console.log(`[${logType}] Enviando log ${requireAuth ? 'COM' : 'SEM'} autenticação`);
      
      await post(endpoint, payload, {}, requireAuth);
      console.log(`[${logType}] Log enviado com sucesso`);
    } catch (error) {
      console.warn(`[${logType}] Erro ao enviar log para o backend:`, error);
      console.warn(`[${logType}] Log será reenviado em 30 segundos...`);
      
      // Adiciona à fila de pendentes
      this._addToPendingQueue(endpoint, payload, logType);
    }
  }
  
  // Log de erros
  logError(descricaoErro = 'Erro não especificado') {
    this._sendLog('/api/log-erro/adicionar', descricaoErro, 'ERRO');
    console.warn(`[ERRO] ${descricaoErro}`);
  }

  // Log de geração CSV
  logCsvGeneration() {
    this._sendLog('/api/log/adicionar', {
      "acao": "geracao_csv"
    }, 'CSV');
    console.warn('[CSV] Log de geração CSV enviado');
  }

  // Log de geração gráfico
  logChartGeneration() {
    this._sendLog('/api/log/adicionar', {
      "acao": "geracao_grafico"
    }, 'CHART');
    console.warn('[CHART] Log de geração gráfico enviado');
  }

  // Log de erro gráfico
  logChartError() {
    this._sendLog('/api/log/adicionar', {
      "acao": "erro_grafico"
    }, 'CHART');
    console.warn('[CHART] Log de erro geração gráfico enviado');
  }
  
  /**
   * Método para limpar logs pendentes (útil para testes ou cleanup)
   */
  clearPendingLogs() {
    this._pendingLogs = [];
    if (this._retryTimer) {
      clearTimeout(this._retryTimer);
      this._retryTimer = null;
    }
    console.warn('[LOGGER] Fila de logs pendentes limpa');
  }
  
  /**
   * Retorna informações sobre logs pendentes
   */
  getPendingLogsInfo() {
    return {
      count: this._pendingLogs.length,
      logs: this._pendingLogs.map(log => ({
        logType: log.logType,
        attempts: log.attempts,
        timestamp: new Date(log.timestamp).toLocaleString()
      }))
    };
  }
}

// Create singleton instance
const Logger = new LoggerClass();

export default Logger;
