import HeaderSistema from '../components/Navbar';
import '../styles/App.css';

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
      <div className="card">
        <p>
          Edite <code>src/pages/CadastroUsuario.jsx</code> para poder fazer
          alterações
        </p>
        <form onSubmit={handleSubmit}></form>
      </div>
    </>
  );
}

export default CadastroUsuario;
