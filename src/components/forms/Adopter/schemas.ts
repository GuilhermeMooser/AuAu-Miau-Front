import z from "zod";

const contactSchema = z.object({
  type: z.enum(["telefone", "celular", "whatsapp"]),
  value: z.string().min(1, "Contato é obrigatório"),
  isPrincipal: z.boolean(),
});

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  // IMPORTANTE: Manter como number opcional
  number: z.number()
    .int()
    .positive("Número deve ser maior que zero")
    .optional()
    .or(z.literal(0)),
  city: z.object({
    id: z.number().min(1, "Cidade é obrigatória"),
    name: z.string(),
    stateUf: z.object({
      id: z.number().min(1, "Estado é obrigatório"),
      name: z.string(),
      acronym: z.string(),
    }),
  }),
});

export const adopterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  dtOfBirth: z.date().min(1, "Data de nascimento é obrigatória"),
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
    .min(1, "Pelo menos um endereço é obrigatório")
    .refine(
      (addresses) => {
        return addresses.every((addr) => {
          return addr.number && addr.number > 0;
        });
      },
      { message: "O número do endereço é obrigatório" }
    ),
  dtToNotify: z.date().optional(),
  activeNotification: z.boolean(),
  animalsIds: z.array(z.string()).optional(),
});
