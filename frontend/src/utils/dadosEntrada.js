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

const areasProgramaDisponiveis = [
  { value : 'ppgcc', label : 'Programa de Pós-Graduação em Ciência da Computação (PPGC)'},
  { value : 'pibic', label : 'Programa Institucional de Bolsas de Iniciação Científica (PIBIC)'},
  { value : 'pibiti', label : 'Programa Institucional de Bolsas de Iniciação em Desenvolvimento Tecnológico e Inovação (PIBITI)'},
  { value : 'pibex', label : 'Programa Institucional de Bolsas de Extensão (PIBEX)'},
  { value : 'proext', label : 'Programa de Extensão Universitária (PROEXT)'},
]

const vinculosSBCDisponiveis = [
  { value: 'nenhum', label: 'Nenhum' },
  { value: 'sbc-sem-h5', label: 'SBC (sem H5/Relevante)' },
  { value: 'sbc-top-20', label: 'SBC Top 20' },
  { value: 'sbc-top-10', label: 'SBC Top 10' },
];

export const dadosEntradaCadastro = [
  {
    label: 'Nome Completo*',
    name : 'cadastro-name',
    placeholder : 'Digite...',
    required : true
  },
  {
    label : 'E-mail*',
    name : 'cadastro-email',
    placeholder : 'exemplo@exemplo.com',
    required : true
  },
  {
    label : 'Senha*',
    name : 'cadastro-senha',
    placeholder : '*******',
    required : true
  },
  {
    label : 'Área de Pesquisa*',
    name : 'area-pesquisa',
    type : 'select',
    placeholder : 'Selecione uma área de pesquisa',
    options : areasConhecimentoDisponiveis,
    required : true
  },
  {
    label : 'Programa*',
    name : 'programa-cadastro',
    type : 'select',
    placeholder : 'Selecione o programa ao qual faz parte...',
    options : areasProgramaDisponiveis,
    required : true
  },
  {
    label : 'Confirmar Senha*',
    name : 'cadastro-confirmar-senha',
    placeholder : '*******',
    required : true
  }
]

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