import { z } from 'zod';

export const CadastrarUsuarioSchema = z
  .object({
    fullName: z.string().nonempty('Informe seu nome completo'),
    email: z
      .string()
      .email('Informe um email válido')
      .nonempty('Informe seu email'),
    password: z.string(),
    confirmPassword: z.string(),
    searchArea: z.string(),
    program: z.string(),
  })
  .refine(form => form.password === form.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
