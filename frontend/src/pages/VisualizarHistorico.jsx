import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

// dados mock para exemplo
const mockLogs = [
  {
    id: '1',
    dataHora: '2025-08-06T14:30:00Z',
    usuario: {
      id: 'usr-123',
      nome: 'Usuário 1',
      tipo: 'pesquisador'
    },
    veiculo: {
      id: 'vec-456',
      nome: 'Evento 1'
    },
    acao: 'adicao_veiculo', 
    status: 'pendente',
    justificativa: null,
  },
  {
    id: '2', 
    dataHora: '2025-08-05T10:20:00Z',
    usuario: {
      id: 'usr-124',
      nome: 'Usuário 2',
      tipo: 'auditor'
    },
    veiculo: {
      id: 'vec-457', 
      nome: 'Periódico 1'
    },
    acao: 'cadastro_veiculo_aceito',
    status: 'aceito',
    justificativa: null,
  },
  {
    id: '3',
    dataHora: '2025-08-04T09:15:00Z', 
    usuario: {
      id: 'usr-125',
      nome: 'Usuário 3',
      tipo: 'auditor'  
    },
    veiculo: {
      id: 'vec-458',
      nome: 'Evento 2'
    },
    acao: 'cadastro_veiculo_recusado',
    status: 'negado',
    justificativa: 'Motivo da negação'
  }
];

const formatarAcao = (acao) => {
  const mapeamento = {
    'adicao_veiculo': 'Cadastro',
    'atualizacao_veiculo': 'Atualização',
    'cadastro_veiculo_aceito': 'Aprovação',
    'cadastro_veiculo_recusado': 'Rejeição'
  };
  return mapeamento[acao] || acao;
};

function VisualizarHistorico() {
  const { loggedIn } = useLogin();

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSistema userType={loggedIn.userType} userName={loggedIn.userName} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Histórico de Auditoria
          </h1>

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
                {mockLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.usuario.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.veiculo.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarAcao(log.acao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.dataHora).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.justificativa || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualizarHistorico;