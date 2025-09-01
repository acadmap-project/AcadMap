import { useNavigate } from 'react-router-dom';

export default function TabelaPublicacoes() {
  const navigate = useNavigate();

  const data = [
    {
      id: 1,
      nomeVeiculo: 'Simpósio de Inteligência Artificial',
      tipo: 'Evento',
      usuario: 'Pesquisador 1',
      status: 'Pendente',
    },
    {
      id: 2,
      nomeVeiculo: 'Congresso de Computação',
      tipo: 'Evento',
      usuario: 'Auditor 1',
      status: 'Pendente',
    },
    {
      id: 3,
      nomeVeiculo: 'Revista de Engenharia de Software',
      tipo: 'Periódico',
      usuario: 'Pesquisador 2',
      status: 'Pendente',
    },
    {
      id: 4,
      nomeVeiculo: 'Journal of Data Science',
      tipo: 'Periódico',
      usuario: 'Auditor 2',
      status: 'Pendente',
    },
    {
      id: 5,
      nomeVeiculo: 'Conferência de Cibersegurança',
      tipo: 'Evento',
      usuario: 'Auditor 3',
      status: 'Pendente',
    },
    {
      id: 6,
      nomeVeiculo: 'Simpósio Nacional de Robótica',
      tipo: 'Evento',
      usuario: 'Pesquisador 3',
      status: 'Pendente',
    },
    {
      id: 7,
      nomeVeiculo: 'Congresso Internacional de TI',
      tipo: 'Evento',
      usuario: 'Auditor 4',
      status: 'Pendente',
    },
    {
      id: 8,
      nomeVeiculo: 'Revista Brasileira de Sistemas',
      tipo: 'Periódico',
      usuario: 'Pesquisador 4',
      status: 'Pendente',
    },
    {
      id: 9,
      nomeVeiculo: 'Journal of Machine Learning',
      tipo: 'Periódico',
      usuario: 'Auditor 5',
      status: 'Pendente',
    },
    {
      id: 10,
      nomeVeiculo: 'Conferência de UX Design',
      tipo: 'Evento',
      usuario: 'Pesquisador 5',
      status: 'Pendente',
    },
  ];

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto border border-gray-700 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-black text-sm sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-r border-gray-700 text-center w-1/3">
                    Nome do Veículo de Publicação
                  </th>
                  <th className="px-4 py-3 border-r border-gray-700 text-center w-1/4">
                    Evento ou Periódico
                  </th>
                  <th className="px-4 py-3 border-r border-gray-700 text-center w-1/4">
                    Usuário
                  </th>
                  <th className="px-4 py-3 text-center w-1/6">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr
                    key={item.id}
                    onClick={() =>
                      navigate(`/pendente/${item.id}`, { state: item })
                    }
                    className="cursor-pointer hover:bg-[#1a2036] text-sm transition"
                  >
                    <td className="px-4 py-3 border-t border-gray-700">
                      {item.nomeVeiculo}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-700 text-center">
                      {item.tipo}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-700 text-center">
                      {item.usuario}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-700 text-center text-yellow-400">
                      {item.status}
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
