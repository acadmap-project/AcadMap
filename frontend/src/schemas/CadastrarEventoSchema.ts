import { z } from 'zod';

export const CadastrarEventoSchema = z.object({
  event: z.string().nonempty({
    message: 'O Título do Evento é obrigatório',
  }),
  cnpq: z.string().optional(),
  indice: z.coerce
    .number({
      message: 'O índice deve ser um número',
    })
    .int('O índice deve ser um número inteiro'),
  vinculoSBC: z.boolean().optional(), // checkbox é opcional
  accessLink: z.string().url('Link de acesso deve ser uma URL válida'),
  repoScholar: z.string().url('Link do Google Scholar deve ser uma URL válida'),
  repoSolSBC: z.string().url('Link do SOL-SBC deve ser uma URL válida'),
});
