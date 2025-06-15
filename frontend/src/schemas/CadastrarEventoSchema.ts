import { z } from 'zod';

export const CadastrarEventoSchema = z
  .object({
    nome: z.string().nonempty({
      message: 'O Título do Evento é obrigatório',
    }),
    areasPesquisaIds: z.array(z.string())
    .min(1, 'Selecione uma área de conhecimento'),
    h5: z
      .string()
      .nonempty({
        message: 'O índice H5 é obrigatório',
      })
      .refine(val => !isNaN(Number(val)), {
        message: 'O índice deve ser um número',
      })
      .transform(val => Number(val)),
    vinculoSbcCheckbox: z.boolean().optional(),
    vinculoSbc: z.string().optional(),
    linkEvento: z.string().url('Link de acesso deve ser uma URL válida'),
    linkGoogleScholar: z
      .string()
      .url('Link do Google Scholar deve ser uma URL válida')
      .optional()
      .or(z.literal('')),
    linkSolSbc: z
      .string()
      .url('Link do SOL-SBC deve ser uma URL válida')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    data => {
      // If checkbox is checked, vinculoSbc must be selected
      if (
        data.vinculoSbcCheckbox &&
        (!data.vinculoSbc || data.vinculoSbc === '')
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Selecione um tipo de vínculo SBC',
      path: ['vinculoSbc'],
    }
  );
