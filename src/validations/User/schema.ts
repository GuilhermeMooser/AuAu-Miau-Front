import z from "zod";

export const userSchema = z.object({
  user: z.string().nonempty("Nome é obrigatório"),
  email: z.email("Email é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  password: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
  roleId: z.string().nonempty("O tipo de usuário é obrigatória"), //Need to convert before send it to backend
  active: z.boolean(),
});
