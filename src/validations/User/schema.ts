import z from "zod";

const baseUserSchema = z.object({
  user: z.string().nonempty("Nome é obrigatório"),
  email: z.email("Email é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  roleId: z.string().nonempty("O tipo de usuário é obrigatório"),
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const updateUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 8, {
      message: "Senha deve ter pelo menos 8 caracteres",
    }),
  active: z.boolean(),
});
