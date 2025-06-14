import '../styles/App.css';
import FormularioEvento from '../components/FormularioEvento.jsx';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

function CadastroEvento() {
  /* 
    Página de cadastro de evento.
    Exibe o formulário para cadastro de eventos.
  */
  const { loggedIn } = useLogin();
  return (
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      <h1 className="mt-8 mb-12">Cadastro de Eventos</h1>
      <FormularioEvento />
    </>
  );
}

export default CadastroEvento;
