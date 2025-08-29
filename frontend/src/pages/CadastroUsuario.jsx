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
    <div className="min-h-screen">
      <HeaderSistema
        userType={loggedIn?.userType}
        userName={loggedIn?.userName}
      />

      <div className="container mt-4 mx-auto max-w-4xl max-h-full bg-base-100 shadow-sm">
        <div className="rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-center font-bold mb-6">
            Cadastro de Usuário
          </h1>
          <FormularioCadastro isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;
