import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import useAreas from '../hooks/useAreas';
import '../styles/App.css';

function RevisaoCadastroEvento() {
  const { loggedIn } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const areas = useAreas();

  // Get event data from location state (passed from form)
  const [eventData, _] = useState(location.state?.eventData || null);

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
    return vinculo === 'sem_vinculo' ? 'Sem vínculo' : vinculo;
  };

  const formatStatus = status => {
    const statusMap = {
      pendente: 'Pendente',
      aprovado: 'Aprovado',
      rejeitado: 'Rejeitado',
    };
    return statusMap[status] || status;
  };

  const formatTipo = tipo => {
    const tipoMap = {
      evento: 'Evento',
      periodico: 'Periódico',
    };
    return tipoMap[tipo] || tipo;
  };

  const getAreaName = areaId => {
    const area = areas.find(a => a.value === areaId);
    return area ? area.label : areaId;
  };

  const handleGoBack = () => {
    navigate('/cadastro-evento');
  };

  const handleConfirm = () => {
    // Handle confirmation logic here
    console.log('Event confirmed:', eventData);
    // You could navigate to a success page or dashboard
    navigate('/');
  };

  if (!eventData) {
    return (
      <>
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="max-w-4xl mx-auto mt-8 p-6">
          <p className="text-white text-center">
            Carregando dados do evento...
          </p>
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
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Revisão do Cadastro de Evento
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
            Dados do Evento Registrado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  ID do Evento
                </label>
                <p className="text-white bg-gray-700 rounded p-2 text-sm font-mono">
                  {eventData.idVeiculo || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Evento
                </label>
                <p className="text-white bg-gray-700 rounded p-2">
                  {eventData.nome || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Índice H5
                </label>
                <p className="text-white bg-gray-700 rounded p-2">
                  {eventData.h5 || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Vínculo SBC
                </label>
                <p className="text-white bg-gray-700 rounded p-2">
                  {formatVinculoSbc(eventData.vinculoSbc)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <p className="text-white bg-gray-700 rounded p-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      eventData.status === 'pendente'
                        ? 'bg-yellow-600'
                        : eventData.status === 'aprovado'
                          ? 'bg-green-600'
                          : eventData.status === 'rejeitado'
                            ? 'bg-red-600'
                            : 'bg-gray-600'
                    }`}
                  >
                    {formatStatus(eventData.status)}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo
                </label>
                <p className="text-white bg-gray-700 rounded p-2">
                  {formatTipo(eventData.tipo)}
                </p>
              </div>
            </div>

            {/* Links and Areas */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Link do Evento
                </label>
                <p className="text-white bg-gray-700 rounded p-2 break-all">
                  {eventData.linkEvento ? (
                    <a
                      href={eventData.linkEvento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {eventData.linkEvento}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Link Google Scholar
                </label>
                <p className="text-white bg-gray-700 rounded p-2 break-all">
                  {eventData.linkGoogleScholar ? (
                    <a
                      href={eventData.linkGoogleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {eventData.linkGoogleScholar}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Link SOL-SBC
                </label>
                <p className="text-white bg-gray-700 rounded p-2 break-all">
                  {eventData.linkSolSbc ? (
                    <a
                      href={eventData.linkSolSbc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {eventData.linkSolSbc}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Áreas de Pesquisa
                </label>
                <div className="bg-gray-700 rounded p-2">
                  {eventData.areasPesquisaIds &&
                  eventData.areasPesquisaIds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {eventData.areasPesquisaIds.map((areaId, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          {getAreaName(areaId)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white">Nenhuma área selecionada</p>
                  )}
                </div>
              </div>

              {/* User Information */}
              {eventData.usuario && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Usuário Responsável
                  </label>
                  <div className="bg-gray-700 rounded p-2">
                    <p className="text-white font-medium">
                      {eventData.usuario.nome}
                    </p>
                    <p className="text-gray-300 text-sm font-mono">
                      ID: {eventData.usuario.idUsuario}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Classification and Adequacy (if available) */}
          {(eventData.classificacao || eventData.adequadoDefesa) && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">
                Informações Adicionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventData.classificacao && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Classificação
                    </label>
                    <p className="text-white bg-gray-700 rounded p-2">
                      {eventData.classificacao}
                    </p>
                  </div>
                )}
                {eventData.adequadoDefesa && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Adequação para Defesa
                    </label>
                    <p className="text-white bg-gray-700 rounded p-2">
                      {eventData.adequadoDefesa}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Data (for debugging) */}
          <div className="mt-6 pt-6 border-t border-gray-600">
            <details className="mb-4">
              <summary className="text-gray-300 cursor-pointer hover:text-white">
                Ver dados brutos da resposta (JSON)
              </summary>
              <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(eventData, null, 2)}
              </pre>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-600">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Voltar ao Formulário
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Confirmar e Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RevisaoCadastroEvento;
