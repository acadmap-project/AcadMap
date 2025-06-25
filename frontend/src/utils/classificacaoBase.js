/**
 * Calcula a classificação base para eventos baseado no índice H5
 * @param {number} h5 - O índice H5 do evento
 * @returns {string} - A classificação (a1 a a8)
 */
export const calcClassEventoSemSBC = h5 => {
  const h5Number = Number(h5);

  if (h5Number >= 35) return 'a1';
  if (h5Number >= 25) return 'a2';
  if (h5Number >= 20) return 'a3';
  if (h5Number >= 15) return 'a4';
  if (h5Number >= 12) return 'a5';
  if (h5Number >= 9) return 'a6';
  if (h5Number >= 6) return 'a7';
  return 'a8';
};

/**
 * Calcula a classificação base para periódicos baseado no percentil
 * @param {number} percentil - O percentil do periódico
 * @returns {string} - A classificação (a1 a a6 ou "nao_classificado")
 */
export const calcularClassificacaoPeriodico = percentil => {
  const percentilNumber = Number(percentil);

  if (percentilNumber >= 87.5) return 'a1';
  if (percentilNumber >= 75) return 'a2';
  if (percentilNumber >= 62.5) return 'a3';
  if (percentilNumber >= 50) return 'a4';
  if (percentilNumber >= 37.5) return 'a5';
  if (percentilNumber >= 25) return 'a6';

  return 'a8';
};

/**
 * Formata a classificação para exibição
 * @param {string} classificacao - A classificação (a1-a8, no, etc.)
 * @returns {string} - A classificação formatada para exibição
 */
export const formatarClassificacaoParaExibicao = classificacao => {
  if (!classificacao) return 'N/A';

  if (classificacao.toLowerCase() === 'a8') {
    return 'NÃO CONSIDERADO';
  }

  return classificacao.toUpperCase();
};

/**
 * Calcula a classificação final para eventos considerando o vínculo com SBC
 * @param {number} h5 - O índice H5 do evento
 * @param {string} vinculoSbc - O tipo de vínculo com SBC
 * @returns {string} - A classificação final
 */
export const calcularClassificacaoEvento = (h5, vinculoSbc) => {
  const h5Number = Number(h5) || 0;

  if (!vinculoSbc || vinculoSbc === 'sem_vinculo') {
    return calcClassEventoSemSBC(h5Number);
  }

  if (h5Number === 0) {
    if (vinculoSbc === 'vinculo_top_10' || vinculoSbc === 'vinculo_top_20') {
      return 'a7';
    }
    if (vinculoSbc === 'vinculo_comum') {
      return 'a8';
    }
  }

  if (h5Number > 0) {
    const classificacaoBase = calcClassEventoSemSBC(h5Number);

    if (vinculoSbc === 'vinculo_top_10') {
      return elevarClassificacao(classificacaoBase, 2);
    }

    if (vinculoSbc === 'vinculo_top_20') {
      return elevarClassificacao(classificacaoBase, 1);
    }

    return classificacaoBase;
  }

  return calcClassEventoSemSBC(h5Number);
};

/**
 * Eleva a classificação em níveis especificados, respeitando o teto de A3
 * @param {string} classificacaoBase - A classificação base
 * @param {number} niveis - Número de níveis para elevar
 * @returns {string} - A classificação elevada
 */
const elevarClassificacao = (classificacaoBase, niveis) => {
  const classificacoes = ['a8', 'a7', 'a6', 'a5', 'a4', 'a3', 'a2', 'a1'];
  const indiceAtual = classificacoes.indexOf(classificacaoBase.toLowerCase());

  if (indiceAtual === -1) return classificacaoBase;

  const novoIndice = Math.min(indiceAtual + niveis, classificacoes.length - 1);

  const indiceFinal = Math.min(novoIndice, 5);

  return classificacoes[indiceFinal];
};
