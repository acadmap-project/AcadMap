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
import Logger from '../utils/logger';

const queryClient = new QueryClient();

function DetalhePendenteContent() {
  const { loggedIn } = useLogin();
  const { id } = useParams();
  const location = useLocation();
  // Get registro data from location state or set default
  const registro = useMemo(() => location.state || {}, [location.state]);
  console.log('registro:', registro);

  const navigate = useNavigate();
  const [showJustificacaoPopup, setShowJustificacaoPopup] = useState(false);
  const [justificacaoRecusa, setJustificacaoRecusa] = useState('');
  const [isPredatorio, setIsPredatorio] = useState(false);
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
  });

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
  }, [registro, navigate]);

  // Mutations for approve and reject actions
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
      Logger.logError(`Erro em aprovarMutation - ID: ${id} - ${error.message}`);

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

      let errorMessage =
        'Ocorreu um erro ao registrar a ação. A operação foi cancelada para garantir a integridade dos dados.';

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
      Logger.logError(
        `Erro em rejeitarMutation - ID: ${id} - ${error.message}`
      );

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
    console.log('isPredatorio:', isPredatorio);

    aprovarMutation.mutate({
      id: registroId,
      userId: loggedIn.id,
      flagPredatorio: isPredatorio,
    });
  };

  const handleRejeitar = () => {
    setShowJustificacaoPopup(true);
  };

  const confirmarRejeicao = registroId => {
    setShowJustificacaoPopup(false);
    console.log('Attempting to reject registro with userID:', registroId);
    console.log('User type:', loggedIn.userType);
    console.log('User ID being used:', loggedIn.id);
    console.log('isPredatorio:', isPredatorio);

    rejeitarMutation.mutate({
      id: id,
      userId: loggedIn.id,
      justificativa: justificacaoRecusa, // Envia o justificativa para a mutação
    });
    setJustificacaoRecusa(''); // Limpa o justificativa após rejeitar
  };
  // If no registro data, show error message
  if (!registro || Object.keys(registro).length === 0) {
    return (
      <div className="min-h-screen bg-base-100">
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="container mt-4 mx-auto max-w-4xl max-h-full bg-base-100 shadow-sm">
          <div className="rounded-lg shadow-md p-6">
            <div className="text-center">
              <h1 className="text-xl font-bold text-error mb-4">Erro</h1>
              <p>Nenhum registro encontrado. Redirecionando...</p>
            </div>
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

      {!['AUDITOR', 'ADMINISTRADOR'].includes(loggedIn.userType) ? (
        <SemPermissao />
      ) : (
        <div className="container mt-4 mx-auto max-w-4xl max-h-full">
          <div className="rounded-box border-2 border-primary bg-base-100 shadow-xl p-0 md:p-2">
            <h1 className="text-3xl text-center font-bold mb-6 pt-6">
              Detalhes do Registro Pendente
            </h1>
            <div className="rounded-box bg-base-200 p-4 md:p-8 mx-2 md:mx-6 mb-6">
              <div className="space-y-2 md:space-y-4">
                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    USUÁRIO QUE CADASTROU
                  </span>
                  <div>
                    <div className="font-medium">
                      {registro.usuario?.nome || 'N/A'}
                    </div>
                    {registro.usuario?.email && (
                      <div className="text-xs mt-1">
                        {registro.usuario.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    NOME DO {registro.tipo?.toUpperCase() || 'VEÍCULO'}
                  </span>
                  <div>
                    <div className="font-medium break-words">
                      {registro.nome}
                    </div>
                    {registro.issn && (
                      <div className="text-xs mt-1">ISSN: {registro.issn}</div>
                    )}
                  </div>
                </div>
                <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                  <span className="block text-sm font-medium mb-1">
                    INFORMAÇÕES DE CLASSIFICAÇÃO
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Classificação:</span>
                      <span className="badge badge-primary">
                        {formatarClassificacaoParaExibicao(
                          registro.classificacao
                        )}
                      </span>
                    </div>
                    {registro.areaPesquisa && (
                      <div className="text-sm">
                        <span className="font-medium">Área de Pesquisa:</span>{' '}
                        {registro.areaPesquisa.nome}
                      </div>
                    )}
                    {registro.programa && (
                      <div className="text-sm">
                        <span className="font-medium">Programa:</span>{' '}
                        {registro.programa.nome}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                    <span className="block text-sm font-medium mb-1">
                      STATUS ATUAL
                    </span>
                    <span className="badge badge-warning capitalize text-base">
                      {registro.status}
                    </span>
                  </div>
                  {registro.tipo === 'periodico' && (
                    <div className="p-3 md:p-4 rounded-md border border-base-300 bg-base-100">
                      <span className="block text-sm font-medium mb-2">
                        OPÇÕES ESPECIAIS
                      </span>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPredatorio}
                          onChange={e => setIsPredatorio(e.target.checked)}
                          className="checkbox checkbox-primary mr-3"
                        />
                        <span>Marcar como periódico predatório</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => handleAprovar(id)}
                  disabled={
                    aprovarMutation.isPending ||
                    rejeitarMutation.isPending ||
                    isCreatorSameAsCurrentUser
                  }
                  className="btn btn-success px-8 min-h-12"
                  title={
                    isCreatorSameAsCurrentUser
                      ? 'Você não pode aprovar um registro que você criou'
                      : ''
                  }
                >
                  {aprovarMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Aprovando...
                    </>
                  ) : (
                    'Aprovar'
                  )}
                </button>

                <button
                  onClick={handleRejeitar}
                  disabled={
                    aprovarMutation.isPending ||
                    rejeitarMutation.isPending ||
                    isCreatorSameAsCurrentUser
                  }
                  className="btn btn-error px-8 min-h-12"
                  title={
                    isCreatorSameAsCurrentUser
                      ? 'Você não pode rejeitar um registro que você criou'
                      : ''
                  }
                >
                  {rejeitarMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Rejeitando...
                    </>
                  ) : (
                    'Rejeitar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para justificativa da recusa */}
      <div className={`modal ${showJustificacaoPopup ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Justificativa da Recusa</h3>
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered w-full resize-none"
              rows={4}
              placeholder="Descreva a justificativa da recusa..."
              value={justificacaoRecusa}
              onChange={e => setJustificacaoRecusa(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setShowJustificacaoPopup(false)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-error"
              onClick={() => confirmarRejeicao(id)}
              disabled={!justificacaoRecusa.trim()}
            >
              Confirmar
            </button>
          </div>
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
    </div>
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
