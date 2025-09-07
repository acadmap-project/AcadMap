import { post } from '../utils/authFetch';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';
import useAreas from '../hooks/useAreas';
import ErrorPopup from '../components/ErrorPopup';
import Popup from '../components/Popup';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import '../styles/App.css';

const queryClient = new QueryClient();

const postEvent = async ({ eventData, forcar }) => {
  console.log(eventData);
  let endpoint = '/api/eventos';
  if (forcar) {
    endpoint += '?forcar=true';
  }

  const response = await post(endpoint, eventData);

  if (!response.ok) {
    const errorData = await response.text();
    const error = new Error(`HTTP ${response.status}: ${errorData}`);
    error.status = response.status;
    error.response = { status: response.status, data: errorData };
    throw error;
  }

  return response.json();
};

function RevisaoCadastroEventoContent() {
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

  // Get event data from location state (passed from form)
  const [eventData, _] = useState(location.state?.eventData || null);

  const createEventMutation = useMutation({
    mutationFn: postEvent,
    onSuccess: data => {
      console.log('[BACKEND SUCCESS]', data);
      setErrorStatus(null);
      setSuccessInfo({
        title: `Evento ${eventData.nome} registrado com sucesso! O cadastro agora aguarda a validação de um auditor.`,
        message: 'O evento foi cadastrado no sistema com sucesso.',
        type: 'success',
      });
      setShowSuccessPopup(true);
    },
    onError: error => {
      console.log('[BACKEND ERROR]', error);
      setErrorStatus(error.status || 500);
      // Garante que apenas um popup de erro seja exibido por vez
      if (showErrorPopup) return;

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
            'Ocorreu um erro ao tentar salvar os dados do evento. Por favor, tente novamente mais tarde.',
          type: 'error',
        }));
        setShowErrorPopup(true);
        return;
      } else {
        setErrorInfo(prev => ({
          ...prev,
          title: 'Erro ao Cadastrar Evento',
          message:
            'Ocorreu um erro ao finalizar o cadastro, por favor, tente confirmar o registro novamente mais tarde.',
          type: 'error',
        }));
        setShowErrorPopup(true);
      }
    },
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorStatus(null);
    setErrorInfo({ title: '', message: '', type: 'error', similares: [] });
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/');
  };

  useEffect(() => {
    // If no event data was passed, redirect back to form
    if (!eventData) {
      navigate('/cadastro-evento');
    }
  }, [eventData, navigate]);

  const formatVinculoSbc = vinculo => {
    if (typeof vinculo === 'boolean') {
      return vinculo ? 'Sim' : 'Não';
    }
    const vinculoMap = {
      sem_vinculo: 'Sem vínculo',
      vinculo_comum: 'Comum',
      vinculo_top_20: 'Top 20',
      vinculo_top_10: 'Top 10',
    };
    return vinculoMap[vinculo] || vinculo;
  };

  const getAreaName = areaId => {
    const area = areas.find(a => a.value === areaId);
    return area ? area.label : areaId;
  };
  const handleConfirm = () => {
    createEventMutation.mutate({
      eventData: eventData,
      userId: loggedIn.id,
    });
  };

  const handleForceConfirm = () => {
    // Tenta cadastro forçado
    createEventMutation.mutate({
      eventData: eventData,
      userId: loggedIn.id,
      forcar: true,
    });
    closeErrorPopup();
  };

  if (!eventData) {
    return (
      <div className="min-h-screen">
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="container mt-4 mx-auto max-w-4xl max-h-full bg-base-100 shadow-sm">
          <div className="rounded-lg shadow-md p-6">
            <p className="text-center">Carregando dados do evento...</p>
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
        <div className="container mt-4 mx-auto max-w-4xl max-h-full">
          <div className="rounded-box border-2 border-primary bg-base-100 shadow-xl p-0 md:p-2">
            <h1 className="text-3xl text-center font-bold mb-6 pt-6">
              Revisão do Cadastro de Evento
            </h1>
            <div className="rounded-box bg-base-200 p-4 md:p-8 mx-2 md:mx-6 mb-6">
              <div className="space-y-2 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      NOME DO EVENTO*
                    </span>
                    <span>{eventData.nome || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      ÁREA DE CONHECIMENTO (CNPQ)*
                    </span>
                    <span>
                      {eventData.areasPesquisaIds &&
                      eventData.areasPesquisaIds.length > 0
                        ? eventData.areasPesquisaIds
                            .map(areaId => getAreaName(areaId))
                            .join(', ')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      ÍNDICE H5
                    </span>
                    <span>{eventData.h5 || 'N/A'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      VÍNCULO COM A SBC
                    </span>
                    <span>{formatVinculoSbc(eventData.vinculoSbc)}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
                    </span>
                    <span>
                      {eventData.linkGoogleScholar ? (
                        <a
                          href={eventData.linkGoogleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {eventData.linkGoogleScholar}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      LINK DE REPOSITÓRIO (SOL-SBC)
                    </span>
                    <span>
                      {eventData.linkSolSbc ? (
                        <a
                          href={eventData.linkSolSbc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {eventData.linkSolSbc}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100 md:col-span-2">
                    <span className="block text-sm font-medium mb-1">
                      CLASSIFICAÇÃO BASE
                    </span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                      {eventData.classificacao
                        ? eventData.classificacao.toUpperCase()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-6 md:mt-8">
                  <button
                    onClick={handleConfirm}
                    disabled={createEventMutation.isPending}
                    className="btn btn-primary px-8 min-h-12"
                  >
                    {createEventMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Salvando...
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </button>
                </div>
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
                    Eventos similares detectados:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th className="text-center">Nome</th>
                          <th className="text-center">Classificação</th>
                          <th className="text-center">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errorInfo.similares.map(ev => (
                          <tr key={ev.idVeiculo}>
                            <td className="font-semibold text-center">
                              {ev.nome}
                            </td>
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
                              {ev.linkGoogleScholar ? (
                                <a
                                  href={ev.linkGoogleScholar}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="link link-primary text-xs truncate max-w-xs"
                                  title={ev.linkGoogleScholar}
                                >
                                  Google Scholar
                                </a>
                              ) : (
                                <span className="text-base-content/60">-</span>
                              )}
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

function RevisaoCadastroEvento() {
  return (
    <QueryClientProvider client={queryClient}>
      <RevisaoCadastroEventoContent />
    </QueryClientProvider>
  );
}

export default RevisaoCadastroEvento;
