import { useNavigate } from 'react-router-dom';

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 50,
  background: '#2e2e2e',
  color: 'white',
  padding: '1rem 0 1rem 2rem',
  display: 'flex',
  alignItems: 'center',
};

const userImgStyle = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  border: '2px solid white',
  objectFit: 'cover',
};

function HeaderSistema({ isAuditor, isCadastro }) {
  const navigate = useNavigate();

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <img
          src="src/assets/pfp.svg"
          alt="Foto do Usuário"
          style={userImgStyle}
        />
        <div>
          <h4>{isCadastro ? 'Pesquisador/Auditor' : 'Não cadastrado'}</h4>
        </div>
        {isCadastro && (
          <>
            <button onClick={() => navigate('/cadastro-evento')}>
              Cadastrar Eventos/Periódicos
            </button>
            {isAuditor && <button>Validação de cadastros</button>}
          </>
        )}
        <button onClick={() => navigate('/cadastro-usuario')}>
          Cadastrar Usuário
        </button>
      </div>
    </header>
  );
}
export default HeaderSistema;
