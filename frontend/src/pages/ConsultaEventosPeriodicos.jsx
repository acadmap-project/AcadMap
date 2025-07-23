import FiltroEventosPeriodicos from '../components/FiltroEventosPeriodicos';
import HeaderSistema from '../components/HeaderSistema';
import { useState } from 'react';
import useLogin from '../hooks/userAuth';

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
  const hasResultados = resultados.eventos.length > 0 || resultados.periodicos.length > 0;

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
        className={`w-full flex ${hasResultados
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
                Nenhum evento ou periódico aprovado foi encontrado com os critérios informados
              </p>
            </div>
          )}
        </div>
        
        {hasResultados && (
          <div className="w-full md:flex-1 md:max-w-5xl">
            <table className="w-full border">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border px-2 py-1">Tipo</th>
                  <th className="border px-2 py-1">Nome</th>
                  <th className="border px-2 py-1">Classificação</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(resultados.eventos || []).map(ev => ({
                    id: ev.idVeiculo,
                    tipo: ev.tipo === 'evento' ? 'Evento' : ev.tipo,
                    nome: ev.nome,
                    areaConhecimento: ev.areaConhecimento || '',
                    classificacao: ev.classificacao || '',
                  })),
                  ...(resultados.periodicos || []).map(p => ({
                    id: p.idVeiculo,
                    tipo: p.tipo === 'periodico' ? 'Periódico' : p.tipo,
                    nome: p.nome,
                    areaConhecimento: p.areaConhecimento || '',
                    classificacao: p.classificacao || '',
                  })),
                ].map(item => (
                  <tr key={item.tipo + '-' + item.id}>
                    <td className="border px-2 py-1">{item.tipo}</td>
                    <td className="border px-2 py-1">{item.nome}</td>
                    <td className="border px-2 py-1">{item.classificacao}</td>
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
