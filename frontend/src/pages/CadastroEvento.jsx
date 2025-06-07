import '../styles/App.css';
import FormularioEvento from '../components/FormularioEvento.jsx';
import HeaderSistema from '../components/Navbar.jsx';

function CadastroEvento() {
  /* 
    Página de cadastro de evento.
    Exibe o formulário para cadastro de eventos.
  */
  return (
    <>
      <h3>Cadastro Evento</h3>
      <FormularioEvento />
    </>
  );
}

export default CadastroEvento;
