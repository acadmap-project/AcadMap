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
        <div className="container mt-4 mx-auto max-w-4xl max-h-full bg-base-100 shadow-sm">
          <div className="rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-center font-bold mb-6">
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
