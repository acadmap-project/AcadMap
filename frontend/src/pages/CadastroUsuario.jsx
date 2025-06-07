import '../styles/App.css';
import FormularioCadastro from '../components/FormularioCadastro';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

function CadastroUsuario() {
  const { loggedIn } = useLogin();
  return (
    <>
      <HeaderSistema isCadastro={loggedIn.isLoggedIn} />
      <h1>Cadastro Usuario</h1>
      <FormularioCadastro />
    </>
  );
}

export default CadastroUsuario;
