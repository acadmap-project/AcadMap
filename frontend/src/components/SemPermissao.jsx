import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SemPermissao = ({
  titulo = 'Acesso Negado',
  mensagem = 'Você não tem permissão para acessar esta página.',
  mostrarBotaoVoltar = true,
  paginaRedirecionamento = '/',
  textoRedirecionamento = 'Voltar ao Início',
  tempoRedirecionamento = null, // tempo em segundos para redirecionamento automático
  icone = '🔒',
}) => {
  const navigate = useNavigate();
  const [contador, setContador] = useState(tempoRedirecionamento);

  useEffect(() => {
    if (tempoRedirecionamento && contador > 0) {
      const timer = setTimeout(() => {
        setContador(contador - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (tempoRedirecionamento && contador === 0) {
      navigate(paginaRedirecionamento);
    }
  }, [contador, tempoRedirecionamento, navigate, paginaRedirecionamento]);

  const handleVoltar = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleIrInicio = () => {
    navigate(paginaRedirecionamento);
  };

  return (
    <div className="sem-permissao-container">
      <div className="sem-permissao-content">
        <div className="sem-permissao-icone">{icone}</div>

        <h1 className="sem-permissao-titulo">{titulo}</h1>

        <p className="sem-permissao-mensagem">{mensagem}</p>

        {tempoRedirecionamento && contador > 0 && (
          <p className="sem-permissao-contador">
            Redirecionando em {contador} segundo{contador !== 1 ? 's' : ''}...
          </p>
        )}

        {mostrarBotaoVoltar && (
          <div className="sem-permissao-acoes">
            <button onClick={handleVoltar} className="btn-voltar" type="button">
              ← Voltar
            </button>

            <button
              onClick={handleIrInicio}
              className="btn-inicio"
              type="button"
            >
              {textoRedirecionamento}
            </button>
          </div>
        )}

        {!mostrarBotaoVoltar && (
          <div className="sem-permissao-acoes">
            <Link to={paginaRedirecionamento} className="link-inicio">
              {textoRedirecionamento}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemPermissao;
