import { post } from '../utils/authFetch';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';
import useAreas from '../hooks/useAreas';
import Popup from '../components/Popup';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import '../styles/App.css';
import Logger from '../utils/logger';
import { formatVinculoSBC } from '../utils/format'

const queryClient = new QueryClient();

// Helper to convert empty string/undefined to null for all fields
const normalizeToNull = obj => {
  if (!obj || typeof obj !== 'object') return obj;
  const normalized = {};
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      normalized[key] = obj[key].length === 0 ? null : obj[key];
    } else if (obj[key] === '' || obj[key] === undefined) {
      normalized[key] = null;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      normalized[key] = normalizeToNull(obj[key]);
    } else {
      normalized[key] = obj[key];
    }
  }
  return normalized;
};

// Helper to validate and convert percentile strings to integers
const validateAndConvertPercentile = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const stringValue = String(value).trim();
  if (stringValue === '') {
    return null;
  }

  const numericValue = parseInt(stringValue, 10);

  if (isNaN(numericValue)) {
    throw new Error(`${fieldName} deve ser um número válido`);
  }

  if (numericValue < 0 || numericValue > 100) {
    throw new Error(`${fieldName} deve estar entre 0 e 100`);
  }

  return numericValue;
};

const postPeriodico = async ({ periodicoData, forcar }) => {
  // Normalize all empty/undefined values to null
  const normalizedData = normalizeToNull(periodicoData);

  // Validate and convert percentiles from strings to integers
  try {
    normalizedData.percentilJcr = validateAndConvertPercentile(
      normalizedData.percentilJcr,
      'Percentil JCR'
    );
    normalizedData.percentilScopus = validateAndConvertPercentile(
      normalizedData.percentilScopus,
      'Percentil Scopus'
    );
  } catch (error) {
    Logger.logError(`Erro de validação de periódico: ${error.message}`);
    throw new Error(`Erro de validação: ${error.message}`);
  }

  // The backend expects vinculoSbc (camelCase), so keep it as is
  let endpoint = '/api/periodicos';
  if (forcar) {
    endpoint += `?forcar=${forcar}`;
  }
  console.log('Sending data to API:', normalizedData, ' Endpoint:', endpoint);

  const response = await post(endpoint, normalizedData);

  if (!response.ok) {
    const errorData = await response.text();
    const error = new Error(`HTTP ${response.status}: ${errorData}`);
    error.status = response.status;
    error.response = { status: response.status, data: errorData };
    throw error;
  }

  return response.json();
};

