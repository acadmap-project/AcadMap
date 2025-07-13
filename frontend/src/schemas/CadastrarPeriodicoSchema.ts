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
  // Validation rule: At least one of the three links must be filled
  .refine(
    data => {
      const hasJcr = data.linkJcr && data.linkJcr.trim() !== '';
      const hasScopus = data.linkScopus && data.linkScopus.trim() !== '';
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';

      return hasJcr || hasScopus || hasGoogleScholar;
    },
    {
      message:
        'Pelo menos um dos links (JCR, Scopus ou Google Scholar) deve ser preenchido',
      path: ['linkJcr'], // Show error on the first link field
    }
  )
  // Validar se tem Google Scholar e vinculo SBC
  .refine(
    data => {
      const hasGoogleScholar =
        data.linkGoogleScholar && data.linkGoogleScholar.trim() !== '';

      const hasSbcCheckbox = data.vinculoSbcCheckbox === true;

      return hasGoogleScholar && hasSbcCheckbox;
    },
    {
      message:
        'Se o link do Google Scholar for preenchido, a nota no antigo Qualis e o vínculo com SBC devem ser informados',
      path: ['linkGoogleScholar'],
    }
  )
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
