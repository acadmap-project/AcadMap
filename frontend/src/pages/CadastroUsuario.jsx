import '../styles/App.css';
import FormularioCadastro from '../components/FormularioCadastro';
import HeaderSistema from '../components/HeaderSistema';
import ProtectedRoute from '../components/ProtectedRoute';
import useLogin from '../hooks/userAuth';

function CadastroUsuario() {
  /* 
    Página de cadastro de usuário.
    Exibe o formulário para cadastro de usuários apenas para usuários logados.
    Se o usuário logado for admin, mostra opção de seleção de tipo de perfil.
  */
  const { loggedIn } = useLogin();

  const isAdmin = loggedIn?.userType === 'ADMINISTRADOR';

  return (
    <ProtectedRoute>
      <HeaderSistema
        userType={loggedIn?.userType}
        userName={loggedIn?.userName}
      />
      <h1 className="mt-8 mb-12">Cadastro de Usuário</h1>
      <FormularioCadastro isAdmin={isAdmin} />
    </ProtectedRoute>
  );
}

export default CadastroUsuario;
