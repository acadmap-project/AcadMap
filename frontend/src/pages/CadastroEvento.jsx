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
      <HeaderSistema isCadastro={loggedIn.isLoggedIn} />
      <h1 className="text-xl">Cadastro Evento</h1>
      <FormularioEvento />
    </>
  );
}

export default CadastroEvento;
