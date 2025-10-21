import { Animal } from "./animal";
import { City } from "./city";
import { Term } from "./term";
import { Audit } from "./audit";
import { Pagination } from "./pagination";
import z from "zod";
import { adopterSchema } from "@/components/forms/Adopter/schemas";

type ContactType = "telefone" | "celular" | "whatsapp";

type CivilStateType =
  | "solteiro"
  | "casado"
  | "divorciado"
  | "viuvo"
  | "uniao_estavel";

export type AdopterAddress = {
  id?: string;
  street: string;
  neighborhood: string;
  number: string;
  city: City;
};

export type AdopterContact = {
  id?: string;
  value: string;
  type: ContactType;
  isPrincipal: boolean;
};

export type Adopter = {
  id: string;
  name: string;
  dtOfBirth: Date;
  rg: string;
  cpf: string;
  email: string;
  contacts: AdopterContact[];
  profession: string;
  civilState: CivilStateType;
  addresses: AdopterAddress[];
  activeNotification: boolean;
  dtToNotify?: Date;
  animals: Animal[];
  terms?: Term[];
  audit: Audit;
};

export type FindAllAdoptersPaginated = Pagination<Adopter>

export type CreateAdopterDto = {
  name: string;
  dtOfBirth: string;
  rg: string;
  cpf: string;
  email: string;
  contacts: AdopterContact[] | null;
  profession: string;
  civilState: CivilStateType;
  addresses: AdopterAddress[] | null;
  activeNotification: boolean;
  dtToNotify?: Date | null;
  animalsIds?: string[];
}

export type AdotanteFormData = z.infer<typeof adopterSchema>;

export type AdotanteFilters = {
  status?: "ativo" | "inativo";
  cidade?: string;
  estado?: string;
  profissao?: string;
  estadoCivil?:
    | "solteiro"
    | "casado"
    | "divorciado"
    | "viuvo"
    | "uniao_estavel";
  dataInicio?: Date;
  dataFim?: Date;
  proximoContato?: Date;
};
