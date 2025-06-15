import '../styles/App.css';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import { useNavigate } from 'react-router-dom';
import usePendencias from '../hooks/usePendencias';

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
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      <h1 className="mt-4">Gerenciador de Cadastros Pendentes</h1>
      {pendencias.length === 0 ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-lg text-gray-600">
            Nenhum registro pendente encontrado.
          </p>
        </div>
      ) : (
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto border border-black rounded overflow-hidden">
            <div className="overflow-x-auto">
              <div className="max-h-[70vh] overflow-y-auto">
                <table className="min-w-full text-black">
                  <thead className="bg-black text-white text-sm sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 border-r border-black text-center w-1/3">
                        Nome do Veículo de Publicação
                      </th>
                      <th className="px-4 py-3 border-r border-black text-center w-1/6">
                        Tipo
                      </th>
                      <th className="px-4 py-3 border-r border-black text-center w-1/6">
                        Classificação
                      </th>
                      <th className="px-4 py-3 border-r border-black text-center w-1/4">
                        Usuário
                      </th>
                      <th className="px-4 py-3 text-center w-1/6">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendencias.map(registro => (
                      <tr
                        key={registro.idVeiculo}
                        onClick={() => handleRowClick(registro)}
                        className="cursor-pointer hover:bg-gray-100 text-sm transition"
                      >
                        <td className="px-4 py-3 border-t border-black">
                          {registro.nome}
                        </td>
                        <td className="px-4 py-3 border-t border-black text-center capitalize">
                          {registro.tipo}
                        </td>
                        <td className="px-4 py-3 border-t border-black text-center uppercase">
                          {registro.classificacao || 'N/A'}
                        </td>
                        <td className="px-4 py-3 border-t border-black text-center">
                          <div>{registro.usuario?.nome || 'N/A'}</div>
                          <div className="text-xs text-gray-600">
                            {registro.usuario?.email || ''}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-t border-black text-center">
                          <span className="text-orange-600 capitalize font-medium">
                            {registro.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RegistrosPendentes;
