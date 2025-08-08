// Funções utilitárias para apresentação de valores
export function formatVinculoSBC(valor) {
  switch (valor) {
    case 'vinculo_top_10':
      return 'Vinculo Top 10';
    case 'vinculo_top_20':
      return 'Vinculo Top 20';
    case 'vinculo_comum':
      return 'Vinculo Comum';
    case 'sem_vinculo':
      return 'Sem Vínculo';
    default:
      return valor || 'Ausente';
  }
}

export function formatAdequacaoDefesa(valor) {
  switch (valor) {
    case 'mestrado':
      return 'Apenas Mestrado';
    case 'mestrado_doutorado':
      return 'Mestrado e Doutorado';
    case 'doutorado':
      return 'Mestrado e Doutorado';
    default:
      return 'Nenhum';
  }
}
