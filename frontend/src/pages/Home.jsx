import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth.js';

const Home = () => {
  const { loggedIn, login, logout } = useLogin();
  return (
    <div>
      <HeaderSistema isCadastro={loggedIn.isLoggedIn} />
      <h1>AcadMap</h1>
      <p>Bem vindo a Home page, é necessário definir o que inserir aqui.</p>
      {loggedIn.isLoggedIn ? (
        <input type="button" value="Deslogar" onClick={logout} />
      ) : (
        <input type="button" value="Logar como Adm" onClick={login} />
      )}
    </div>
  );
};

export default Home;
