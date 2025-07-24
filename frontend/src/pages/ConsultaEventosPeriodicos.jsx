import FiltroEventosPeriodicos from '../components/FiltroEventosPeriodicos';
import HeaderSistema from '../components/HeaderSistema';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/userAuth';
import { Link } from 'react-router-dom';

function ConsultaEventosPeriodicos() {
  const [busca, setBusca] = useState(false);
  const [resultados, setResultados] = useState({ eventos: [], periodicos: [] });
  const onResultados = ({ eventos, periodicos }) => {
    setResultados({
      eventos: Array.isArray(eventos) ? eventos : [],
      periodicos: Array.isArray(periodicos) ? periodicos : [],
    });
    setBusca(true);
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

      <h1 className="mt-8 mb-12 text-center text-4xl font-normal">
        Consulta de Eventos e Periódicos
      </h1>

      <div
        className={`w-full flex ${
          hasResultados
            ? 'flex-col md:flex-row justify-center items-start gap-8'
            : 'justify-center'
        }`}
      >
        <div
          className={
            hasResultados
              ? 'md:max-w-xs md:min-w-[20rem] mb-4 md:mb-0'
              : 'w-full'
          }
        >
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

        {hasResultados && (
          <div className="w-full md:flex-1 overflow-x-auto">
            <table className="w-full border min-w-max">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border px-2 py-1">Tipo</th>
                  <th className="border px-2 py-1">Nome</th>
                  <th className="border px-2 py-1">Área de Conhecimento</th>
                  <th className="border px-2 py-1">Classificação</th>
                  <th className="border px-2 py-1">Vínculo SBC</th>
                  <th className="border px-2 py-1">Adequação para Defesas</th>
                  <th className="border px-2 py-1">H5/Percentil</th>
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
                      {item.areaConhecimento}
                    </td>
                    <td className="border px-2 py-1">{item.classificacao}</td>
                    <td className="border px-2 py-1">{item.vinculoSBC}</td>
                    <td className="border px-2 py-1">{item.adequacaoDefesa}</td>
                    <td className="border px-2 py-1">{item.h5Percentil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default ConsultaEventosPeriodicos;
