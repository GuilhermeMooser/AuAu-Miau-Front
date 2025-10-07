import { api } from "./api";

export interface City {
  id: number;
  name: string;
  uf: UF;
  ibge: number;
}

export interface UF {
  id: number;
  name: string;
  acronym: string;
  country: string;
}

export const locationService = {
  // Buscar todos os estados
  getUFs: async (): Promise<UF[]> => {
    const response = await api.get<UF[]>("/api/uf/v1");
    return response.data;
  },

  // Buscar cidades filtradas por estado
  getCitiesByUF: async (ufId: number): Promise<City[]> => {
    const response = await api.get<City[]>(`/api/city/v1/uf/${ufId}`);
    return response.data;
  },
};
