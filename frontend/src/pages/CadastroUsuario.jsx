import '../styles/App.css';
import FormularioCadastro from '../components/FormularioCadastro';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

function CadastroUsuario() {
  /* 
    Página de cadastro de usuário.
    Exibe o formulário para cadastro de usuários.
    Se o usuário logado for admin, mostra opção de seleção de tipo de perfil.
  */
  const { loggedIn } = useLogin();

  // Check if the logged user is an admin
  const isAdmin = loggedIn.isLoggedIn && loggedIn.userType === 'ADMINISTRADOR';

  return (
    <>      
    <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      <h1 className="mt-8">Cadastro Usuario</h1>
      <FormularioCadastro isAdmin={isAdmin} />
    </>
  );
}

export default CadastroUsuario;
