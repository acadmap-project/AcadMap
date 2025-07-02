import { z } from 'zod';

export const CadastrarPeriodicoSchema = z
  .object({
    nome: z.string().nonempty({
      message: 'O nome do periódico é obrigatório',
    }),
    areasPesquisaIds: z
      .array(z.string().min(1, 'Selecione pelo menos uma área de conhecimento'))
      .min(1, 'Selecione pelo menos uma área de conhecimento'),
    issn: z.coerce
      .number({
        required_error: 'O ISSN é obrigatório',
        invalid_type_error: 'O ISSN deve ser um número',
      })
      .refine(val => val.toString().length === 8, {
        message: 'O ISSN deve ter exatamente 8 digítos',
      }),
    vinculoSbcCheckbox: z.boolean().optional(),
    vinculoSBC: z.string().default('sem_vinculo'),
    linkJcr: z.string().optional().or(z.literal('')),
    linkScopus: z.string().optional().or(z.literal('')),
    linkGoogleScholar: z.string().optional().or(z.literal('')),
    qualisAntigo: z.string().nonempty({
      message: 'A nota no antigo QUALIS é obrigatória',
    }),
    percentilJcr: z.coerce
      .number({ message: 'Deve ser um número' })
      .int({ message: 'Deve ser um inteiro' })
      .min(0, { message: 'O percentil Scopus deve estar entre 0 e 100' })
      .max(100, { message: 'O percentil Scopus deve estar entre 0 e 100' }),
    percentilScopus: z.coerce
    .number({ message: 'Deve ser um número' })
    .int({ message: 'Deve ser um inteiro' })
    .min(0, { message: 'O percentil Scopus deve estar entre 0 e 100' })
    .max(100, { message: 'O percentil Scopus deve estar entre 0 e 100' }),
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
  )
  .refine(
    data => {
      if ((data.linkJcr && data.linkJcr !== '') && !data.percentilJcr) {
        return false;
      }
      return true;
    },
    {
      message: 'O percentil JCR é obrigatório se o link JCR for preenchido',
      path: ['percentilJcr'],
    },
  )
  .refine(
    data => {
      if ((data.linkScopus && data.linkScopus !== '') && !data.percentilScopus) {
        return false;
      }
      return true;
    },
    {
      message: 'O percentil Scopus é obrigatório se o link Scopus for preenchido',
      path: ['percentilScopus'],
    }
  );
