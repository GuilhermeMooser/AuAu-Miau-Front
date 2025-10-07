import { api } from './api';
import { Adotante, AdotanteFilters } from '@/types/adotante';

// Backend response structure
interface BackendAdotanteProps {
  id: string;
  activeNotification: boolean;
  addresses: any[] | null;
  civilState: string;
  contacts: any[] | null;
  cpf: string;
  dtOfBirth: string;
  email: string;
  name: string;
  profession: string;
  rg: string;
  animals: any[] | null;
  audit: {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  createdByUserId: string;
  deletedByUserId: string | null;
  dtToNotify: string | null;
  terms: any[] | null;
  updatedByUserId: string | null;
}

interface BackendAdotanteResponse {
  props: BackendAdotanteProps;
}

interface BackendListResponse {
  items: BackendAdotanteResponse[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface CreateAdotanteRequest {
  name: string;
  email?: string;
  dtOfBirth: string;
  rg: string;
  cpf: string;
  contacts: Array<{
    type: 'telefone' | 'celular' | 'email' | 'whatsapp';
    value: string;
    isPrincipal: boolean;
  }> | null;
  profession: string;
  civilState: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  addresses: Array<{
    street: string;
    neighborhood: string;
    number: string;
    city: {
      id: string;
    };
    zipCode: string;
  }> | null;
  dtToNotify?: string | null;
  activeNotification: boolean;
  animalsIds?: string[];
}

export interface UpdateAdotanteRequest extends Partial<CreateAdotanteRequest> {}

export interface AdotanteListResponse {
  data: Adotante[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function to map backend data to frontend Adotante type
const mapBackendToFrontend = (backendData: BackendAdotanteProps): Adotante => {
  return {
    id: backendData.id,
    nome: backendData.name,
    dataNascimento: new Date(backendData.dtOfBirth),
    rg: backendData.rg,
    cpf: backendData.cpf,
    contatos: backendData.contacts || [],
    profissao: backendData.profession,
    estadoCivil: backendData.civilState as any,
    enderecos: backendData.addresses || [],
    status: 'ativo',
    animaisAdotados: backendData.animals || [],
    animaisVinculados: backendData.animals?.map((a: any) => a.id) || [],
    proximoContato: backendData.dtToNotify ? new Date(backendData.dtToNotify) : undefined,
    notificacoesAtivas: backendData.activeNotification,
    createdAt: new Date(backendData.audit.createdAt),
    updatedAt: new Date(backendData.audit.updatedAt),
  };
};

// Helper function to map frontend data to backend format
const mapFrontendToBackend = (frontendData: any): CreateAdotanteRequest => {
  // Map contacts to English format
  const contacts = (frontendData.contatos || frontendData.contacts || []).map((contact: any) => ({
    type: contact.tipo || contact.type,
    value: contact.valor || contact.value,
    isPrincipal: contact.principal ?? contact.isPrincipal,
  }));

  // Map addresses to English format
  const addresses = (frontendData.enderecos || frontendData.addresses || []).map((address: any) => {
    // Get the city object from the form data
    const cityObj = address.city;
    
    return {
      street: address.rua || address.street,
      neighborhood: address.bairro || address.neighborhood,
      number: parseInt(address.numero || address.number, 10),
      city: {
        id: cityObj?.id || address.cidadeId || address.city?.id,
        name: cityObj?.name || '',
        stateUf: {
          id: cityObj?.uf?.id || address.estadoId || 0,
          name: cityObj?.uf?.name || '',
          acronym: cityObj?.uf?.acronym || '',
          country: cityObj?.uf?.country || 'Brasil',
        },
        ibge: cityObj?.ibge || 0,
      },
    };
  });

  // Map animals IDs - only include if there are selected animals
  const animalsIds = frontendData.animaisVinculados || frontendData.animalsIds;
  const hasAnimals = animalsIds && animalsIds.length > 0;

  const payload: any = {
    name: frontendData.nome || frontendData.name,
    email: frontendData.email || '',
    dtOfBirth: typeof frontendData.dataNascimento === 'string' 
      ? frontendData.dataNascimento 
      : frontendData.dtOfBirth,
    rg: frontendData.rg,
    cpf: frontendData.cpf,
    contacts: contacts.length > 0 ? contacts : null,
    profession: frontendData.profissao || frontendData.profession,
    civilState: frontendData.estadoCivil || frontendData.civilState,
    addresses: addresses.length > 0 ? addresses : null,
    dtToNotify: frontendData.proximoContato 
      ? (typeof frontendData.proximoContato === 'string' 
          ? frontendData.proximoContato 
          : frontendData.proximoContato.toISOString())
      : null,
    activeNotification: frontendData.notificacoesAtivas ?? frontendData.activeNotification ?? false,
  };

  // Only include animalsIds if there are animals selected
  if (hasAnimals) {
    payload.animalsIds = animalsIds;
  }

  return payload;
};

export const adotanteService = {
  // Listar adotantes com filtros e paginação
  list: async (filters?: AdotanteFilters, page = 1, limit = 100): Promise<AdotanteListResponse> => {
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
    
    const response = await api.get<BackendListResponse>(`/api/adopter/v1?${params.toString()}`);
    
    const mappedData = response.data.items.map(item => mapBackendToFrontend(item.props));
    
    return {
      data: mappedData,
      total: response.data.meta.totalItems,
      page: response.data.meta.currentPage,
      limit: response.data.meta.itemsPerPage,
      totalPages: response.data.meta.totalPages,
    };
  },

  // Buscar adotante por ID
  getById: async (id: string): Promise<Adotante> => {
    const response = await api.get<BackendAdotanteResponse>(`/api/adopter/v1/${id}`);
    return mapBackendToFrontend(response.data.props);
  },

  // Criar novo adotante
  create: async (data: any): Promise<Adotante> => {
    const backendData = mapFrontendToBackend(data);
    const response = await api.post<BackendAdotanteResponse>('/api/adopter/v1', backendData);
    return mapBackendToFrontend(response.data.props);
  },

  // Atualizar adotante
  update: async (id: string, data: any): Promise<Adotante> => {
    const backendData = mapFrontendToBackend(data);
    const response = await api.put<BackendAdotanteResponse>(`/api/adopter/v1/${id}`, backendData);
    return mapBackendToFrontend(response.data.props);
  },

  // Deletar adotante
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/adopter/v1/${id}`);
  },

  // Buscar adotantes por nome ou CPF
  search: async (query: string): Promise<Adotante[]> => {
    const response = await api.get<BackendListResponse>(`/api/adopter/v1?search=${encodeURIComponent(query)}`);
    return response.data.items.map(item => mapBackendToFrontend(item.props));
  },
};