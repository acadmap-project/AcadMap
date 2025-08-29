import '../styles/App.css';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';
import { useNavigate } from 'react-router-dom';
import usePendencias from '../hooks/usePendencias';
import { formatarClassificacaoParaExibicao } from '../utils/classificacaoBase';

function RegistrosPendentes() {
  /*
        Página de registros pendentes.
        Busca e exibe lista de veículos (eventos e periódicos) pendentes da API.
    */
  const { loggedIn } = useLogin();
  const navigate = useNavigate();

  const { pendencias } = usePendencias();
  const handleRowClick = registro => {
    navigate(`/pendente/${registro.idVeiculo}`, { state: registro });
  };

  return (
    <div className="bg-gray-100">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      
      {!['AUDITOR', 'ADMINISTRADOR'].includes(loggedIn.userType) ? (
        <SemPermissao />
      ) : (
        <div className="container mx-auto max-w-6xl py-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
              Gerenciador de Cadastros Pendentes
            </h1>
            
            {pendencias.length === 0 ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">
                    Nenhum registro pendente encontrado.
                  </p>
                  <p className="text-sm text-gray-500">
                    Todos os cadastros foram processados.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-hidden">
                  <table className="table table-zebra">
                    <thead>
                      <tr className="bg-base-200">
                        <th className="text-left font-medium">Nome do Veículo</th>
                        <th className="text-center font-medium">Tipo</th>
                        <th className="text-center font-medium">Classificação</th>
                        <th className="text-center font-medium">Usuário</th>
                        <th className="text-center font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendencias.map(registro => (
                        <tr
                          key={registro.idVeiculo}
                          onClick={() => handleRowClick(registro)}
                          className="cursor-pointer hover:bg-base-200 transition-colors"
                        >
                          <td className="font-medium">
                            {registro.nome.length > 50 
                              ? `${registro.nome.substring(0, 47)}...` 
                              : registro.nome}
                          </td>
                          <td className="text-center">
                            <span className="badge badge-outline capitalize">
                              {registro.tipo}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge badge-primary">
                              {formatarClassificacaoParaExibicao(registro.classificacao)}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="flex flex-col">
                              <span className="font-medium">{registro.usuario?.nome || 'N/A'}</span>
                              <span className="text-xs text-gray-500">
                                {registro.usuario?.email || ''}
                              </span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge badge-warning capitalize">
                              {registro.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrosPendentes;
