import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';
import {
  useQuery
} from '@tanstack/react-query';
import '../styles/App.css';


const fetcheventoData = async (id) => {
  const response = await fetch(`http://localhost:8080/api/eventos/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do periódico');
  }
  return await response.json();
}

const VisualizarPeriodico = () => {
  const { loggedIn } = useLogin();
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: eventoData, isLoading, isError } = useQuery({
    queryKey: ['periodico', id],
    queryFn: () => fetcheventoData(id),
  })

  useEffect(() => {
    console.log('Dados do periódico:', eventoData);
  }, [eventoData])

  return (
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      {eventoData &&
        <>
          <h1 className="mt-8 mb-8">Cadastro de Eventos e Periódicos</h1>

          <div className='rounded-xl border-2 w-xs mx-auto text-xl p-2 mb-12'>
            Dados completos do Evento {eventoData.nome}
          </div>

          <div
            className="flex flex-col gap-4 max-w-2xl mx-auto w-1/2 text-left"
            style={{ fontFamily: 'Poppins', fontWeight: '400' }}
          >
            <div className="text-sm text-gray-900">
              <span className="font-medium">NOME DO PERIÓDICO:</span>{' '}
              {eventoData.nome || 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ÍNDICE H5:</span>{' '}
              {eventoData.h5 || 'N/A'}
            </div>


            <div className="text-sm text-gray-900">
              <span className="font-medium">ÁREA DE CONHECIMENTO (CNPQ):</span>{' '}
              {eventoData.areasPesquisas && eventoData.areasPesquisas.length > 0
                ? eventoData.areasPesquisas
                  .join(', ')
                : 'N/A'}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">VÍNCULO COM A SBC:</span>{' '}
              {eventoData.vinculoSbc || 'N/A'}
            </div>

            {
              eventoData.linkSolSbc &&
              <div className="text-sm text-gray-900">
                <span className="font-medium">LINK DO SOL-SBC:</span>{' '}
                {eventoData.linkSolSbc}
              </div>
            }

            {eventoData.linkGoogleScholar &&
              <div className="text-sm text-gray-900">
                <span className="font-medium">
                  LINK DO GOOGLE SCHOLAR:
                </span>{' '}
                <a
                  href={eventoData.linkGoogleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  {eventoData.linkGoogleScholar}
                </a>
              </div>
            }

            <div className="text-sm text-gray-900">
              <span className="font-medium">CLASSIFICAÇÃO FINAL:</span>{' '}
              {formatarClassificacaoParaExibicao(eventoData.classificacao)}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">ADEQUAÇÃO PARA DEFESAS ACADÊMCIAS (MESTRADO E/OU DOUTORADO):</span>{' '}
              {eventoData.adequacaoDefesa.toUpperCase()}
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-medium">INDICAÇÃO SE É PREDATÓRIO:</span>{' '}
              {eventoData.flagPredatorio ? 'Sim' : 'Não'}
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
      }
    </>
  )
}

export default VisualizarPeriodico;
