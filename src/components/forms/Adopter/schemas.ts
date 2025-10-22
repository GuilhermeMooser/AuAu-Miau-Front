import z from "zod";

const contactSchema = z.object({
  type: z.enum(["telefone", "celular", "whatsapp"]),
  value: z.string().min(1, "Contato é obrigatório"),
  isPrincipal: z.boolean(),
});

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  cityId: z.number().min(1, "Cidade é obrigatória"),
  stateId: z.number().min(1, "Estado é obrigatório"),
  city: z.object({
    id: z.number(),
    name: z.string(),
    stateUf: z.object({
      id: z.number(),
      name: z.string(),
      acronym: z.string(),
      country: z.number(),
    }),
    ibge: z.number(),
  }),
});

export const adopterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  dtOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
  rg: z.string().min(1, "RG é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  contacts: z
    .array(contactSchema)
    .min(1, "Pelo menos um contato é obrigatório")
    .refine((contatos) => contatos.filter((c) => c.isPrincipal).length <= 1, {
      message: "Apenas um contato pode ser principal",
    }),
  profession: z.string().min(1, "Profissão é obrigatória"),
  civilState: z.enum([
    "solteiro",
    "casado",
    "divorciado",
    "viuvo",
    "uniao_estavel",
  ]),
  addresses: z
    .array(addressSchema)
    .min(1, "Pelo menos um endereço é obrigatório"),
  dtToNotify: z.date().optional(),
  activeNotification: z.boolean(),
  animals: z.array(z.string()).optional(),
});
