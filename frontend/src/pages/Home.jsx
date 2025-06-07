import { Link } from 'react-router';
import HeaderSistema from '../components/HeaderSistema';
import { useState } from 'react';

const Navigation = () => {
  return (
    <nav style={{ padding: '20px' }}>
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          gap: '100px',
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link to="/cadastro-usuario" style={{ textDecoration: 'none' }}>
            Cadastro Usuario
          </Link>
        </li>
        <li>
          <Link to="/cadastro-evento" style={{ textDecoration: 'none' }}>
            Cadastro Evento
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const Home = () => {
  const [logar, setLogar] = useState(false);

  const handleLogIn = () => setLogar(true);
  const handleLogOut = () => setLogar(false);
  return (
    <div>
      <HeaderSistema isCadastro={logar} />
      <h1>AcadMap</h1>
      <p>Bem vindo a Home page, é necessário definir o que inserir aqui.</p>
      {logar ? (
        <input type="button" value="Deslogar" onClick={handleLogOut} />
      ) : (
        <input type="button" value="Logar como Adm" onClick={handleLogIn} />
      )}
    </div>
  );
};

export default Home;
