import { api } from "./api";

export type City = {
  id: number;
  name: string;
  stateUf: Uf;
  ibge: number;
}

export type Uf = {
  id: number;
  name: string;
  acronym: string;
  country: string;
}

export const locationService = {
  getUFs: async (): Promise<Uf[]> => {
    const response = await api.get<Uf[]>("/api/uf/v1");
    return response.data;
  },

  getCitiesByUF: async (ufId: number): Promise<City[]> => {
    const response = await api.get<City[]>(`/api/city/v1/uf/${ufId}`);
    return response.data;
  },
};
