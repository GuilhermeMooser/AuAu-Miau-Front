// Core types for the ONG management system

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Animal {
  id: string;
  nome: string;
  tipo: 'cao' | 'gato';
  raca: string;
  idade: number;
  sexo: 'macho' | 'femea';
  castrado: boolean;
  vacinado: boolean;
  vermifugado: boolean;
  status: 'disponivel' | 'adotado' | 'em_processo';
  fotos: string[];
  observacoes: string;
  adotanteId?: string;
  termoCompromissoId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  status: 'ativo' | 'inativo';
  proximoContato?: Date;
  diasParaContato?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdotanteFilters {
  nome?: string;
  cpf?: string;
  status?: 'ativo' | 'inativo';
  cidade?: string;
  estado?: string;
  profissao?: string;
  estadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  dataInicio?: Date;
  dataFim?: Date;
  proximoContato?: Date;
}

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

export interface DashboardStats {
  totalAnimais: number;
  animaisDisponiveis: number;
  animaisAdotados: number;
  adocoesDoMes: number;
  totalAdotantes: number;
  termosAtivos: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}