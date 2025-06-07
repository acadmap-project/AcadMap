const areasConhecimentoDisponiveis = [
  { value: 'exatas-terra', label: 'Ciências Exatas e da Terra' },
  { value: 'biologicas', label: 'Ciências Biológicas' },
  { value: 'engenharias', label: 'Engenharias' },
  { value: 'saude', label: 'Ciências da Saúde' },
  { value: 'agrarias', label: 'Ciências Agrárias' },
  { value: 'sociais-aplicadas', label: 'Ciências Sociais Aplicadas' },
  { value: 'humanas', label: 'Ciências Humanas' },
  { value: 'linguistica-letras-artes', label: 'Linguística, Letras e Artes' },
];

const vinculosSBCDisponiveis = [
  { value: 'nenhum', label: 'Nenhum' },
  { value: 'sbc-sem-h5', label: 'SBC (sem H5/Relevante)' },
  { value: 'sbc-top-20', label: 'SBC Top 20' },
  { value: 'sbc-top-10', label: 'SBC Top 10' },
];

const dadosEntradaEvento = [
  {
    label: 'Nome do Evento*',
    name: 'evento-name',
    placeholder: 'Digite o nome do evento...',
    required: true,
  },
  {
    label: 'Área de Conhecimento*',
    name: 'area-conhecimento',
    type: 'select',
    placeholder: 'Selecione uma área de conhecimento...',
    options: areasConhecimentoDisponiveis,
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
  {
    label: 'Vínculo com a SBC',
    name: 'vinculo-sbc',
    type: 'checkbox-dropdown',
    placeholder: 'Nenhum',
    options: vinculosSBCDisponiveis,
    required: true,
  },
];

export default dadosEntradaEvento;
