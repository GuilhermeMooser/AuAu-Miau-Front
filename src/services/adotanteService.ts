import { api } from './api';
import { Adotante, AdotanteFilters } from '@/types/adotante';

export interface CreateAdotanteRequest {
  nome: string;
  email?: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  contatos: Array<{
    tipo: 'telefone' | 'celular' | 'email' | 'whatsapp';
    valor: string;
    principal: boolean;
  }>;
  profissao: string;
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  enderecos: Array<{
    rua: string;
    bairro: string;
    numero: string;
    cidade: string;
    estado: string;
    cep: string;
    tipo: 'residencial' | 'comercial' | 'outro';
  }>;
  proximoContato?: Date;
  notificacoesAtivas: boolean;
  animaisVinculados?: string[];
}

export interface UpdateAdotanteRequest extends Partial<CreateAdotanteRequest> {
  id: string;
}

export interface AdotanteListResponse {
  data: Adotante[];
  total: number;
  page: number;
  limit: number;
}

export const adotanteService = {
  // Listar adotantes com filtros e paginação
  list: async (filters?: AdotanteFilters, page = 1, limit = 10): Promise<AdotanteListResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    params.append('page', String(page));
    params.append('limit', String(limit));
    
    const response = await api.get(`/adotantes?${params.toString()}`);
    return response.data;
  },

  // Buscar adotante por ID
  getById: async (id: string): Promise<Adotante> => {
    const response = await api.get(`/adotantes/${id}`);
    return response.data;
  },

  // Criar novo adotante
  create: async (data: CreateAdotanteRequest): Promise<Adotante> => {
    const response = await api.post('/adotantes', data);
    return response.data;
  },

  // Atualizar adotante
  update: async (data: UpdateAdotanteRequest): Promise<Adotante> => {
    const { id, ...updateData } = data;
    const response = await api.put(`/adotantes/${id}`, updateData);
    return response.data;
  },

  // Deletar adotante
  delete: async (id: string): Promise<void> => {
    await api.delete(`/adotantes/${id}`);
  },

  // Buscar adotantes por nome ou CPF
  search: async (query: string): Promise<Adotante[]> => {
    const response = await api.get(`/adotantes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Vincular animal ao adotante
  linkAnimal: async (adotanteId: string, animalId: string): Promise<void> => {
    await api.post(`/adotantes/${adotanteId}/animals/${animalId}`);
  },

  // Desvincular animal do adotante
  unlinkAnimal: async (adotanteId: string, animalId: string): Promise<void> => {
    await api.delete(`/adotantes/${adotanteId}/animals/${animalId}`);
  },
};