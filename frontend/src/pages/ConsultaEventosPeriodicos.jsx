// Funções utilitárias para apresentação de valores
function formatVinculoSBC(valor) {
  switch (valor) {
    case 'vinculo_top_10':
      return 'Vinculo Top 10';
    case 'vinculo_top_20':
      return 'Vinculo Top 20';
    case 'vinculo_comum':
      return 'Vinculo Comum';
    case 'nenhum':
      return 'Não';
    default:
      return valor || '';
  }
}

function formatAdequacaoDefesa(valor) {
  switch (valor) {
    case 'mestrado':
      return 'Mestrado';
    case 'mestrado_doutorado':
      return 'Mestrado e Doutorado';
    case 'doutorado':
      return 'Doutorado';
    default:
      return valor || '';
  }
}

import FiltroEventosPeriodicos from '../components/FiltroEventosPeriodicos';
import HeaderSistema from '../components/HeaderSistema';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/userAuth';
import { Link } from 'react-router-dom';

function ConsultaEventosPeriodicos() {
  const [busca, setBusca] = useState(false);
  const [resultados, setResultados] = useState({ eventos: [], periodicos: [] });
  const [showBusca, setShowBusca] = useState(true);
  const onResultados = ({ eventos, periodicos }) => {
    setResultados({
      eventos: Array.isArray(eventos) ? eventos : [],
      periodicos: Array.isArray(periodicos) ? periodicos : [],
    });
    setBusca(true);
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

  useEffect(() => {
    console.log('Resultados atualizados:', resultados);
  }, [resultados]);

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
          className="flex-shrink-0 flex justify-start"
        >
          {!showBusca && hasResultados && (
            <button
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 ml-8"
              onClick={() => {
                setShowBusca(true);
                setResultados({ eventos: [], periodicos: [] });
                setBusca(false);
              }}
            >
              ← Voltar
            </button>
          )}
        </div>
        <h1 className="text-4xl font-normal text-center flex-1">
          Consulta de Eventos e Periódicos
        </h1>
        <div style={{ width: '140px' }} className="flex-shrink-0" />
      </div>

      <div className="w-full flex flex-col items-center">
        {showBusca && (
          <div className="w-full md:max-w-xs md:min-w-[20rem] mb-4 md:mb-0">
            <FiltroEventosPeriodicos onResultados={onResultados} />
            {!hasResultados && busca && (
              <div className="flex justify-center mt-4">
                <p className="text-center bg-white bg-opacity-90 px-4 py-2 rounded shadow">
                  Nenhum evento ou periódico aprovado foi encontrado com os
                  critérios informados
                </p>
              </div>
            )}
          </div>
        )}
        {!showBusca && hasResultados && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full md:flex-1 overflow-x-auto mt-8">
              <table className="w-full border min-w-max">
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
                      h5Percentil: ev.h5 || ev.percentil || '',
                    })),
                    ...(resultados.periodicos || []).map(p => ({
                      id: p.idVeiculo,
                      tipo: 'Periódico',
                      nome: p.nome,
                      areaConhecimento: p.areaPesquisa || '',
                      classificacao: p.classificacao || '',
                      vinculoSBC: p.vinculoSBC || '',
                      adequacaoDefesa: p.adequacaoDefesa || '',
                      h5Percentil: p.h5 || p.percentil || '',
                    })),
                  ].map(item => (
                    <tr key={item.tipo + '-' + item.id}>
                      <td className="border px-2 py-1">
                        <Link
                          className="underline decoration-solid cursor-pointer"
                          to={
                            item.tipo === 'Evento'
                              ? `/evento/${item.id}`
                              : `/periodico/${item.id}`
                          }
                        >
                          {item.tipo}
                        </Link>
                      </td>
                      <td className="border px-2 py-1">{item.nome}</td>
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
          </div>
        )}
      </div>
    </>
  );
}

export default ConsultaEventosPeriodicos;
