import { useEffect, useState } from 'react';

function ListaEventosPendentes() {
  /*
        Lista de eventos pendentes para o usuário autenticado.
        Faz uma requisição para a API para buscar pendências
        e exibe uma lista com o nome e status de cada evento.
    */
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/veiculo/periodico-pendente', {
      headers: {
        'X-User-Id': localStorage.getItem('userId') || '', // ajuste conforme seu auth
      },
    })
      .then(res => res.json())
      .then(data => {
        setEventos(data.filter(e => e.tipo === 'evento'));
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando eventos...</p>;
  if (!eventos.length) return <p>Nenhum evento pendente.</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Eventos Pendentes</h2>
      <ul>
        {eventos.map(ev => (
          <li key={ev.idVeiculo} className="mb-2 border-b pb-2">
            <strong>{ev.nome}</strong>
            <div>Status: {ev.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaEventosPendentes;
