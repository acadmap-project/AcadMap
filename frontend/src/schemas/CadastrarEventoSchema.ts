import { z } from 'zod';

export const CadastrarEventoSchema = z
  .object({
    nome: z.string().nonempty({
      message: 'O Título do Evento é obrigatório',
    }),
    areasPesquisaIds: z
      .array(z.string())
      .min(1, 'Selecione uma área de conhecimento'),
    h5: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(val => !val || val === '' || !isNaN(Number(val)), {
        message: 'O índice deve ser um número',
      })
      .transform(val => val && val !== '' ? Number(val) : undefined),
    vinculoSbcCheckbox: z.boolean().optional(),
    vinculoSbc: z.string().optional(),
    linkEvento: z
      .string()
      .nonempty({
        message: 'O link de acesso é obrigatório',
      })
      .url({
        message: 'Digite uma URL válida',
      }),
    linkGoogleScholar: z.string().optional().or(z.literal('')),
    linkSolSbc: z.string().optional().or(z.literal('')),
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
