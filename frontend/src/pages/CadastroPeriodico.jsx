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
    <div className="min-h-screen bg-gray-100">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      
      {!['AUDITOR', 'ADMINISTRADOR', 'PESQUISADOR'].includes(
        loggedIn.userType
      ) ? (
        <SemPermissao />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
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
