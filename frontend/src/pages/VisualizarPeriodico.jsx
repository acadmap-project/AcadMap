import { get } from '../utils/authFetch';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import useAreas from '../hooks/useAreas';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import { useQuery } from '@tanstack/react-query';
import '../styles/App.css';
import { formatVinculoSBC, formatAdequacaoDefesa } from '../utils/format';
import Logger from '../utils/logger';

const fetchPeriodicoData = async id => {
  const response = await get(`/api/periodicos/${id}`, {}, false); // requireAuth = false
  if (!response.ok) {
    const error = new Error('Erro ao buscar dados do periódico');
    Logger.logError(
      `Erro ao buscar dados do periódico ID ${id}: ${error.message}`
    );
    throw error;
  }
  return await response.json();
};

const VisualizarPeriodico = () => {
  const { loggedIn } = useLogin();
  const { id } = useParams();
  const areas = useAreas();

  const navigate = useNavigate();

  const { data: periodicoData } = useQuery({
    queryKey: ['periodico', id],
    queryFn: () => fetchPeriodicoData(id),
  });

  useEffect(() => {
    console.log('Dados do periódico:', periodicoData);
  }, [periodicoData]);

  const getAreaName = areaId => {
    const area = areas.find(a => a.value === areaId);
    return area ? area.label : areaId;
  };

  const voltarParaConsultas = () => {
    sessionStorage.setItem('consultaRestore', '1');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <HeaderSistema
        userType={loggedIn?.userType}
        userName={loggedIn?.userName}
      />
      {periodicoData && (
        <div className="container mt-4 mx-auto max-w-4xl max-h-full">
          <div className="rounded-box border-2 border-primary bg-base-100 shadow-xl p-0 md:p-2">
            <h1 className="text-3xl text-center font-bold mb-6 pt-6">
              Consulta de Eventos e Periódicos
            </h1>

            <div className="rounded-box bg-base-200 p-4 md:p-8 mx-2 md:mx-6 mb-6">
              <div className="p-3 md:p-4 rounded-md border border-primary bg-base-100 mb-6">
                <h2 className="text-xl font-medium text-center">
                  Dados completos do Periódico {periodicoData.nome}
                </h2>
              </div>

              <div className="space-y-2 md:space-y-4">
                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    NOME DO PERIÓDICO
                  </span>
                  <div className="font-medium break-words">
                    {periodicoData.nome || 'N/A'}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">ISSN</span>
                  <div className="font-medium">
                    {periodicoData.issn || 'N/A'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      PERCENTIL JCR
                    </span>
                    <div className="font-medium">
                      {periodicoData.percentilJcr || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      PERCENTIL SCOPUS
                    </span>
                    <div className="font-medium">
                      {periodicoData.percentilScopus || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">H5</span>
                  <div className="font-medium">{periodicoData.h5 || 'N/A'}</div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    ÁREA DE CONHECIMENTO (CNPQ)
                  </span>
                  <div className="font-medium">
                    {periodicoData.areasPesquisaIds &&
                    periodicoData.areasPesquisaIds.length > 0
                      ? periodicoData.areasPesquisaIds
                          .map(areaId => getAreaName(areaId))
                          .join(', ')
                      : 'N/A'}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    VÍNCULO COM A SBC
                  </span>
                  <div className="font-medium">
                    {formatVinculoSBC(periodicoData.vinculoSbc, true) || 'N/A'}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    LINK DO PERIÓDICO
                  </span>
                  <div>
                    {periodicoData.link ? (
                      <a
                        href={periodicoData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {periodicoData.link}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
                  </span>
                  <div>
                    {periodicoData.linkGoogleScholar ? (
                      <a
                        href={periodicoData.linkGoogleScholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {periodicoData.linkGoogleScholar}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>

                {periodicoData.linkJcr && (
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK JCR
                    </span>
                    <div>
                      <a
                        href={periodicoData.linkJcr}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {periodicoData.linkJcr}
                      </a>
                    </div>
                  </div>
                )}

                {periodicoData.linkScopus && (
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DE REPOSITÓRIO (SCOPUS)
                    </span>
                    <div>
                      <a
                        href={periodicoData.linkScopus}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {periodicoData.linkScopus}
                      </a>
                    </div>
                  </div>
                )}

                {periodicoData.qualisAntigo && (
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      NOTA NO ANTIGO QUALIS CAPES
                    </span>
                    <div className="font-medium">
                      {periodicoData.qualisAntigo.toUpperCase()}
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
                        periodicoData.classificacao
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    ADEQUAÇÃO PARA DEFESAS ACADÊMICAS (MESTRADO E/OU DOUTORADO)
                  </span>
                  <div className="font-medium">
                    {formatAdequacaoDefesa(periodicoData.adequacaoDefesa)}
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    INDICAÇÃO SE É PREDATÓRIO
                  </span>
                  <div>
                    <span
                      className={`badge ${periodicoData.flagPredatorio ? 'badge-error' : 'badge-success'}`}
                    >
                      {periodicoData.flagPredatorio ? 'Sim' : 'Não'}
                    </span>
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
        </div>
      )}
    </div>
  );
};

export default VisualizarPeriodico;
