import { addSearchParamsInUrl } from "@/utils/generatedPaginatedUrl";
import { api } from "./api";
import { FindAllUsersPaginated } from "@/types";

export const getUsersPaginated = async (
  search?: string,
  page?: number | null,
  limit?: number
) => {
  const url = addSearchParamsInUrl(
    "/user/v1",
    { name: "s", value: search },
    { name: "page", value: page },
    { name: "limit", value: limit }
  );

  const response = await api.get<FindAllUsersPaginated>(url);
  return response.data;
};
