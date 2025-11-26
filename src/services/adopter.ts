import {
  Adopter,
  AdopterFilters,
  CreateAdopterDto,
  FindAllAdoptersPaginated,
  UpdateAdopterDto,
} from "@/types/adopter";
import { addSearchParamsInUrl } from "@/utils/generatedPaginatedUrl";
import { api } from "./api";

export const getAdoptersPaginated = async (
  search?: string,
  filters?: AdopterFilters,
  page?: number | null,
  limit?: number
) => {
  const url = addSearchParamsInUrl(
    "/adopter/v1",
    { name: "s", value: search },
    { name: "cityId", value: filters?.city },
    { name: "stateUfId", value: filters?.stateUf },
    { name: "createdAt", value: filters?.createdAt?.toString() },
    { name: "dtToNotify", value: filters?.dtToNotify?.toString() },
    { name: "page", value: page },
    { name: "limit", value: limit }
  );

  const response = await api.get<FindAllAdoptersPaginated>(url);
  return response.data;
};

export const findAdopterById = async (id: string) => {
  const response = await api.get<Adopter>(`/adopter/v1/${id}`);
  return response;
};

export const createAdopter = async (createAdopterDto: CreateAdopterDto) => {
  const body = {
    ...createAdopterDto,
  };

  const response = await api.post<Adopter>("/adopter/v1", body);
  return response;
};

export const updateAdopter = async (updateAdopterDto: UpdateAdopterDto) => {
  const body = {
    ...updateAdopterDto,
  };

  const response = await api.put<Adopter>("/adopter/v1", body);
  return response;
};

export const deleteAdopter = async (id: string) => {
  const response = await api.delete<void>(`adopter/v1/${id}`);
  return response;
};
