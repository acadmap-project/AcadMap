import { Link } from 'react-router';


const Navigation = () => {
  return (
    <nav style={{ padding: '20px' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '100px', margin: 0, padding: 0 }}>
        <li>
          <Link to="/cadastro-usuario" style={{ textDecoration: 'none' }}>
            Cadastro Usuario
          </Link>
        </li>
        <li>
          <Link to="/cadastro-evento-periodico" style={{ textDecoration: 'none' }}>
            Cadastro Evento/Periodico
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Tela Inicial</h1>
      <p>Bem vindo a tela inicial, para selecionar a tela pressione abaixo!</p>
      <Navigation />
    </div>
  );
};

export default Home;