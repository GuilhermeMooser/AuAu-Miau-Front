import { commonFieldSchema } from "@/utils/schema";
import z from "zod";

export const loginSchema = z.object({
  email: commonFieldSchema('O email do usuário é obrigatório.'),

  password: commonFieldSchema('A senha é obrigatória.').min(
    8,
    'A senha precisa conter pelo menos 8 caracteres.',
  ),
});