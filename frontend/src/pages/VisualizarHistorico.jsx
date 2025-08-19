import { useQuery } from '@tanstack/react-query';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';
import { get } from '../utils/authFetch';

const formatarAcao = acao => {
  const mapeamento = {
    adicao_veiculo: 'Cadastro',
    atualizacao_veiculo: 'Atualização',
    cadastro_veiculo_aceito: 'Aprovação',
    cadastro_veiculo_recusado: 'Rejeição',
  };
  return mapeamento[acao] || acao;
};

const formatarStatus = status => {
  const mapeamento = {
    pendente: 'Pendente',
    aceito: 'Aprovado',
    negado: 'Negado',
  };
  return mapeamento[status] || status;
};

function VisualizarHistorico() {
  const { loggedIn } = useLogin();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      try {
        const response = await get('/api/log-veiculo/historico');

        if (!response.ok) {
          if (response.status === 405) {
            throw new Error('Usuário não possui acesso ao histórico');
          }
          throw new Error('Erro ao carregar histórico');
        }

        return response.json();
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Histórico de Auditoria
          </h1>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : logs?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID do Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID do Veículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Ação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Final
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.idUsuario}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.idVeiculo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatarAcao(log.acao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatarStatus(log.statusVeiculo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.justificativaNegacao || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizarHistorico;
