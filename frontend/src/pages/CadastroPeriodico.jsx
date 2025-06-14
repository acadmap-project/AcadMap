import '../styles/App.css';
import FormularioPeriodico from '../components/FormularioPeriodico.jsx';
import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth';

function CadastroPeriodico() {
  /* 
    Página de cadastro de periódico.
    Exibe o formulário para cadastro de periódicos.
  */
  const { loggedIn } = useLogin();
  return (
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      <h1 className="mt-8 mb-6">Cadastro Periódico</h1>
      <FormularioPeriodico />
    </>
  );
}

export default CadastroPeriodico;
