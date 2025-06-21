import { z } from 'zod';

export const CadastrarPeriodicoSchema = z
  .object({
    nome: z.string().nonempty({
      message: 'O nome do periódico é obrigatório',
    }),
    areasPesquisaIds: z
      .array(z.string().min(1, 'Selecione pelo menos uma área de conhecimento'))
      .min(1, 'Selecione pelo menos uma área de conhecimento'),
    issn: z.coerce.number({
      required_error: 'O ISSN é obrigatório',
      invalid_type_error: 'O ISSN deve ser um número'
    })
    .refine(
      val => val.toString().length === 8,
      { message: 'O ISSN deve ter exatamente 8 digítos' },
    ),
    vinculoSbcCheckbox: z.boolean().optional(),
    vinculoSBC: z.string().default('sem_vinculo'),
    linkJcr: z
      .string()
      .optional()
      .or(z.literal('')),
    linkScopus: z
      .string()
      .optional()
      .or(z.literal('')),
    linkGoogleScholar: z
      .string()
      .optional()
      .or(z.literal('')),
    qualisAntigo: z.string().nonempty({
      message: 'A nota no antigo QUALIS é obrigatória',
    }),
    percentil: z
      .string()
      .nonempty({
        message: 'O percentil é obrigatório',
      })
      .refine(
        val => {
          const num = Number(val);
          return !isNaN(num) && num >= 0 && num <= 100;
        },
        {
          message: 'O percentil deve ser um número entre 0 e 100',
        }
      ),
  })
  .refine(
    data => {
      // If checkbox is checked, vinculoSBC must be selected
      if (
        data.vinculoSbcCheckbox &&
        (!data.vinculoSBC ||
          data.vinculoSBC === '' ||
          data.vinculoSBC === 'sem_vinculo')
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Selecione o tipo de vínculo com a SBC',
      path: ['vinculoSBC'],
    }
  );
