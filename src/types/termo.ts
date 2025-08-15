import { Animal } from './animal';
import { Endereco } from './adotante';

export interface TermoCompromisso {
  id: string;
  nome: string;
  rg: string;
  cpf: string;
  dataNascimento: Date;
  email: string;
  contatos: string[];
  profissao: string;
  estadoCivil: string;
  endereco: Endereco;
  animaisVinculados?: Animal[];
  createdAt: Date;
  updatedAt: Date;
}