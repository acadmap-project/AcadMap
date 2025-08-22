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

function ConsultaEventosPeriodicos() {
  const [busca, setBusca] = useState(false);
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
    <>
      {showNoResults && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-yellow-100 border-2 border-yellow-500 rounded-xl shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-12 w-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-lg text-yellow-700 leading-relaxed">
                    Nenhum evento ou periódico aprovado foi encontrado com os critérios de busca informados. 
                    Tente ajustar os filtros aplicados para ampliar a pesquisa e obter mais resultados.
                  </p>
                </div>
                <button
                  onClick={() => setShowNoResults(false)}
                  className="!bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 flex-shrink-0 ml-4 px-4 py-2"
                  aria-label="Fechar"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeaderSistema
        userName={loggedIn ? loggedIn.userName : 'Usuário Desconhecido'}
        userType={loggedIn ? loggedIn.userType : 'NÃO LOGADO'}
      />

      <div
        className={`w-full flex items-center mt-8${showBusca ? ' mb-12' : ''}`}
      >
        <div
          style={{ width: '180px' /* largura do botão */ }}
          className="flex-shrink-0 flex flex-col justify-start"
        >
          {!showBusca && hasResultados && (
            <>
              <button
                className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 ml-8"
                onClick={() => {
                  setShowBusca(true);
                  setResultados({ eventos: [], periodicos: [] });
                  setBusca(false);
                  setShowNoResults(false);
                  // limpa qualquer restauração salva
                  sessionStorage.removeItem('consultaResultados');
                  sessionStorage.removeItem('consultaRestore');
                }}
              >
                ← Voltar
              </button>
              <button
                className="!px-8 !py-3 !bg-green-600 !text-white !border-0 !rounded-none hover:!bg-green-700 focus:!outline-none focus:!ring-2 focus:!ring-green-500 focus:!ring-opacity-50 ml-8 mt-2"
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
                    ].map(field => `${String(field).replace(/"/g, '""')}`);
                    csvRows.push(row.join(','));
                  });
                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], {
                    type: 'text/csv;charset=utf-8;',
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  const date = new Date().toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo'
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
                Exportar
              </button>
            </>
          )}
        </div>
        <h1 className="text-4xl font-normal text-center flex-1">
          Consulta de Eventos e Periódicos
        </h1>
        <div style={{ width: '140px' }} className="flex-shrink-0" />
      </div>

      <div
        className={`w-full flex ${
          hasResultados
            ? 'flex-col md:flex-row justify-center items-start gap-20 mt-2'
            : 'justify-center'
        }`}
      >
        <div
          className={
            hasResultados
              ? 'md:max-w-xs md:min-w-[12rem] mb-4 md:mb-0'
              : 'w-full'
          }
        >
          <FiltroEventosPeriodicos
            onResultados={onResultados}
            filtrosAtivos={filtrosAtivos}
            onFiltrosChange={setFiltrosAtivos}
          />
        </div>
        {!showBusca && hasResultados && (
          <div className="w-full md:flex-1 md:max-w-5xl">
            <ListaFiltrosEventosPeriodicos
              filtros={filtrosAtivos}
              areas={areas}
            />
            <div className="w-full flex justify-center mt-8">
              <table className="border min-w-max mx-auto">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="border px-2 py-1">Tipo</th>
                    <th className="border px-2 py-1">Nome</th>
                    <th className="border px-2 py-1">
                      <span>
                        Área de
                        <br />
                        Conhecimento
                      </span>
                    </th>
                    <th className="border px-2 py-1">Classificação</th>
                    <th className="border px-2 py-1">Vínculo SBC</th>
                    <th className="border px-2 py-1">
                      <span>
                        Adequação
                        <br />
                        para Defesas
                      </span>
                    </th>
                    <th className="border px-2 py-1">
                      <span>
                        H5 ou
                        <br />
                        Percentil
                      </span>
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
                    })),
                  ].map(item => (
                    <tr key={item.tipo + '-' + item.id}>
                      <td className="border px-2 py-1">{item.tipo}</td>
                      <td className="border px-2 py-1">
                        <Link
                          className="underline decoration-solid cursor-pointer"
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
                              sessionStorage.setItem('consultaRestore', '1');
                            } catch {
                              // ignora errors de armazenamento
                            }
                          }}
                        >
                          {item.nome}
                        </Link>
                      </td>
                      <td className="border px-2 py-1">
                        {Array.isArray(item.areaConhecimento)
                          ? item.areaConhecimento.map((area, idx) => (
                              <span key={idx}>
                                {area}
                                {idx < item.areaConhecimento.length - 1 && (
                                  <br />
                                )}
                              </span>
                            ))
                          : item.areaConhecimento}
                      </td>
                      <td className="border px-2 py-1">
                        {String(item.classificacao).toUpperCase()}
                      </td>
                      <td className="border px-2 py-1">
                        {formatVinculoSBC(item.vinculoSBC)}
                      </td>
                      <td className="border px-2 py-1">
                        {formatAdequacaoDefesa(item.adequacaoDefesa)}
                      </td>
                      <td className="border px-2 py-1">{item.h5Percentil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => {
                try {
                  navigate('/visualizar-graficos', {
                    state: { resultados, filtros: filtrosAtivos },
                  });
                  logChart();
                } catch (error) {
                  logChartError();
                }
              }}
              className="!bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 mt-8"
            >
              Visualizar Gráficos
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ConsultaEventosPeriodicos;
