import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import useAreas from '../hooks/useAreas';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import { useQuery } from '@tanstack/react-query';
import '../styles/App.css';

const fetchPeriodicoData = async id => {
  const response = await fetch(`http://localhost:8080/api/periodicos/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do periódico');
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

  return (
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      {periodicoData && (
        <>
          <h1 className="mt-8 mb-8">Cadastro de Eventos e Periódicos</h1>

          <div className="rounded-xl border-2 w-xs mx-auto text-xl p-2 mb-12">
            Dados completos do Periódico {periodicoData.nome}
          </div>

          <div
            className="flex flex-col gap-4 max-w-2xl mx-auto w-1/2 text-left"
            style={{ fontFamily: 'Poppins', fontWeight: '400' }}
          >
            <div className="text-sm text-gray-900">
              <span className="font-medium">NOME DO PERIÓDICO:</span>{' '}
              {periodicoData.nome || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ISSN:</span>{' '}
              {periodicoData.issn || 'N/A'}
            </div>

            {periodicoData.percentilJcr && (
              <div className="text-sm text-gray-900">
                <span className="font-medium">PERCENTIL JCR:</span>{' '}
                {periodicoData.percentilJcr}
              </div>
            )}

            {periodicoData.percentilScopus && (
              <div className="text-sm text-gray-900">
                <span className="font-medium">PERCENTIL SCOPUS:</span>{' '}
                {periodicoData.percentilScopus}
              </div>
            )}

            <div className="text-sm text-gray-900">
              <span className="font-medium">ÁREA DE CONHECIMENTO (CNPQ):</span>{' '}
              {periodicoData.areasPesquisaIds &&
              periodicoData.areasPesquisaIds.length > 0
                ? periodicoData.areasPesquisaIds
                    .map(areaId => getAreaName(areaId))
                    .join(', ')
                : 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">VÍNCULO COM A SBC:</span>{' '}
              {periodicoData.vinculoSbc || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">LINK DO PERIÓDICO:</span>{' '}
              {periodicoData.link ? (
                <a
                  href={periodicoData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {periodicoData.link}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">
                LINK DE REPOSITÓRIO (GOOGLE SCHOLAR):
              </span>{' '}
              {periodicoData.linkGoogleScholar ? (
                <a
                  href={periodicoData.linkGoogleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {periodicoData.linkGoogleScholar}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            {periodicoData.linkJcr && (
              <div className="text-sm text-gray-900">
                <span className="font-medium">LINK JCR:</span>{' '}
                <a
                  href={periodicoData.linkJcr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {periodicoData.linkJcr}
                </a>
              </div>
            )}

            {periodicoData.linkScopus && (
              <div className="text-sm text-gray-900">
                <span className="font-medium">
                  LINK DE REPOSITÓRIO (SCOPUS):
                </span>{' '}
                <a
                  href={periodicoData.linkScopus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {periodicoData.linkScopus}
                </a>
              </div>
            )}

            {periodicoData.qualisAntigo && (
              <div className="text-sm text-gray-900">
                <span className="font-medium">
                  NOTA NO ANTIGO QUALIS CAPES:
                </span>
                {periodicoData.qualisAntigo.toUpperCase()}
              </div>
            )}

            <div className="text-sm text-gray-900">
              <span className="font-medium">CLASSIFICAÇÃO FINAL:</span>{' '}
              {formatarClassificacaoParaExibicao(periodicoData.classificacao)}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">
                ADEQUAÇÃO PARA DEFESAS ACADÊMCIAS (MESTRADO E/OU DOUTORADO):
              </span>{' '}
              {periodicoData.adequacaoDefesa.toUpperCase()}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">INDICAÇÃO SE É PREDATÓRIO:</span>{' '}
              {periodicoData.flagPredatorio ? 'Sim' : 'Não'}
            </div>
          </div>

          <div className="w-full flex justify-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
              style={{ fontFamily: 'Poppins', fontWeight: '400' }}
            >
              Voltar ao início
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default VisualizarPeriodico;
