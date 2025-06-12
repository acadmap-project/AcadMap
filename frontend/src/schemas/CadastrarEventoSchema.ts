import { z } from 'zod';

export const CadastrarEventoSchema = z.object({
  nome: z.string().nonempty({
    message: 'O Título do Evento é obrigatório',
  }),
  areasPesquisaIds: z.string().nonempty({
    message: 'Selecione uma área de conhecimento',
  }),
  h5: z.coerce
    .number({
      message: 'O índice deve ser um número',
    })
    .int('O índice deve ser um número inteiro'),
  vinculoSBC: z.boolean().optional(), // checkbox é opcional
  linkEvento: z.string().url('Link de acesso deve ser uma URL válida'),
  linkGoogleScholar: z
    .string()
    .url('Link do Google Scholar deve ser uma URL válida'),
  linkSolSbc: z.string().url('Link do SOL-SBC deve ser uma URL válida'),
});
