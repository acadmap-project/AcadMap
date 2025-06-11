import { useEffect, useState } from 'react';

function ListaPeriodicosPendentes() {
    /*
        Lista de periódicos pendentes para o usuário autenticado.
        Faz uma requisição para a API para buscar pendências
        e exibe uma lista com o nome e status de cada periódico.
    */
  const [periodicos, setPeriodicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/veiculo/periodico-pendente', {
      headers: {
        'X-User-Id': localStorage.getItem('userId') || '', // ajuste conforme seu auth
      },
    })
      .then(res => res.json())
      .then(data => {
        setPeriodicos(data.filter(p => p.tipo === 'periodico'));
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando periódicos...</p>;
  if (!periodicos.length) return <p>Nenhum periódico pendente.</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Periódicos Pendentes</h2>
      <ul>
        {periodicos.map(p => (
          <li key={p.idVeiculo} className="mb-2 border-b pb-2">
            <strong>{p.nome}</strong>
            <div>Status: {p.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaPeriodicosPendentes;