import ListaPendentes from '../components/ListaPendentes';
import HeaderSistema from '../components/HeaderSistema';
import SemPermissao from '../components/SemPermissao';
import useLogin from '../hooks/userAuth';

function GerenciadorCadastros() {
  const { loggedIn } = useLogin();

  return (
    <>
      <HeaderSistema isCadastro={false} />
      {!['AUDITOR', 'ADMINISTRADOR'].includes(loggedIn.userType) ? (
        <SemPermissao />
      ) : (
        <div>
          <h1>Gerenciador de Cadastros Pendentes</h1>
          <ListaPendentes />
        </div>
      )}
    </>
  );
}

export default GerenciadorCadastros;
