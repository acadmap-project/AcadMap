import '../styles/App.css';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';
import usePendencias from '../hooks/usePendencias';
import ErrorPopup from '../components/ErrorPopup';
import Popup from '../components/Popup';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

function DetalhePendenteContent() {
  const { loggedIn } = useLogin();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMotivoPopup, setShowMotivoPopup] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const { negarPendencias, aprovarPendencias } = usePendencias();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    type: 'error',
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successInfo, setSuccessInfo] = useState({
    title: '',
    message: '',
    type: 'success',
  }); // Get registro data from location state or set default
  const registro = useMemo(() => location.state || {}, [location.state]);

  // Check if current user is the same as the registro creator
  const isCreatorSameAsCurrentUser =
    registro.usuario?.idUsuario === loggedIn.id;

  // Show error popup if user tries to approve/reject their own registro
  useEffect(() => {
    if (isCreatorSameAsCurrentUser && registro.usuario?.idUsuario) {
      setErrorInfo({
        title: 'Ação Não Permitida',
        message:
          'Você não pode aprovar ou rejeitar um registro que você mesmo criou.',
        type: 'warning',
      });
      setShowErrorPopup(true);
    }
  }, [isCreatorSameAsCurrentUser, registro.usuario?.idUsuario]);
  // Redirect if no registro data
  useEffect(() => {
    if (!registro || Object.keys(registro).length === 0) {
      setTimeout(() => {
        navigate('/registros-pendentes');
      }, 3000);
    }
  }, [registro, navigate]); // Mutations for approve and reject actions
  const aprovarMutation = useMutation({
    mutationFn: aprovarPendencias,
    onSuccess: () => {
      setSuccessInfo({
        title: 'Sucesso',
        message: 'Registro aprovado com sucesso!',
        type: 'success',
      });
      setShowSuccessPopup(true);
      // Navigate back to pendencias list after 2 seconds
      setTimeout(() => {
        navigate('/registros-pendentes');
      }, 2000);
    },
    onError: error => {
      console.error('Error in aprovarMutation:', error);

      // Treat 500 as success (backend quirk)
      if (error.response?.status === 500) {
        setSuccessInfo({
          title: 'Sucesso',
          message: 'Registro aprovado com sucesso!',
          type: 'success',
        });
        setShowSuccessPopup(true);
        // Navigate back to pendencias list after 2 seconds
        setTimeout(() => {
          navigate('/registros-pendentes');
        }, 2000);
        return;
      }

      let errorMessage = 'Erro ao aprovar registro';

      if (error.response?.status === 405) {
        errorMessage = 'Não foi possível aprovar este registro.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrorInfo({
        title: 'Erro',
        message: errorMessage,
        type: 'error',
      });
      setShowErrorPopup(true);
    },
  });

  const rejeitarMutation = useMutation({
    mutationFn: negarPendencias,
    onSuccess: () => {
      setSuccessInfo({
        title: 'Sucesso',
        message: 'Registro rejeitado com sucesso!',
        type: 'success',
      });
      setShowSuccessPopup(true);
      // Navigate back to pendencias list after 2 seconds
      setTimeout(() => {
        navigate('/registros-pendentes');
      }, 2000);
    },
    onError: error => {
      console.error('Error in rejeitarMutation:', error);

      // Treat 500 as success (backend quirk)
      if (error.response?.status === 500) {
        setSuccessInfo({
          title: 'Sucesso',
          message: 'Registro rejeitado com sucesso!',
          type: 'success',
        });
        setShowSuccessPopup(true);
        // Navigate back to pendencias list after 2 seconds
        setTimeout(() => {
          navigate('/registros-pendentes');
        }, 2000);
        return;
      }

      let errorMessage = 'Erro ao rejeitar registro';

      if (error.response?.status === 405) {
        errorMessage = 'Não foi possível rejeitar este registro.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrorInfo({
        title: 'Erro',
        message: errorMessage,
        type: 'error',
      });
      setShowErrorPopup(true);
    },
  });
  const handleAprovar = registroId => {
    console.log('Attempting to approve registro with userID:', registroId);
    console.log('User type:', loggedIn.userType);
    console.log('User ID being used:', loggedIn.id);

    aprovarMutation.mutate({
      id: registroId,
      userId: loggedIn.id,
    });
  };

  const handleRejeitar = registroId => {
    setShowMotivoPopup(true)
    console.log('Attempting to reject registro with userID:', registroId);
    console.log('User type:', loggedIn.userType);
    console.log('User ID being used:', loggedIn.id);

    rejeitarMutation.mutate({
      id: registroId,
      userId: loggedIn.id,
    });
  };

  const confirmarRejeicao = () => {
    setShowMotivoPopup(false);
    rejeitarMutation.mutate({
      id: id,
      userId: loggedIn.id,
      motivo: motivoRecusa,  // Envia o motivo para a mutação
    });
    setMotivoRecusa(''); // Limpa o motivo após rejeitar
  };
  // If no registro data, show error message
  if (!registro || Object.keys(registro).length === 0) {
    return (
      <>
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="mt-8 text-center">
          <h1 className="text-xl font-bold text-red-600">Erro</h1>
          <p className="mt-4">Nenhum registro encontrado. Redirecionando...</p>
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
      {!['AUDITOR', 'ADMINISTRADOR'].includes(loggedIn.userType) ? (
        <SemPermissao />
      ) : (
        <>
          <h1 className="mt-8 mb-25">Detalhes do Registro Pendente</h1>
          <div
            className="flex flex-col gap-4 max-w-2xl mx-auto w-1/2 text-left"
            style={{ fontFamily: 'Poppins', fontWeight: '400' }}
          >
            <div className="text-sm text-gray-900">
              <span className="font-medium">
                NOME DO USUÁRIO QUE CADASTROU:
              </span>{' '}
              {registro.usuario?.nome || 'N/A'}
              {registro.usuario?.email && (
                <div className="text-xs text-gray-600 mt-1">
                  {registro.usuario.email}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium">
                NOME DO {registro.tipo?.toUpperCase() || 'VEÍCULO'}:
              </span>{' '}
              {registro.nome}
              {registro.issn && (
                <div className="text-xs text-gray-600 mt-1">
                  ISSN: {registro.issn}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium">
                CÁLCULO PARA VERIFICAÇÃO DE ÍNDICE:
              </span>{' '}
              <div className="mt-1">
                <div>
                  Classificação:{' '}
                  {registro.tipo == 'periodico'
                    ? formatarClassificacaoParaExibicao(registro.classificacao)
                    : registro.classificacao}
                </div>
                {registro.areaPesquisa && (
                  <div>Área de Pesquisa: {registro.areaPesquisa.nome}</div>
                )}
                {registro.programa && (
                  <div>Programa: {registro.programa.nome}</div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium">LINK DE ACESSO:</span>{' '}
              {registro.linkEvento ? (
                <a
                  href={registro.linkEvento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {registro.linkEvento}
                </a>
              ) : (
                ' N/A'
              )}
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium">STATUS ATUAL:</span>{' '}
              {registro.status}
            </div>{' '}
            <div className="w-full flex justify-center mt-6 gap-4">
              <button
                onClick={() => handleAprovar(id)}
                disabled={
                  aprovarMutation.isPending ||
                  rejeitarMutation.isPending ||
                  isCreatorSameAsCurrentUser
                }
                className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-green-500 focus:!ring-opacity-50 disabled:!opacity-50"
                style={{ fontFamily: 'Poppins', fontWeight: '400' }}
                title={
                  isCreatorSameAsCurrentUser
                    ? 'Você não pode aprovar um registro que você criou'
                    : ''
                }
              >
                {aprovarMutation.isPending ? 'Aprovando...' : 'Aprovar'}
              </button>

              <button
                onClick={() => handleRejeitar(id)}
                disabled={
                  aprovarMutation.isPending ||
                  rejeitarMutation.isPending ||
                  isCreatorSameAsCurrentUser
                }
                className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-red-500 focus:!ring-opacity-50 disabled:!opacity-50"
                style={{ fontFamily: 'Poppins', fontWeight: '400' }}
                title={
                  isCreatorSameAsCurrentUser
                    ? 'Você não pode rejeitar um registro que você criou'
                    : ''
                }
              >
                {rejeitarMutation.isPending ? 'Rejeitando...' : 'Rejeitar'}
              </button>
              {/* Popup para motivo da recusa */}
              {showMotivoPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">Motivo da recusa</h2>
                    <textarea
                      className="w-full border border-gray-300 rounded p-2 mb-4"
                      rows={4}
                      placeholder="Descreva o motivo da recusa..."
                      value={motivoRecusa}
                      onChange={e => setMotivoRecusa(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() => setShowMotivoPopup(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded"
                        onClick={confirmarRejeicao}
                        disabled={!motivoRecusa.trim()}
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ErrorPopup
            isOpen={showErrorPopup}
            onClose={() => setShowErrorPopup(false)}
            title={errorInfo.title}
            message={errorInfo.message}
            type={errorInfo.type}
          />
          <Popup
            isOpen={showSuccessPopup}
            onClose={() => setShowSuccessPopup(false)}
            title={successInfo.title}
            message={successInfo.message}
            type={successInfo.type}
          />
        </>
      )}
    </>
  );
}

function DetalhePendente() {
  return (
    <QueryClientProvider client={queryClient}>
      <DetalhePendenteContent />
    </QueryClientProvider>
  );
}

export default DetalhePendente;
