import { addSearchParamsInUrl } from "@/utils/generatedPaginatedUrl";
import { api } from "./api";
import {
  CreateUserDto,
  FindAllUsersPaginated,
  UpdateUserDto,
  User,
  UserRole,
} from "@/types";

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

export const getUsersRoles = async () => {
  const response = await api.get<UserRole[]>("/user-role/v1");
  return response.data;
};

export const createUser = async (createUserDto: CreateUserDto) => {
  const body = {
    ...createUserDto,
    roleId: Number(createUserDto.roleId), //Need to convert to number
  };

  const response = await api.post<User>("/user/v1", body);
  return response;
};

export const updateUser = async (updateUserDto: UpdateUserDto) => {
  const body = {
    ...updateUserDto,
    roleId: Number(updateUserDto.roleId), //Need to convert to number
  };

  const response = await api.put<User>("/user/v1", body);
  return response;
};

export const findUserById = async (id: string) => {
  const response = await api.get<User>(`/user/v1/${id}`);
  return response;
};

export const deleteUser = async (id: string) => {
  await api.delete<void>(`/user/v1/${id}`);
};
