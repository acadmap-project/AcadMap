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
      <div className="min-h-screen bg-gray-100">
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center">Carregando dados do evento...</p>
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
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
              Revisão do Cadastro de Evento
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">NOME DO EVENTO*</span>
                    <span className="text-gray-900">{eventData.nome || 'N/A'}</span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">ÁREA DE CONHECIMENTO (CNPQ)*</span>
                    <span className="text-gray-900">
                      {eventData.areasPesquisaIds &&
                      eventData.areasPesquisaIds.length > 0
                        ? eventData.areasPesquisaIds
                            .map(areaId => getAreaName(areaId))
                            .join(', ')
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">ÍNDICE H5</span>
                    <span className="text-gray-900">{eventData.h5 || 'N/A'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">VÍNCULO COM A SBC</span>
                    <span className="text-gray-900">{formatVinculoSbc(eventData.vinculoSbc)}</span>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)</span>
                    <span className="text-gray-900">
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

                  <div className="bg-white p-4 rounded-md">
                    <span className="block text-sm font-medium text-gray-700 mb-1">LINK DE REPOSITÓRIO (SOL-SBC)</span>
                    <span className="text-gray-900">
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

                  <div className="bg-white p-4 rounded-md md:col-span-2">
                    <span className="block text-sm font-medium text-gray-700 mb-1">CLASSIFICAÇÃO BASE</span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {eventData.classificacao
                        ? eventData.classificacao.toUpperCase()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
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
          {errorStatus == 409 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
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
                  Eventos similares detectados:
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
                          Link
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorInfo.similares.map(ev => (
                        <tr
                          key={ev.idVeiculo}
                          className="border-b border-gray-100"
                        >
                          <td className="px-3 py-2 font-semibold text-red-700 text-center">
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
                            {ev.linkGoogleScholar ? (
                              <a
                                href={ev.linkGoogleScholar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                                title={ev.linkGoogleScholar}
                              >
                                {ev.linkGoogleScholar}
                              </a>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
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

function RevisaoCadastroEvento() {
  return (
    <QueryClientProvider client={queryClient}>
      <RevisaoCadastroEventoContent />
    </QueryClientProvider>
  );
}

export default RevisaoCadastroEvento;
