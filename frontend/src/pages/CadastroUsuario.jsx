import '../styles/App.css';
import HeaderSistema from '../components/HeaderSistema';
import FormularioCadastro from '../components/FormularioCadastro';
import useLogin from '../hooks/userAuth.js';

function CadastroUsuario() {
  const { loggedIn } = useLogin();
  return (
    <>
      <HeaderSistema isCadastro={loggedIn.isLoggedIn} />
      <div></div>
      <h1>Cadastro Usuario</h1>
      <FormularioCadastro />
    </>
  );
}

export default CadastroUsuario;
