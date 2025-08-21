import FiltroEventosPeriodicos from '../components/FiltroEventosPeriodicos';
import HeaderSistema from '../components/HeaderSistema';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/userAuth';
import { Link } from 'react-router-dom';
import { formatVinculoSBC, formatAdequacaoDefesa } from '../utils/format';
import ListaFiltrosEventosPeriodicos from '../components/ListaFiltrosEventosPeriodicos';
import useAreas from '../hooks/useAreas';
import { useNavigate } from 'react-router-dom';

function ConsultaEventosPeriodicos() {
  const [busca, setBusca] = useState(false);
  const [resultados, setResultados] = useState({ eventos: [], periodicos: [] });
  const [showBusca, setShowBusca] = useState(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const areas = useAreas();

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
    } else {
      setShowBusca(true);
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

          {!hasResultados && busca && (
            <div className="flex justify-center mt-4">
              <p className="text-center bg-white bg-opacity-90 px-4 py-2 rounded shadow">
                Nenhum evento ou periódico aprovado foi encontrado com os
                critérios informados
              </p>
            </div>
          )}
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
              onClick={() =>
                navigate('/visualizar-graficos', {
                  state: { resultados, filtros: filtrosAtivos },
                })
              }
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
