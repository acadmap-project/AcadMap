// const vinculosSBCDisponiveis = [
//   { value: 'nenhum', label: 'Nenhum' },
//   { value: 'sbc-sem-h5', label: 'SBC (sem H5/Relevante)' },
//   { value: 'sbc-top-20', label: 'SBC Top 20' },
//   { value: 'sbc-top-10', label: 'SBC Top 10' },
// ];

export const dadosEntradaCadastro = [
  {
    label: 'Nome Completo*',
    name: 'cadastro-name',
    placeholder: 'Digite...',
    required: true,
  },
  {
    label: 'E-mail*',
    name: 'cadastro-email',
    placeholder: 'exemplo@exemplo.com',
    required: true,
  },
  {
    label: 'Senha*',
    name: 'cadastro-senha',
    placeholder: '*******',
    required: true,
  },
  {
    label: 'Confirmar Senha*',
    name: 'cadastro-confirmar-senha',
    placeholder: '*******',
    required: true,
  },
];

const dadosEntradaEvento = [
  {
    label: 'Nome do Evento*',
    name: 'evento-name',
    placeholder: 'Digite o nome do evento...',
    required: true,
  },
  {
    label: 'Índice H5*',
    name: 'h5',
    placeholder: 'Digite o indíce H5...',
    required: true,
  },
  {
    label: 'Link de Acesso*',
    name: 'acess-link',
    placeholder: 'Digite uma URL válida...',
    required: true,
  },
  {
    label: 'Link de Repositório (GOOGLE SCHOLAR)',
    name: 'repo-scholar',
    placeholder: 'Digite uma URL válida...',
  },
  {
    label: 'Link de Repositório (SOL-SBC)',
    name: 'repo-sol-sbc',
    placeholder: 'Digite uma URL válida...',
  },
];

export default dadosEntradaEvento;
