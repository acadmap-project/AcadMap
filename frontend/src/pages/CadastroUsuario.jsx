import '../styles/App.css';
import FormularioCadastro from '../components/FormularioCadastro';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

function CadastroUsuario() {
  /* 
    Página de cadastro de usuário.
    Permite cadastro de usuários por visitantes e usuários logados.
    Se o usuário logado for admin, mostra opção de seleção de tipo de perfil.
  */
  const { loggedIn } = useLogin();

  const isAdmin = loggedIn?.userType === 'ADMINISTRADOR';

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSistema
        userType={loggedIn?.userType}
        userName={loggedIn?.userName}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl max-h-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
            Cadastro de Usuário
          </h1>
          <FormularioCadastro isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;