function ValidacaoPeriodicoContent() {
  const { loggedIn } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const areas = useAreas();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });
  const [successInfo, setSuccessInfo] = useState({
    title: '',
    message: '',
    type: 'success',
  });

  // Get periodico data from location state (passed from form)
  const [periodicoData, _] = useState(location.state || null);

  const createPeriodicoMutation = useMutation({
    mutationFn: postPeriodico,
    onSuccess: data => {
      setErrorStatus(null);
      console.log('[BACKEND SUCCESS]', data);
      setSuccessInfo({
        title: 'Periódico Cadastrado',
        message: 'O periódico foi cadastrado com sucesso no sistema.',
        type: 'success',
      });
      setShowSuccessPopup(true);
    },
    onError: error => {
      console.log('[BACKEND ERROR]', error);
      setErrorStatus(error.status || 500);
      // Garante que apenas um popup de erro seja exibido por vez
      if (showErrorPopup) return;

      // Se for erro de rede (failed to fetch), só mostra o popup de erro
      if (error.message && error.message.includes('failed to fetch')) {
        setErrorInfo({
          title: 'Erro',
          message:
            'Erro de conexão com o servidor. Tente novamente mais tarde.',
          type: 'error',
        });
        setShowErrorPopup(true);
        return;
      }

      if (error.status === 409) {
        let similares = [];
        try {
          const json = JSON.parse(error.response.data);
          console.log('[BACKEND 409 BODY]', json);
          similares = json.periodicosSimilares || [];
        } catch {
          console.log('[BACKEND 409 BODY PARSE ERROR]', error.response.data);
          similares = [];
        }
        setErrorInfo(prev => ({
          ...prev,
          title: 'Possível Duplicidade Detectada',
          message:
            'Foram encontrados eventos similares pelo nome. Confira abaixo e escolha se deseja prosseguir ou cancelar.',
          type: 'warning',
          similares,
        }));
        setShowErrorPopup(true);
      } else if (error.status === 500 || error.message.status === 500) {
        setErrorInfo(prev => ({
          ...prev,
          title: 'Erro no Servidor',
          message:
            'Ocorreu um erro ao tentar salvar os dados do periódico. Por favor, tente novamente mais tarde.',
          type: 'error',
        }));
        setShowErrorPopup(true);
        return;
      } else {
        // Extract error message from backend response for other errors
        let errorMessage = 'Erro desconhecido ao processar o cadastro';

        if (error.response?.data) {
          try {
            // Try to parse JSON response and extract the "message" or "error" field
            const errorData = JSON.parse(error.response.data);
            if (error.status === 400 && errorData.error) {
              errorMessage = errorData.error;
            } else {
              errorMessage =
                errorData.message || errorData.error || error.response.data;
            }
          } catch {
            // If parsing fails, use the raw response data
            errorMessage = error.response.data;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        setErrorInfo({
          title: 'Erro!',
          message: errorMessage,
          type: 'error',
        });
        setShowErrorPopup(true);
      }
    },
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorStatus(null);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  useEffect(() => {
    // If no periodico data was passed, redirect back to form
    if (!periodicoData) {
      navigate('/cadastro-periodico');
    }
  }, [periodicoData, navigate]);

  const getAreaName = areaId => {
    const area = areas.find(a => a.value === areaId);
    return area ? area.label : areaId;
  };

  const handleConfirm = () => {
    createPeriodicoMutation.mutate({
      periodicoData: periodicoData,
      userId: loggedIn.id,
    });
  };

  const handleForceConfirm = () => {
    createPeriodicoMutation.mutate({
      periodicoData: periodicoData,
      userId: loggedIn.id,
      forcar: true,
    });
    setShowErrorPopup(false);
  };

  if (!periodicoData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center">Carregando dados do periódico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      
      {!['AUDITOR', 'ADMINISTRADOR', 'PESQUISADOR'].includes(
        loggedIn.userType
      ) ? (
        <SemPermissao />
      ) : (
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
              Revisão do Cadastro de Periódico
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-6">
                {/* Row 1: Nome do Periódico + Área de Conhecimento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">NOME DO PERIÓDICO*</span>
                    <span className="text-gray-900">{periodicoData.nome || 'N/A'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">ÁREA DE CONHECIMENTO (CNPQ)*</span>
                    <span className="text-gray-900">
                      {periodicoData.areasPesquisaIds &&
                      periodicoData.areasPesquisaIds.length > 0
                        ? periodicoData.areasPesquisaIds
                            .map(areaId => getAreaName(areaId))
                            .join(', ')
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Row 2: ISSN + Vínculo com SBC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">ISSN</span>
                    <span className="text-gray-900">{periodicoData.issn || 'N/A'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">VÍNCULO COM A SBC</span>
                    <span className="text-gray-900">{formatVinculoSBC(periodicoData.vinculoSbc) || 'N/A'}</span>
                  </div>
                </div>

                {/* Row 3: Link JCR (full width) */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">LINK DE REPOSITÓRIO (JCR)</span>
                    <span className="text-gray-900">
                      {periodicoData.linkJcr ? (
                        <a
                          href={periodicoData.linkJcr}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {periodicoData.linkJcr}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                </div>

                {/* Row 4: Link Scopus (full width) */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">LINK DE REPOSITÓRIO (SCOPUS)</span>
                    <span className="text-gray-900">
                      {periodicoData.linkScopus ? (
                        <a
                          href={periodicoData.linkScopus}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {periodicoData.linkScopus}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                </div>

                {/* Row 5: Link Google Scholar (full width) */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)</span>
                    <span className="text-gray-900">
                      {periodicoData.linkGoogleScholar ? (
                        <a
                          href={periodicoData.linkGoogleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {periodicoData.linkGoogleScholar}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                </div>

                {/* Row 4: Percentis, H5, Qualis (4 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">PERCENTIL (JCR)</span>
                    <span className="text-gray-900">{periodicoData.percentilJcr || 'N/A'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">PERCENTIL (SCOPUS)</span>
                    <span className="text-gray-900">{periodicoData.percentilScopus || 'N/A'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">H5</span>
                    <span className="text-gray-900">{periodicoData.h5 || 'N/A'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">NOTA NO ANTIGO QUALIS</span>
                    <span className="text-gray-900">
                      {periodicoData.qualisAntigo
                        ? periodicoData.qualisAntigo.toUpperCase()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Row 5: Classificação Base (full width) */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">CLASSIFICAÇÃO BASE</span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatarClassificacaoParaExibicao(periodicoData.classificacao)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleConfirm}
                  disabled={createPeriodicoMutation.isPending}
                  className="btn btn-primary px-8 min-h-12"
                >
                  {createPeriodicoMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Salvando...
                    </>
                  ) : (
                    'Salvar e Continuar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showErrorPopup &&
            (errorStatus === 409 ? (
              <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-8 bg-transparent">
                <div className="flex items-center border-l-8 border-red-700 bg-yellow-100 px-6 py-4 rounded shadow-lg w-[80vw] min-w-[500px] max-w-[900px]">
                  <div className="flex-shrink-0 mr-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-700">
                      <svg
                        className="w-5 h-5 text-yellow-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8.75-3a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V7zm.75 7a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-red-700 font-semibold text-lg">
                      "Cadastro potencialmente duplicado. Continuar mesmo
                      assim?"
                    </span>
                  </div>
                  <div className="flex ml-4 gap-2">
                    <button
                      onClick={closeErrorPopup}
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: '400',
                        background: '#FFD580',
                        color: '#A30000',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '12px 32px',
                        fontSize: '18px',
                        minWidth: '100px',
                      }}
                    >
                      Não
                    </button>
                    <button
                      onClick={handleForceConfirm}
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: '400',
                        background: '#FFD580',
                        color: '#A30000',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '12px 32px',
                        fontSize: '18px',
                        minWidth: '100px',
                      }}
                    >
                      Sim
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-8 bg-transparent">
                <div className="flex items-center border-l-8 border-red-700 bg-yellow-100 px-6 py-4 rounded shadow-lg w-[80vw] min-w-[500px] max-w-[900px]">
                  <div className="flex-shrink-0 mr-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-700">
                      <svg
                        className="w-5 h-5 text-yellow-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8.75-3a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V7zm.75 7a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-red-700 font-semibold text-lg">
                      {errorInfo.message}
                    </span>
                  </div>
                  <div className="flex ml-4 gap-2">
                    <button
                      onClick={closeErrorPopup}
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: '400',
                        background: '#FFD580',
                        color: '#A30000',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '12px 32px',
                        fontSize: '18px',
                        minWidth: '100px',
                      }}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Eventos similares desconectados, abaixo do popup, apenas se erro 409 e houver similares */}
          {errorStatus === 409 && (
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                zIndex: 40,
                fontFamily: 'Poppins',
                fontWeight: '400',
                width: '80vw',
                minWidth: '500px',
                maxWidth: '900px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div className="bg-white border border-red-300 rounded shadow-md p-4 w-full">
                <span className="block text-red-700 font-bold mb-2">
                  Periódicos similares detectados:
                </span>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200">
                    <thead>
                      <tr className="bg-red-100">
                        <th className="px-3 py-2 border-b border-gray-200 text-center text-red-700">
                          Nome
                        </th>
                        <th className="px-3 py-2 border-b border-gray-200 text-center text-red-700">
                          Classificação
                        </th>
                        <th className="px-3 py-2 border-b border-gray-200 text-center text-red-700">
                          Links
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorInfo.similares.map(ev => (
                        <tr
                          key={ev.idVeiculo}
                          className="border-b border-gray-100"
                        >
                          <td className="px-3 py-2 font-semibold text-red-700">
                            {ev.nome}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {ev.classificacao ? (
                              <span className="text-gray-800">
                                {ev.classificacao.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex flex-col gap-1">
                              {ev.linkGoogleScholar && (
                                <a
                                  href={ev.linkGoogleScholar}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                                  title={ev.linkGoogleScholar}
                                >
                                  {ev.linkGoogleScholar}
                                </a>
                              )}
                              {ev.linkJcr && (
                                <a
                                  href={ev.linkJcr}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                                  title={ev.linkJcr}
                                >
                                  {ev.linkJcr}
                                </a>
                              )}
                              {ev.linkScopus && (
                                <a
                                  href={ev.linkScopus}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                                  title={ev.linkScopus}
                                >
                                  {ev.linkScopus}
                                </a>
                              )}
                              {!ev.linkGoogleScholar &&
                                !ev.linkJcr &&
                                !ev.linkScopus && (
                                  <span className="text-gray-400">-</span>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

      <Popup
        isOpen={showSuccessPopup}
        onClose={closeSuccessPopup}
        title={successInfo.title}
        message={successInfo.message}
        type={successInfo.type}
      />
    </div>
  );
}

function ValidacaoPeriodico() {
  return (
    <QueryClientProvider client={queryClient}>
      <ValidacaoPeriodicoContent />
    </QueryClientProvider>
  );
}

export default ValidacaoPeriodico;
