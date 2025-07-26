import { API_URL } from '../utils/apiUrl';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';
import useAreas from '../hooks/useAreas';
import ErrorPopup from '../components/ErrorPopup';
import Popup from '../components/Popup';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import '../styles/App.css';

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

const postPeriodico = async ({ periodicoData, userId }) => {
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
    throw new Error(`Erro de validação: ${error.message}`);
  }

  // The backend expects vinculoSbc (camelCase), so keep it as is
  console.log('Sending data to API:', normalizedData);
  const response = await fetch(`${API_URL}/api/periodicos/`, {
    method: 'POST',
    headers: {
      'X-User-Id': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(normalizedData),
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

function ValidacaoPeriodicoContent() {
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

  // Get periodico data from location state (passed from form)
  const [periodicoData, _] = useState(location.state || null);

  const createPeriodicoMutation = useMutation({
    mutationFn: postPeriodico,
    onSuccess: data => {
      console.log('Periódico cadastrado com sucesso:', data);
      setSuccessInfo({
        title: 'Periódico Cadastrado',
        message: 'O periódico foi cadastrado com sucesso no sistema.',
        type: 'success',
      });
      setShowSuccessPopup(true);
    },
    onError: error => {
      console.error('Erro ao cadastrar periódico:', error);

      // Handle 500 Internal Server Error
      if (error.status === 500) {
        setErrorInfo({
          title: 'Erro no Servidor',
          message:
            'Ocorreu um erro ao tentar salvar os dados do periódico. Por favor, tente novamente mais tarde.',
          type: 'error',
        });
        setShowErrorPopup(true);
        return;
      }

      // Extract error message from backend response for other errors
      let errorMessage = 'Erro desconhecido ao processar o cadastro';

      if (error.response?.data) {
        try {
          // Try to parse JSON response and extract the "message" field
          const errorData = JSON.parse(error.response.data);
          errorMessage =
            errorData.message || errorData.error || error.response.data;
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
    },
  });

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
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
    // Handle confirmation logic here
    console.log('Periodico confirmed:', periodicoData);
    createPeriodicoMutation.mutate({
      periodicoData: periodicoData,
      userId: loggedIn.id,
    });
  };

  if (!periodicoData) {
    return (
      <>
        <HeaderSistema
          userType={loggedIn.userType}
          userName={loggedIn.userName}
        />
        <div className="max-w-4xl mx-auto mt-8 p-6">
          <p className="text-center">Carregando dados do periódico...</p>
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
          <h1 className="mt-8 mb-8">Cadastro de Periódicos</h1>

          <div
            className="flex flex-col gap-4 max-w-2xl mx-auto w-1/2 text-left"
            style={{ fontFamily: 'Poppins', fontWeight: '400' }}
          >
            <div className="text-sm text-gray-900">
              <span className="font-medium">NOME DO PERIÓDICO*:</span>{' '}
              {periodicoData.nome || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ÁREA DE CONHECIMENTO (CNPQ)*:</span>{' '}
              {periodicoData.areasPesquisaIds &&
              periodicoData.areasPesquisaIds.length > 0
                ? periodicoData.areasPesquisaIds
                    .map(areaId => getAreaName(areaId))
                    .join(', ')
                : 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ISSN*:</span>{' '}
              {periodicoData.issn || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">Vínculo com a SBC:</span>{' '}
              {periodicoData.vinculoSbc || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">LINK DE ACESSO*:</span>{' '}
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

            <div className="text-sm text-gray-900">
              <span className="font-medium">LINK DE REPOSITÓRIO (JCR):</span>{' '}
              {periodicoData.linkJcr ? (
                <a
                  href={periodicoData.linkJcr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {periodicoData.linkJcr}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">LINK DE REPOSITÓRIO (SCOPUS):</span>{' '}
              {periodicoData.linkScopus ? (
                <a
                  href={periodicoData.linkScopus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {periodicoData.linkScopus}
                </a>
              ) : (
                ' N/A'
              )}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">PERCENTIL (JCR):</span>{' '}
              {periodicoData.percentilJcr || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">PERCENTIL (SCOPUS):</span>{' '}
              {periodicoData.percentilScopus || 'N/A'}
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium">NOTA NO ANTIGO QUALIS:</span>{' '}
              {periodicoData.qualisAntigo
                ? periodicoData.qualisAntigo.toUpperCase()
                : 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">CLASSIFICAÇÃO BASE:</span>{' '}
              {formatarClassificacaoParaExibicao(periodicoData.classificacao)}
            </div>

            <div className="w-full flex justify-center mt-6">
              <button
                onClick={handleConfirm}
                disabled={createPeriodicoMutation.isPending}
                className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
                style={{ fontFamily: 'Poppins', fontWeight: '400' }}
              >
                {createPeriodicoMutation.isPending
                  ? 'Salvando...'
                  : 'Salvar e Continuar'}
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

function ValidacaoPeriodico() {
  return (
    <QueryClientProvider client={queryClient}>
      <ValidacaoPeriodicoContent />
    </QueryClientProvider>
  );
}

export default ValidacaoPeriodico;
