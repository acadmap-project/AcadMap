import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import HeaderSistema from '../components/HeaderSistema';
import ErrorPopup from '../components/ErrorPopup';
import useLogin from '../hooks/userAuth';
import { get } from '../utils/authFetch';
import Logger from '../utils/logger';

const formatarAcao = acao => {
  const mapeamento = {
    adicao_veiculo: 'Cadastro',
    atualizacao_veiculo: 'Atualização',
    cadastro_veiculo_aceito: 'Aprovação',
    cadastro_veiculo_recusado: 'Rejeição',
    geracao_csv: 'Geração CSV',
    geracao_grafico: 'Geração Gráfico',
    erro_grafico: 'Erro Gráfico',
    erro_requisicao: 'Erro Requisição',
  };
  return mapeamento[acao] || acao;
};

const formatarStatus = status => {
  const mapeamento = {
    pendente: 'Pendente',
    aceito: 'Aprovado',
    negado: 'Negado',
  };
  return mapeamento[status] || status;
};

const formatarData = timestamp => {
  if (!timestamp) return 'N/A';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
};

const filtrarLogsPorData = (logs, dataInicio, dataFim) => {
  if (!logs) return [];
  if (!dataInicio && !dataFim) return logs;
  return logs.filter(log => {
    const dataLog = new Date(log.timestamp);
    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;
    if (inicio && fim) {
      return dataLog >= inicio && dataLog <= fim;
    } else if (inicio) {
      return dataLog >= inicio;
    } else if (fim) {
      return dataLog <= fim;
    }
    return true;
  });
};

