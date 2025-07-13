import { z } from 'zod';

export const CadastrarPeriodicoSchema = z
  .object({
    nome: z.string().nonempty({
      message: 'O nome do periódico é obrigatório',
    }),
    areasPesquisaIds: z
      .array(z.string().min(1, 'Selecione pelo menos uma área de conhecimento'))
      .min(1, 'Selecione pelo menos uma área de conhecimento'),
    issn: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        val => {
          // Allow empty string, "0", or null/undefined
          if (!val || val === '' || val === '0') {
            return true;
          }
          // Remove hyphens and validate
          const cleanIssn = val.replace(/-/g, '');
          // Check if it's exactly 8 digits after removing hyphens
          return /^\d{8}$/.test(cleanIssn);
        },
        {
          message:
            'O ISSN deve ter exatamente 8 dígitos (formato: 12345678 ou 1234-5678) ou ser 0',
        }
      )
      .transform(val => {
        // Transform to send only digits to backend (remove hyphens)
        if (!val || val === '' || val === '0') {
          return val;
        }
        return val.replace(/-/g, '');
      }),
    vinculoSbcCheckbox: z.boolean().optional(),
    vinculoSBC: z.string().default('sem_vinculo'),
    linkJcr: z.string().optional().or(z.literal('')),
    linkScopus: z.string().optional().or(z.literal('')),
    linkGoogleScholar: z.string().optional().or(z.literal('')),
    qualisAntigo: z.string().optional().or(z.literal('')),
    percentilJcr: z.string().optional().or(z.literal('')),
    percentilScopus: z.string().optional().or(z.literal('')),
  })
  // Validar: Pelo menos um dos links (JCR, Scopus, Google Scholar) deve ser preenchido ou o Qualis Antigo deve ser informado
  .refine(
    data => {
      const hasJcr = data.linkJcr && data.linkJcr.trim() !== '';
      const hasScopus = data.linkScopus && data.linkScopus.trim() !== '';
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';
      const hasOldScholar =
        data.qualisAntigo && data.qualisAntigo.trim() !== '';

      return hasJcr || hasScopus || hasGoogleScholar || hasOldScholar;
    },
    {
      message:
        'Não foi possível calcular a classificação. Informe pelo menos uma das seguintes fontes: JCR, Scopus, Link Google Scholar ou nota do Qualis CAPES.',
      path: ['linkJcr'],
    }
  )
  // Show error on linkScopus as well
  .refine(
    data => {
      const hasJcr = data.linkJcr && data.linkJcr.trim() !== '';
      const hasScopus = data.linkScopus && data.linkScopus.trim() !== '';
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';
      const hasOldScholar =
        data.qualisAntigo && data.qualisAntigo.trim() !== '';

      return hasJcr || hasScopus || hasGoogleScholar || hasOldScholar;
    },
    {
      message:
        'Não foi possível calcular a classificação. Informe pelo menos uma das seguintes fontes: JCR, Scopus, Link Google Scholar ou nota do Qualis CAPES.',
      path: ['linkScopus'],
    }
  )
  // Show error on linkGoogleScholar as well
  .refine(
    data => {
      const hasJcr = data.linkJcr && data.linkJcr.trim() !== '';
      const hasScopus = data.linkScopus && data.linkScopus.trim() !== '';
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';
      const hasOldScholar =
        data.qualisAntigo && data.qualisAntigo.trim() !== '';

      return hasJcr || hasScopus || hasGoogleScholar || hasOldScholar;
    },
    {
      message:
        'Não foi possível calcular a classificação. Informe pelo menos uma das seguintes fontes: JCR, Scopus, Link Google Scholar ou nota do Qualis CAPES.',
      path: ['linkGoogleScholar'],
    }
  )
  // Show error on qualisAntigo as well
  .refine(
    data => {
      const hasJcr = data.linkJcr && data.linkJcr.trim() !== '';
      const hasScopus = data.linkScopus && data.linkScopus.trim() !== '';
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';
      const hasOldScholar =
        data.qualisAntigo && data.qualisAntigo.trim() !== '';

      return hasJcr || hasScopus || hasGoogleScholar || hasOldScholar;
    },
    {
      message:
        'Não foi possível calcular a classificação. Informe pelo menos uma das seguintes fontes: JCR, Scopus, Link Google Scholar ou nota do Qualis CAPES.',
      path: ['qualisAntigo'],
    }
  )
  // Validar: No caso de ter Google Scholar, vinculo SBC deve ser preenchido
  .refine(
    data => {
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';
      if (hasGoogleScholar && (!data.vinculoSBC || data.vinculoSBC === '')) {
        return false;
      }
      return true;
    },
    {
      message:
        'Selecione um tipo de vínculo SBC quando o Google Scholar for preenchido',
      path: ['linkGoogleScholar'],
    }
  )
  // Validar: No caso de ter qualis antigo, vinculo SBC deve ser preenchido
  .refine(
    data => {
      if (
        data.qualisAntigo &&
        data.qualisAntigo.trim() !== '' &&
        !data.vinculoSBC
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Selecione um tipo de vínculo SBC quando o Qualis Antigo for preenchido',
      path: ['qualisAntigo'],
    }
  )
  // Validar: Se o link JCR for preenchido, percentil JCR deve ser informado
  .refine(
    data => {
      if (data.linkJcr && data.linkJcr !== '' && !data.percentilJcr) {
        return false;
      }
      return true;
    },
    {
      message: 'O percentil JCR é obrigatório se o link JCR for preenchido',
      path: ['percentilJcr'],
    }
  )
  // Validar: Se o link Scopus for preenchido, percentil Scopus deve ser informado
  .refine(
    data => {
      if (data.linkScopus && data.linkScopus !== '' && !data.percentilScopus) {
        return false;
      }
      return true;
    },
    {
      message:
        'O percentil Scopus é obrigatório se o link Scopus for preenchido',
      path: ['percentilScopus'],
    }
  );
