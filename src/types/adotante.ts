import { Animal } from './animal';

export interface Endereco {
  id?: string;
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
  tipo?: 'residencial' | 'comercial' | 'outro';
}

export interface Contato {
  id?: string;
  tipo: 'telefone' | 'celular' | 'email' | 'whatsapp';
  valor: string;
  principal: boolean;
}

export interface Adotante {
  id: string;
  nome: string;
  dataNascimento: Date;
  rg: string;
  cpf: string;
  contatos: Contato[];
  profissao: string;
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  enderecos: Endereco[];
  termoCompromissoId?: string;
  animaisAdotados: Animal[];
  animaisVinculados?: string[]; // IDs of linked animals
  status: 'ativo' | 'inativo';
  proximoContato?: Date;
  diasParaContato?: number;
  notificacoesAtivas: boolean; // New field for notification control
  createdAt: Date;
  updatedAt: Date;
}

export interface AdotanteFilters {
  status?: 'ativo' | 'inativo';
  cidade?: string;
  estado?: string;
  profissao?: string;
  estadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  dataInicio?: Date;
  dataFim?: Date;
  proximoContato?: Date;
}