function AuditoriaLogs() {
  const { loggedIn } = useLogin();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [tipoLog, setTipoLog] = useState('veiculos'); // 'atividades', 'erros' ou 'veiculos'
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });

  // Query para logs de atividades (CSV e gráficos)
  const { data: logsAtividades, isLoading: loadingAtividades } = useQuery({
    queryKey: ['logs-atividades'],
    queryFn: async () => {
      try {
        const response = await get('/api/log/historico');

        if (!response.ok) {
          if (response.status === 405) {
            setErrorInfo({
              title: 'Acesso Negado',
              message: 'Usuário não possui acesso ao histórico de atividades',
              type: 'error',
            });
            setShowErrorPopup(true);
            throw new Error('Usuário não possui acesso ao histórico');
          }
          if (response.status === 500) {
            setErrorInfo({
              title: 'Erro no Servidor',
              message:
                'Não foi possível acessar os Logs de Atividades. Tente novamente mais tarde.',
              type: 'error',
            });
            setShowErrorPopup(true);
            throw new Error('Erro interno do servidor');
          }
          setErrorInfo({
            title: 'Erro ao Carregar',
            message:
              'Não foi possível acessar os Logs de Atividades. Tente novamente mais tarde.',
            type: 'error',
          });
          setShowErrorPopup(true);
          throw new Error('Erro ao carregar logs de atividades');
        }

        return response.json();
      } catch (error) {
        console.error('Erro na requisição de logs de atividades:', error);
        Logger.logError(
          `Erro ao carregar logs de atividades: ${error.message}`
        );
        if (!showErrorPopup) {
          setErrorInfo({
            title: 'Erro de Conexão',
            message:
              'Não foi possível acessar os Logs de Atividades. Tente novamente mais tarde.',
            type: 'error',
          });
          setShowErrorPopup(true);
        }
        throw error;
      }
    },
    enabled: tipoLog === 'atividades',
  });

  // Query para logs de erro
  const { data: logsErros, isLoading: loadingErros } = useQuery({
    queryKey: ['logs-erros'],
    queryFn: async () => {
      try {
        const response = await get('/api/log-erro/historico');

        if (!response.ok) {
          if (response.status === 405) {
            setErrorInfo({
              title: 'Acesso Negado',
              message: 'Usuário não possui acesso ao histórico de erros',
              type: 'error',
            });
            setShowErrorPopup(true);
            throw new Error('Usuário não possui acesso ao histórico');
          }
          if (response.status === 500) {
            setErrorInfo({
              title: 'Erro no Servidor',
              message:
                'Não foi possível acessar os Logs de Erro. Tente novamente mais tarde.',
              type: 'error',
            });
            setShowErrorPopup(true);
            throw new Error('Erro interno do servidor');
          }
          setErrorInfo({
            title: 'Erro ao Carregar',
            message:
              'Não foi possível acessar os Logs de Erro. Tente novamente mais tarde.',
            type: 'error',
          });
          setShowErrorPopup(true);
          throw new Error('Erro ao carregar logs de erro');
        }

        return response.json();
      } catch (error) {
        console.error('Erro na requisição de logs de erro:', error);
        Logger.logError(`Erro ao carregar logs de erro: ${error.message}`);
        if (!showErrorPopup) {
          setErrorInfo({
            title: 'Erro de Conexão',
            message:
              'Não foi possível acessar os Logs de Erro. Tente novamente mais tarde.',
            type: 'error',
          });
          setShowErrorPopup(true);
        }
        throw error;
      }
    },
    enabled: tipoLog === 'erros',
  });

  // Query para logs de veículos (auditoria de veículos)
  const { data: logsVeiculos, isLoading: loadingVeiculos } = useQuery({
    queryKey: ['logs-veiculos'],
    queryFn: async () => {
      try {
        const response = await get('/api/log-veiculo/historico');

        if (!response.ok) {
          if (response.status === 405) {
            setErrorInfo({
              title: 'Acesso Negado',
              message:
                'Usuário não possui acesso ao histórico de auditoria de veículos',
              type: 'error',
            });
            setShowErrorPopup(true);
            throw new Error('Usuário não possui acesso ao histórico');
          }
          if (response.status === 500) {
            setErrorInfo({
              title: 'Erro no Servidor',
              message:
                'Não foi possível acessar os Logs de Auditoria de Veículos. Tente novamente mais tarde.',
              type: 'error',
            });
            setShowErrorPopup(true);
            throw new Error('Erro interno do servidor');
          }
          setErrorInfo({
            title: 'Erro ao Carregar',
            message:
              'Não foi possível acessar os Logs de Auditoria de Veículos. Tente novamente mais tarde.',
            type: 'error',
          });
          setShowErrorPopup(true);
          throw new Error('Erro ao carregar logs de veículos');
        }

        return response.json();
      } catch (error) {
        console.error('Erro na requisição de logs de veículos:', error);
        Logger.logError(`Erro ao carregar logs de veículos: ${error.message}`);
        if (!showErrorPopup) {
          setErrorInfo({
            title: 'Erro de Conexão',
            message:
              'Não foi possível acessar os Logs de Auditoria de Veículos. Tente novamente mais tarde.',
            type: 'error',
          });
          setShowErrorPopup(true);
        }
        throw error;
      }
    },
    enabled: tipoLog === 'veiculos',
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  // Determina qual conjunto de dados usar e aplica filtros
  const isLoading =
    tipoLog === 'atividades'
      ? loadingAtividades
      : tipoLog === 'erros'
        ? loadingErros
        : loadingVeiculos;
  const rawLogs =
    tipoLog === 'atividades'
      ? logsAtividades
      : tipoLog === 'erros'
        ? logsErros
        : logsVeiculos;
  const currentLogs = filtrarLogsPorData(rawLogs, dataInicio, dataFim);

  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />

      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
            Histórico de Auditoria
          </h1>
          {/* Controles de Filtro */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Dropdown para seleção do tipo de log */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Log:
                </label>
                <select
                  value={tipoLog}
                  onChange={e => setTipoLog(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="veiculos">
                    Logs de Auditoria de Veículos
                  </option>
                  <option value="atividades">
                    Logs de Atividades (CSV/Gráficos)
                  </option>
                  <option value="erros">Logs de Erros</option>
                </select>
              </div>

              {/* Filtro por Data de Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início:
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtro por Data de Fim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim:
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Botão para limpar filtros */}
              <div>
                <button
                  onClick={limparFiltros}
                  className="w-full px-4 py-2 bg-gray-600 text-white border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Resumo dos filtros aplicados */}
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Filtros aplicados:</span>
              <span className="ml-2">
                {tipoLog === 'atividades'
                  ? 'Atividades (CSV/Gráficos)'
                  : tipoLog === 'erros'
                    ? 'Logs de Erro'
                    : 'Auditoria de Veículos'}
              </span>
              {(dataInicio || dataFim) && (
                <span className="ml-2">
                  | Período: {dataInicio || '(início)'} até {dataFim || '(fim)'}
                </span>
              )}
              {currentLogs && (
                <span className="ml-2 font-semibold text-blue-600">
                  | {currentLogs.length} registro(s) encontrado(s)
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Carregando logs...</p>
            </div>
          ) : currentLogs?.length ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ação
                    </th>
                    {tipoLog === 'atividades' ? (
                      <>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Usuário ID
                        </th>
                      </>
                    ) : tipoLog === 'erros' ? (
                      <>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Usuário ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Descrição do Erro
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Usuário ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Veículo ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Motivo de Recusa
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLogs.map((log, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-mono text-xs">
                          {formatarData(log.timestamp)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            tipoLog === 'erros' || log.acao?.includes('erro')
                              ? 'bg-red-100 text-red-800'
                              : log.acao?.includes('geracao')
                                ? 'bg-blue-100 text-blue-800'
                                : log.acao?.includes('aceito')
                                  ? 'bg-green-100 text-green-800'
                                  : log.acao?.includes('recusado')
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {formatarAcao(log.acao)}
                        </span>
                      </td>
                      {tipoLog === 'atividades' ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {log.idUsuario || 'Visitante'}
                            </span>
                          </td>
                        </>
                      ) : tipoLog === 'erros' ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {log.idUsuario || 'Visitante'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                            {log.descricaoErro ? (
                              <div
                                className="break-words"
                                title={log.descricaoErro}
                              >
                                <span className="text-xs bg-red-50 text-red-800 px-2 py-1 rounded inline-block">
                                  {log.descricaoErro}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {log.idUsuario || 'Visitante'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">
                              {log.idVeiculo || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                log.statusVeiculo.toUpperCase() === 'APROVADO'
                                  ? 'bg-green-100 text-green-800'
                                  : log.statusVeiculo.toUpperCase() === 'NEGADO'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {formatarStatus(log.statusVeiculo)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                            {log.justificativaNegacao ? (
                              <div
                                className="break-words"
                                title={log.justificativaNegacao}
                              >
                                <span className="text-xs bg-red-50 text-red-800 px-2 py-1 rounded inline-block">
                                  {log.justificativaNegacao}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl font-medium mb-2">
                Nenhum registro encontrado
              </p>
              <p className="text-sm">
                {tipoLog === 'atividades'
                  ? 'Não há logs de atividades (CSV/Gráficos) para exibir com os filtros aplicados'
                  : tipoLog === 'erros'
                    ? 'Não há logs de erro para exibir com os filtros aplicados'
                    : 'Não há logs de auditoria de veículos para exibir com os filtros aplicados'}
              </p>
              {(dataInicio || dataFim) && (
                <button
                  onClick={limparFiltros}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Limpar Filtros de Data
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <ErrorPopup
        isOpen={showErrorPopup}
        onClose={closeErrorPopup}
        title={errorInfo.title}
        message={errorInfo.message}
        type={errorInfo.type}
      />
    </div>
  );
}

export default AuditoriaLogs;
