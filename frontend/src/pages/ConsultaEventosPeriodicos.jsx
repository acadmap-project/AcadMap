import FiltroEventosPeriodicos from '../components/FiltroEventosPeriodicos';
import HeaderSistema from '../components/HeaderSistema';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/userAuth';
import { Link } from 'react-router-dom';
import { formatVinculoSBC, formatAdequacaoDefesa } from '../utils/format';
import ListaFiltrosEventosPeriodicos from '../components/ListaFiltrosEventosPeriodicos';
import useAreas from '../hooks/useAreas';
import { useNavigate } from 'react-router-dom';
import { useLogger } from '../hooks/useLogger.js';
import Logger from '../utils/logger.js';

function ConsultaEventosPeriodicos() {
  const [_, setBusca] = useState(false);
  const [resultados, setResultados] = useState({ eventos: [], periodicos: [] });
  const [showBusca, setShowBusca] = useState(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const [showNoResults, setShowNoResults] = useState(false);
  const areas = useAreas();

  const { logCsv, logChart, logChartError } = useLogger();

  const navigate = useNavigate();
  const onResultados = ({ eventos, periodicos }) => {
    // Limpa resultados antigos antes de adicionar os novos
    setResultados({
      eventos: Array.isArray(eventos) ? eventos : [],
      periodicos: Array.isArray(periodicos) ? periodicos : [],
    });
    setBusca(true);
    // Garante que showBusca reflete corretamente o estado da busca
    if (
      (Array.isArray(eventos) && eventos.length > 0) ||
      (Array.isArray(periodicos) && periodicos.length > 0)
    ) {
      setShowBusca(false);
      setShowNoResults(false);
    } else {
      setShowBusca(true);
      setShowNoResults(true);
    }
  };
  const { loggedIn } = useLogin();
  const hasResultados =
    resultados.eventos.length > 0 || resultados.periodicos.length > 0;

  // Restaura a última tabela de resultados quando vier da tela de detalhes
  useEffect(() => {
    const restore = sessionStorage.getItem('consultaRestore');
    if (restore) {
      try {
        const saved = JSON.parse(sessionStorage.getItem('consultaResultados'));
        if (
          saved &&
          typeof saved === 'object' &&
          (Array.isArray(saved.eventos) || Array.isArray(saved.periodicos))
        ) {
          setResultados({
            eventos: Array.isArray(saved.eventos) ? saved.eventos : [],
            periodicos: Array.isArray(saved.periodicos) ? saved.periodicos : [],
          });
          setShowBusca(false);
          setBusca(true);
        }
      } catch {
        // ignora erros de parse
      } finally {
        sessionStorage.removeItem('consultaRestore');
      }
    }
  }, []);

  // useEffect(() => {
  //   console.log('Resultados atualizados:', resultados);
  // }, [resultados]);

  return (
    <div className="min-h-screen">
      <div className={`modal ${showNoResults ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <div className="alert alert-warning">
            <svg
              className="h-6 w-6 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Nenhum resultado encontrado</h3>
              <div className="text-sm">
                Nenhum evento ou periódico aprovado foi encontrado com os
                critérios de busca informados. Tente ajustar os filtros
                aplicados para ampliar a pesquisa e obter mais resultados.
              </div>
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={() => setShowNoResults(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      <HeaderSistema
        userName={loggedIn ? loggedIn.userName : 'Usuário Desconhecido'}
        userType={loggedIn ? loggedIn.userType : 'Visitante'}
      />

      <div className="container items-center mt-4 mx-auto max-w-full max-h-full bg-base-100 shadow-sm">
        <div className="rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-center font-bold mb-6">
            Consulta de Eventos e Periódicos
          </h1>

          <div
            className={`${hasResultados ? 'grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6' : 'flex justify-center'}`}
          >
            {/* Coluna da Esquerda - Card de Filtros */}
            {hasResultados && !showBusca ? (
              <div className="lg:col-span-1">
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-actions flex-col gap-2 mx-auto">
                    <button
                      className="btn btn-neutral text-base btn-block"
                      onClick={() => {
                        setShowBusca(true);
                        setResultados({ eventos: [], periodicos: [] });
                        setBusca(false);
                        setShowNoResults(false);
                        sessionStorage.removeItem('consultaResultados');
                        sessionStorage.removeItem('consultaRestore');
                      }}
                    >
                      ← Voltar ao Início
                    </button>

                    <div className="flex flex-row">
                      <button
                        className="btn btn-success btn-block w-1/2"
                        onClick={() => {
                          // Função para exportar resultados em CSV
                          const csvRows = [];
                          const header = [
                            'Tipo',
                            'Nome',
                            'Área de Conhecimento',
                            'Classificação',
                            'Vínculo SBC',
                            'Adequação para Defesas',
                            'H5 ou Percentil',
                            'Predatório',
                          ];
                          csvRows.push(header.join(','));
                          const allItems = [
                            ...(resultados.eventos || []).map(ev => ({
                              tipo: 'Evento',
                              nome: ev.nome,
                              areaConhecimento: Array.isArray(ev.areaPesquisa)
                                ? ev.areaPesquisa.join('; ')
                                : ev.areaPesquisa || '',
                              classificacao: ev.classificacao || '',
                              vinculoSBC: ev.vinculoSBC || '',
                              adequacaoDefesa: ev.adequacaoDefesa || '',
                              h5Percentil: ev.h5 || '',
                              predatorio: ev.flagPredatorio ? 'Sim' : 'Não',
                            })),
                            ...(resultados.periodicos || []).map(p => ({
                              tipo: 'Periódico',
                              nome: p.nome,
                              areaConhecimento: Array.isArray(p.areaPesquisa)
                                ? p.areaPesquisa.join('; ')
                                : p.areaPesquisa || '',
                              classificacao: p.classificacao || '',
                              vinculoSBC: p.vinculoSBC || '',
                              adequacaoDefesa: p.adequacaoDefesa || '',
                              h5Percentil:
                                p.h5 ||
                                Math.max(p.percentilJcr, p.percentilScopus) ||
                                '',
                              predatorio: p.flagPredatorio ? 'Sim' : 'Não',
                            })),
                          ];
                          allItems.forEach(item => {
                            const row = [
                              item.tipo,
                              item.nome,
                              item.areaConhecimento,
                              String(item.classificacao).toUpperCase(),
                              formatVinculoSBC(item.vinculoSBC),
                              formatAdequacaoDefesa(item.adequacaoDefesa),
                              item.h5Percentil,
                              item.predatorio,
                            ].map(
                              field => `${String(field).replace(/"/g, '""')}`
                            );
                            csvRows.push(row.join(','));
                          });
                          const csvContent = csvRows.join('\n');
                          const blob = new Blob([csvContent], {
                            type: 'text/csv;charset=utf-8;',
                          });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          const date = new Date().toLocaleString('pt-BR', {
                            timeZone: 'America/Sao_Paulo',
                          });
                          const nameFile = `Sistema de Veículos de Publicação Acadêmica - ${date}.csv`;
                          link.href = url;
                          link.setAttribute('download', nameFile);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                          logCsv();
                        }}
                      >
                        📊 Exportar CSV
                      </button>

                      <button
                        onClick={() => {
                          try {
                            navigate('/visualizar-graficos', {
                              state: { resultados, filtros: filtrosAtivos },
                            });
                            logChart();
                          } catch (error) {
                            logChartError();
                            Logger.logError(
                              `Erro ao navegar para visualização de gráficos: ${error.message}`
                            );
                          }
                        }}
                        className="btn btn-primary btn-block w-1/2"
                      >
                        📈 Visualizar Gráficos
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-4 py-8">
                    <h2 className="card-title text-lg mb-4">
                      Filtros de Pesquisa
                    </h2>

                    <FiltroEventosPeriodicos
                      onResultados={onResultados}
                      filtrosAtivos={filtrosAtivos}
                      onFiltrosChange={setFiltrosAtivos}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Tela inicial - filtros centralizados */
              <div className="w-full max-w-2xl mx-auto">
                <FiltroEventosPeriodicos
                  onResultados={onResultados}
                  filtrosAtivos={filtrosAtivos}
                  onFiltrosChange={setFiltrosAtivos}
                />
              </div>
            )}

            {/* Coluna da Direita - Tabela de Resultados */}
            {!showBusca && hasResultados && (
              <div className="lg:col-span-3">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="card-title text-lg">
                        Resultados da Pesquisa (
                        {(resultados.eventos || []).length +
                          (resultados.periodicos || []).length}{' '}
                        itens)
                      </h2>
                    </div>

                    <ListaFiltrosEventosPeriodicos
                      filtros={filtrosAtivos}
                      areas={areas}
                    />

                    <div className="mt-6">
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr className="bg-base-200">
                              <th className="text-center font-medium">Tipo</th>
                              <th className="text-left font-medium">Nome</th>
                              <th className="text-center font-medium">
                                Área de Conhecimento
                              </th>
                              <th className="text-center font-medium">
                                Classificação
                              </th>
                              <th className="text-center font-medium">
                                Vínculo SBC
                              </th>
                              <th className="text-center font-medium">
                                Adequação para Defesas
                              </th>
                              <th className="text-center font-medium">
                                H5 ou Percentil
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ...(resultados.eventos || []).map(ev => ({
                                id: ev.idVeiculo,
                                tipo: 'Evento',
                                nome: ev.nome,
                                areaConhecimento: ev.areaPesquisa || '',
                                classificacao: ev.classificacao || '',
                                vinculoSBC: ev.vinculoSBC || '',
                                adequacaoDefesa: ev.adequacaoDefesa || '',
                                h5Percentil: ev.h5 || '',
                                flagPredatorio: false, // Eventos não são predatórios
                              })),
                              ...(resultados.periodicos || []).map(p => ({
                                id: p.idVeiculo,
                                tipo: 'Periódico',
                                nome: p.nome,
                                areaConhecimento: p.areaPesquisa || '',
                                classificacao: p.classificacao || '',
                                vinculoSBC: p.vinculoSBC || '',
                                adequacaoDefesa: p.adequacaoDefesa || '',
                                h5Percentil:
                                  p.h5 ||
                                  Math.max(p.percentilJcr, p.percentilScopus) ||
                                  '',
                                flagPredatorio: p.flagPredatorio,
                              })),
                            ].map(item => (
                              <tr key={item.tipo + '-' + item.id}>
                                <td className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    {item.tipo === 'Periódico' &&
                                      item.flagPredatorio && (
                                        <span
                                          className="text-error text-lg"
                                          title="Periódico Predatório"
                                        >
                                          ⚠️
                                        </span>
                                      )}
                                    <span className="badge badge-outline">
                                      {item.tipo}
                                    </span>
                                  </div>
                                </td>
                                <td className="font-medium">
                                  <Link
                                    className="link link-primary"
                                    to={
                                      item.tipo === 'Evento'
                                        ? `/evento/${item.id}`
                                        : `/periodico/${item.id}`
                                    }
                                    onClick={() => {
                                      try {
                                        sessionStorage.setItem(
                                          'consultaResultados',
                                          JSON.stringify(resultados)
                                        );
                                        sessionStorage.setItem(
                                          'consultaRestore',
                                          '1'
                                        );
                                      } catch {
                                        // ignora errors de armazenamento
                                      }
                                    }}
                                  >
                                    {item.nome}
                                  </Link>
                                </td>
                                <td className="text-center">
                                  {Array.isArray(item.areaConhecimento)
                                    ? item.areaConhecimento.map((area, idx) => (
                                        <div key={idx} className="text-sm">
                                          {area}
                                        </div>
                                      ))
                                    : item.areaConhecimento}
                                </td>
                                <td className="text-center">
                                  <span className="badge badge-primary">
                                    {String(item.classificacao).toUpperCase()}
                                  </span>
                                </td>
                                <td className="text-center">
                                  {formatVinculoSBC(item.vinculoSBC)}
                                </td>
                                <td className="text-center">
                                  {formatAdequacaoDefesa(item.adequacaoDefesa)}
                                </td>
                                <td className="text-center">
                                  {item.h5Percentil}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultaEventosPeriodicos;
