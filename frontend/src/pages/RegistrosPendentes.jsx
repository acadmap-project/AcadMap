import '../styles/App.css';
import HeaderSistema from '../components/HeaderSistema';
import ListaEventosPendentes from '../components/ListaEventosPendentes';
import ListaPeriodicosPendentes from '../components/ListaPeriodicosPendentes';
import useLogin from '../hooks/userAuth';

function RegistrosPendentes() {
  /*
        Página de registros pendentes.
        Exibe listas de eventos e periódicos pendentes para o usuário autenticado.
    */
  const { loggedIn } = useLogin();

  return (
    <>
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      <h1 className="text-xl">Registros Pendentes</h1>
      <ListaEventosPendentes />
      <ListaPeriodicosPendentes />
    </>
  );
}

export default RegistrosPendentes;
