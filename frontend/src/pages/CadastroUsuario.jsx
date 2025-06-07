import HeaderSistema from '../components/HeaderSistema';
import '../styles/App.css';
import FormularioCadastro from '../components/FormularioCadastro';

function handleSubmit(e) {
  e.preventDefault();
  console.log('Formulário enviado');
  window.location.href = '/eventos';
}

function CadastroUsuario() {
  return (
    <>
      <HeaderSistema isCadastro={true} />
      <div></div>
      <h1>Cadastro Usuario</h1>
      <FormularioCadastro />
    </>
  );
}

export default CadastroUsuario;
