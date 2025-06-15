import ListaPendentes from '../components/ListaPendentes';
import HeaderSistema from '../components/HeaderSistema';

function GerenciadorCadastros() {
  return (
    <>
      <HeaderSistema isCadastro={false} />
      <div>
        <h1>Gerenciador de Cadastros Pendentes</h1>
        <ListaPendentes />
      </div>
    </>
  );
}

export default GerenciadorCadastros;
