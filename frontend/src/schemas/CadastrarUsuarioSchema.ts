import { z } from 'zod';

export const CadastrarUsuarioSchema = z
  .object({
    fullName: z.string().nonempty('Informe seu nome completo'),
    email: z
      .string()
      .email('Informe um email válido')
      .nonempty('Informe seu email'),
    password: z.string().nonempty('Informe uma senha'),
    confirmPassword: z.string().nonempty('Confirme sua senha'),
    searchArea: z
      .array(z.string())
      .min(1, 'Selecione pelo menos uma área de pesquisa'),
    program: z.string().nonempty('Selecione um programa'),
    tipoPerfil: z.string().optional(),
  })
  .refine(form => form.password === form.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

// Schema for admin forms where tipoPerfil is required
export const CadastrarUsuarioAdminSchema = z
  .object({
    fullName: z.string().nonempty('Informe seu nome completo'),
    email: z
      .string()
      .email('Informe um email válido')
      .nonempty('Informe seu email'),
    password: z.string().nonempty('Informe uma senha'),
    confirmPassword: z.string().nonempty('Confirme sua senha'),
    searchArea: z
      .array(z.string())
      .min(1, 'Selecione pelo menos uma área de pesquisa'),
    program: z.string().nonempty('Selecione um programa'),
    tipoPerfil: z.string().nonempty('Selecione o tipo de perfil'),
  })
  .refine(form => form.password === form.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
