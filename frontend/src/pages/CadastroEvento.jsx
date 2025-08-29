import '../styles/App.css';
import FormularioEvento from '../components/FormularioEvento.jsx';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';

function CadastroEvento() {
  /* 
    Página de cadastro de evento.
    Exibe o formulário para cadastro de eventos.
  */ const { loggedIn } = useLogin();
  console.log(loggedIn);
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
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
              Cadastro de Eventos
            </h1>
            <FormularioEvento />
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroEvento;
