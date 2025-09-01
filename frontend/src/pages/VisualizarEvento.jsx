import { get } from '../utils/authFetch';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import { formatVinculoSBC, formatAdequacaoDefesa } from '../utils/format';
import { useQuery } from '@tanstack/react-query';
import '../styles/App.css';
import Logger from '../utils/logger';

const fetcheventoData = async id => {
  const response = await get(`/api/eventos/${id}`, {}, false); // requireAuth = false
  if (!response.ok) {
    const error = new Error('Erro ao buscar dados do evento');
    Logger.logError(
      `Erro ao buscar dados do evento ID ${id}: ${error.message}`
    );
    throw error;
  }
  return await response.json();
};

const VisualizarPeriodico = () => {
  const { loggedIn } = useLogin();
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: eventoData } = useQuery({
    queryKey: ['periodico', id],
    queryFn: () => fetcheventoData(id),
  });

  useEffect(() => {
    console.log('Dados do periódico:', eventoData);
  }, [eventoData]);

  const voltarParaConsultas = () => {
    // sinaliza para restaurar a tabela na tela de consultas
    sessionStorage.setItem('consultaRestore', '1');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <HeaderSistema
        userType={loggedIn?.userType}
        userName={loggedIn?.userName}
      />
      {eventoData ? (
        <div className="container mt-4 mx-auto max-w-4xl max-h-full">
          <div className="rounded-box border-2 border-primary bg-base-100 shadow-xl p-0 md:p-2">
            <h1 className="text-3xl text-center font-bold mb-6 pt-6">
              Consulta de Eventos e Periódicos
            </h1>

            <div className="rounded-box bg-base-200 p-4 md:p-8 mx-2 md:mx-6 mb-6">
              <div className="p-3 md:p-4 rounded-md border border-primary bg-base-100 mb-6">
                <h2 className="text-xl font-medium text-center">
                  Dados completos do Evento {eventoData.nome}
                </h2>
              </div>

              <div className="space-y-2 md:space-y-4">
                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    NOME DO EVENTO
                  </span>
                  <div className="font-medium break-words">
                    {eventoData.nome || 'N/A'}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    ÍNDICE H5
                  </span>
                  <div className="font-medium">{eventoData.h5 || 'N/A'}</div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    ÁREA DE CONHECIMENTO (CNPQ)
                  </span>
                  <div className="font-medium">
                    {eventoData.areasPesquisas &&
                    eventoData.areasPesquisas.length > 0
                      ? eventoData.areasPesquisas.join(', ')
                      : 'N/A'}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    VÍNCULO COM A SBC
                  </span>
                  <div className="font-medium">
                    {formatVinculoSBC(eventoData.vinculoSbc, false) || 'N/A'}
                  </div>
                </div>

                {eventoData.linkSolSbc && (
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DO SOL-SBC
                    </span>
                    <div>
                      <a
                        href={eventoData.linkSolSbc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {eventoData.linkSolSbc}
                      </a>
                    </div>
                  </div>
                )}

                {eventoData.linkGoogleScholar && (
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DO GOOGLE SCHOLAR
                    </span>
                    <div>
                      <a
                        href={eventoData.linkGoogleScholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {eventoData.linkGoogleScholar}
                      </a>
                    </div>
                  </div>
                )}

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    CLASSIFICAÇÃO FINAL
                  </span>
                  <div>
                    <span className="badge badge-primary">
                      {formatarClassificacaoParaExibicao(
                        eventoData.classificacao
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    ADEQUAÇÃO PARA DEFESAS ACADÊMICAS (MESTRADO E/OU DOUTORADO)
                  </span>
                  <div className="font-medium">
                    {formatAdequacaoDefesa(eventoData.adequacaoDefesa)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
                <button
                  onClick={voltarParaConsultas}
                  className="btn btn-primary w-full sm:w-auto px-6 sm:px-8 min-h-12"
                >
                  Voltar para consultas
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('consultaResultados');
                    sessionStorage.removeItem('consultaRestore');
                    navigate('/');
                  }}
                  className="btn btn-secondary w-full sm:w-auto px-6 sm:px-8 min-h-12"
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="ml-6 flex-1">
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              Erro ao recuperar dados do banco
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarPeriodico;
