import '../styles/App.css';
import FormularioPeriodico from '../components/FormularioPeriodico.jsx';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';

function CadastroPeriodico() {
  /* 
    Página de cadastro de periódico.
    Exibe o formulário para cadastro de periódicos.
  */ const { loggedIn } = useLogin();
  return (
    <div className="min-h-screen">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />

      {!['AUDITOR', 'ADMINISTRADOR', 'PESQUISADOR'].includes(
        loggedIn.userType
      ) ? (
        <SemPermissao />
      ) : (
        <div className="container mt-4 mx-auto max-w-6xl max-h-full bg-base-100 shadow-sm">
          <div className="rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold mb-6">
              Cadastro de Periódico
            </h1>
            <FormularioPeriodico />
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroPeriodico;
