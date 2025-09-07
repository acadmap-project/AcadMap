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
import { formatVinculoSBC } from '../utils/format';

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
      <div className="min-h-screen bg-base-100">
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="rounded-lg shadow-md p-6">
            <p className="text-center">Carregando dados do periódico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />

      {!['AUDITOR', 'ADMINISTRADOR', 'PESQUISADOR'].includes(
        loggedIn.userType
      ) ? (
        <SemPermissao />
      ) : (
        <div className="container mt-4 mx-auto max-w-6xl max-h-full">
          <div className="rounded-box border-2 border-primary bg-base-100 shadow-xl p-0 md:p-2">
            <h1 className="text-3xl text-center font-bold mb-6 pt-6">
              Revisão do Cadastro de Periódico
            </h1>
            <div className="rounded-box bg-base-200 p-4 md:p-8 mx-2 md:mx-6 mb-6">
              <div className="space-y-2 md:space-y-4">
                {/* Row 1: Nome do Periódico + Área de Conhecimento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      NOME DO PERIÓDICO*
                    </span>
                    <span>{periodicoData.nome || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      ÁREA DE CONHECIMENTO (CNPQ)*
                    </span>
                    <span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">ISSN</span>
                    <span>{periodicoData.issn || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      VÍNCULO COM A SBC
                    </span>
                    <span>
                      {formatVinculoSBC(periodicoData.vinculoSbc, true) ||
                        'N/A'}
                    </span>
                  </div>
                </div>

                {/* Row 3: Link JCR (full width) */}
                <div className="grid grid-cols-1 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DE REPOSITÓRIO (JCR)
                    </span>
                    <span>
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
                <div className="grid grid-cols-1 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DE REPOSITÓRIO (SCOPUS)
                    </span>
                    <span>
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
                <div className="grid grid-cols-1 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
                    </span>
                    <span>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      PERCENTIL (JCR)
                    </span>
                    <span>{periodicoData.percentilJcr || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      PERCENTIL (SCOPUS)
                    </span>
                    <span>{periodicoData.percentilScopus || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">H5</span>
                    <span>{periodicoData.h5 || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      NOTA NO ANTIGO QUALIS
                    </span>
                    <span>
                      {periodicoData.qualisAntigo
                        ? periodicoData.qualisAntigo.toUpperCase()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Row 5: Classificação Base (full width) */}
                <div className="grid grid-cols-1 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      CLASSIFICAÇÃO BASE
                    </span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                      {formatarClassificacaoParaExibicao(
                        periodicoData.classificacao
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 md:mt-8">
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

      {/* Error Modal */}
      {showErrorPopup && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="modal-action mt-0 justify-end">
              <button
                onClick={closeErrorPopup}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </div>

            {/* Alert based on error status */}
            {errorStatus === 409 ? (
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Possível Duplicidade Detectada</h3>
                  <div className="text-sm">
                    Cadastro potencialmente duplicado. Continuar mesmo assim?
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">{errorInfo.title}</h3>
                  <div className="text-sm">{errorInfo.message}</div>
                </div>
              </div>
            )}

            {/* Similar items table for status 409 */}
            {errorStatus === 409 &&
              errorInfo.similares &&
              errorInfo.similares.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-warning">
                    Periódicos similares detectados:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th className="text-center">Nome</th>
                          <th className="text-center">Classificação</th>
                          <th className="text-center">Links</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errorInfo.similares.map(ev => (
                          <tr key={ev.idVeiculo}>
                            <td className="font-semibold">{ev.nome}</td>
                            <td className="text-center">
                              {ev.classificacao ? (
                                <div className="badge badge-outline">
                                  {ev.classificacao.toUpperCase()}
                                </div>
                              ) : (
                                <span className="text-base-content/60">-</span>
                              )}
                            </td>
                            <td className="text-center">
                              <div className="flex flex-col gap-1">
                                {ev.linkGoogleScholar && (
                                  <a
                                    href={ev.linkGoogleScholar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link link-primary text-xs truncate max-w-xs"
                                    title={ev.linkGoogleScholar}
                                  >
                                    Google Scholar
                                  </a>
                                )}
                                {ev.linkJcr && (
                                  <a
                                    href={ev.linkJcr}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link link-primary text-xs truncate max-w-xs"
                                    title={ev.linkJcr}
                                  >
                                    JCR
                                  </a>
                                )}
                                {ev.linkScopus && (
                                  <a
                                    href={ev.linkScopus}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link link-primary text-xs truncate max-w-xs"
                                    title={ev.linkScopus}
                                  >
                                    Scopus
                                  </a>
                                )}
                                {!ev.linkGoogleScholar &&
                                  !ev.linkJcr &&
                                  !ev.linkScopus && (
                                    <span className="text-base-content/60">
                                      -
                                    </span>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Action buttons */}
            <div className="modal-action">
              {errorStatus === 409 ? (
                <>
                  <button onClick={closeErrorPopup} className="btn btn-outline">
                    Cancelar
                  </button>
                  <button
                    onClick={handleForceConfirm}
                    className="btn btn-warning"
                  >
                    Continuar mesmo assim
                  </button>
                </>
              ) : (
                <button onClick={closeErrorPopup} className="btn btn-primary">
                  Fechar
                </button>
              )}
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
