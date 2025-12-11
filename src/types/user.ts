import z from "zod";
import { Audit } from "./audit";
import { Pagination } from "./pagination";
import { userSchema } from "@/validations/User/schema";

export type UserLogin = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

export type UserRole = {
  id: number;
  name: string;
};

export type MinimalUser = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  active: boolean;
  audit: Audit;
  role: UserRole;
};

export type User = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  active: boolean;
  audit: Audit;
  role: UserRole;
  createdBy: MinimalUser;
  updatedBy: MinimalUser;
  deletedBy: MinimalUser;
};

export type CreateUserDto = {
  user: string;
  cpf: string;
  email: string;
  password: string;
  roleId: string;
};

export type UpdateUserDto = CreateUserDto & {
  id: string;
};

export type FindAllUsersPaginated = Pagination<MinimalUser>;

export type UserFormData = z.infer<typeof userSchema>;
