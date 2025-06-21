import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ValidacaoPeriodico() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(state)
  }, [])

  if (!state)
    return <p className="text-white px-6 pt-10">Dados não encontrados.</p>;

  const handleAprovar = () => {
    console.log('Aprovado:', state.id);
    navigate('/cadastro-pendente');
  };

  const handleNegar = () => {
    console.log('Negado:', state.id);
    navigate('/cadastro-pendente');
  };

  return (
    <>
      <h1 className="text-3xl font-semibold mt-8 mb-25">
        Cadastro de Periódicos
      </h1>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-1/2 text-left"
      style={{ fontFamily: 'Poppins', fontWeight: '400' }}>
        <div className="text-sm text-gray-900">
          <span className="font-medium">NOME DO PERIÓDICO*:</span>{' '}
          {state.nomeVeiculo}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">ÁREA DE CONHECIMENTO*:</span>{' '}
          {Array.isArray(state.areasPesquisaIds) ? state.areasPesquisaIds.join(', ') : state.areasPesquisaIds}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">ISSN*:</span>{' '}
          {state.issn}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">Vínculo com a SBC:</span>{' '}
          {state.vinculoSBC}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">LINK DE ACESSO*</span>{' '}
          {state.link && (
            <a href={state.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">{state.link}</a>
          )}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)</span>{' '}
          {state.linkGoogleScholar && (
            <a href={state.linkGoogleScholar} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">{state.linkGoogleScholar}</a>
          )}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">LINK DE REPOSITÓRIO (JCR)</span>{' '}
          {state.linkJcr && (
            <a href={state.linkJcr} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">{state.linkJcr}</a>
          )}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">LINK DE REPOSITÓRIO (SCOPUS)</span>{' '}
          {state.linkScopus && (
            <a href={state.linkScopus} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">{state.linkScopus}</a>
          )}
        </div>

        <div className="text-sm text-gray-900">
          <span className="font-medium">NOTA NO ANTIGO QUALIS:</span>{' '}
          {state.qualisAntigo}
        </div>
      </div>
      </>
  );
}

export default ValidacaoPeriodico;
