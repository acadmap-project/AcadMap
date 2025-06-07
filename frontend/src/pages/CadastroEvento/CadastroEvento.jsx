import '../../styles/App.css';
import FormularioEvento from '../../components/FormularioEvento.jsx';

function CadastroEvento() {
  /* 
    Página de cadastro de evento.
    Exibe o formulário para cadastro de eventos.
  */
  return (
    <>
      <h1 className="text-xl">Cadastro Evento</h1>
      <FormularioEvento />
    </>
  );
}

export default CadastroEvento;
