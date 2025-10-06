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

  // Buscar cidades filtradas por estado
  getCitiesByUF: async (ufId: string): Promise<City[]> => {
    const response = await api.get<City[]>(`/api/city/v1/uf/${ufId}`);
    return response.data;
  },
};
