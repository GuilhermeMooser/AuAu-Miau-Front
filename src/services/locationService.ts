import { api } from './api';

export interface City {
  id: string;
  name: string;
  ufId: string;
}

export interface UF {
  id: string;
  name: string;
  abbreviation: string;
}

export const locationService = {
  // Buscar todos os estados
  getUFs: async (): Promise<UF[]> => {
    const response = await api.get<UF[]>('/api/uf/v1');
    return response.data;
  },

  // Buscar todas as cidades (ou filtrar por estado se necessário)
  getCities: async (ufId?: string): Promise<City[]> => {
    const url = ufId 
      ? `/api/city/v1?ufId=${ufId}` 
      : '/api/city/v1';
    const response = await api.get<City[]>(url);
    return response.data;
  },
};
