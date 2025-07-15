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

const postEvent = async ({ eventData, userId }) => {
  console.log(eventData);
  const response = await fetch('http://localhost:8080/api/eventos/cadastro', {
    method: 'POST',
    headers: {
      'X-User-Id': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

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
      console.log('Api utilizada com sucesso:', data);
      setSuccessInfo({
        title: `Evento ${eventData.nome} registrado com sucesso! O cadastro agora aguarda a validação de um auditor.`,
        message: 'O evento foi cadastrado no sistema com sucesso.',
        type: 'success',
      });
      setShowSuccessPopup(true);
    },
    onError: error => {
      console.error('Endpoint para cadastrar evento com erro:', error);

      // Handle 500 Internal Server Error
      if (error.status === 500 || error.message.status === 500) {
        setErrorInfo({
          title: 'Erro no Servidor',
          message:
            'Ocorreu um erro ao tentar salvar os dados do evento. Por favor, tente novamente mais tarde.',
          type: 'error',
        });
        setShowErrorPopup(true);
      }
      // Handle 409 Conflict error
      else if (error.status === 409) {
        setErrorInfo({
          title: 'Evento Já Existe',
          message:
            'Um evento com este nome já foi cadastrado no sistema. Por favor, verifique se não é um evento duplicado ou altere o nome do evento.',
          type: 'warning',
        });
        setShowErrorPopup(true);
      } else {
        // Handle other errors
        setErrorInfo({
          title: 'Erro ao Cadastrar Evento',
          message:
            'Ocorreu um erro ao finalizar o cadastro, por favor, tente confirmar o registro novamente mais tarde.',
          type: 'error',
        });
        setShowErrorPopup(true);
      }
    },
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
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
    // Handle confirmation logic here
    console.log('Event confirmed:', eventData);
    createEventMutation.mutate({
      eventData: eventData,
      userId: loggedIn.id,
    });
  };

  if (!eventData) {
    return (
      <>
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="max-w-4xl mx-auto mt-8 p-6">
          <p className="text-center">Carregando dados do evento...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      {!['AUDITOR', 'ADMINISTRADOR', 'PESQUISADOR'].includes(
        loggedIn.userType
      ) ? (
        <SemPermissao />
      ) : (
        <>
          <h1 className="mt-8 mb-25">Cadastro de Evento</h1>

          <div
            className="flex flex-col gap-4 max-w-2xl mx-auto w-1/2 text-left"
            style={{ fontFamily: 'Poppins', fontWeight: '400' }}
          >
            <div className="text-sm text-gray-900">
              <span className="font-medium">NOME DO EVENTO*:</span>{' '}
              {eventData.nome || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ÁREA DE CONHECIMENTO (CNPQ)*:</span>{' '}
              {eventData.areasPesquisaIds &&
              eventData.areasPesquisaIds.length > 0
                ? eventData.areasPesquisaIds
                    .map(areaId => getAreaName(areaId))
                    .join(', ')
                : 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ÍNDICE H5*:</span>{' '}
              {eventData.h5 || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">VÍNCULO COM A SBC:</span>{' '}
              {formatVinculoSbc(eventData.vinculoSbc)}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">LINK DE ACESSO*:</span>{' '}
              {eventData.linkEvento ? (
                <a
                  href={eventData.linkEvento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {eventData.linkEvento}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">
                LINK DE REPOSITÓRIO (GOOGLE SCHOLAR):
              </span>{' '}
              {eventData.linkGoogleScholar ? (
                <a
                  href={eventData.linkGoogleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {eventData.linkGoogleScholar}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">
                LINK DE REPOSITÓRIO (SOL-SBC):
              </span>{' '}
              {eventData.linkSolSbc ? (
                <a
                  href={eventData.linkSolSbc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {eventData.linkSolSbc}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">CLASSIFICAÇÃO BASE:</span>{' '}
              {eventData.classificacao
                ? eventData.classificacao.toUpperCase()
                : 'N/A'}
            </div>
            <div className="w-full flex justify-center mt-6">
              <button
                onClick={handleConfirm}
                disabled={createEventMutation.isPending}
                className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
                style={{ fontFamily: 'Poppins', fontWeight: '400' }}
              >
                {createEventMutation.isPending ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>

          <ErrorPopup
            isOpen={showErrorPopup}
            onClose={closeErrorPopup}
            title={errorInfo.title}
            message={errorInfo.message}
            type={errorInfo.type}
          />

          <Popup
            isOpen={showSuccessPopup}
            onClose={closeSuccessPopup}
            title={successInfo.title}
            message={successInfo.message}
            type={successInfo.type}
          />
        </>
      )}
    </>
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
