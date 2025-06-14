import { z } from 'zod';

export const CadastrarPeriodicoSchema = z.object({
  periodicoNome: z.string().nonempty({
    message: 'O nome do periódico é obrigatório',
  }),
  areaConhecimento: z.string().nonempty({
    message: 'Selecione uma área de conhecimento',
  }),
  issn: z.string().nonempty({
    message: 'O ISSN é obrigatório',
  }),
  vinculoSBC: z.boolean().optional(),
  linkPeriodico: z.string().url('Link de acesso deve ser uma URL válida'),
  linkRepoJCR: z.string().url('Link do repositório JCR deve ser uma URL válida').optional().or(z.literal('')),
  linkRepoScopus: z.string().url('Link do repositório SCOPUS deve ser uma URL válida').optional().or(z.literal('')),
  linkRepoScholar: z.string().url('Link do repositório Google Scholar deve ser uma URL válida').optional().or(z.literal('')),
  qualis: z.coerce.number().min(0).optional(),  percentil: z.coerce.number({
    required_error: 'O percentil é obrigatório',
    invalid_type_error: 'O percentil deve ser um número'
  }).min(0, {
    message: 'O percentil deve ser maior ou igual a 0'
  }).max(100, {
    message: 'O percentil deve estar entre 0 e 100',
  }),
});
