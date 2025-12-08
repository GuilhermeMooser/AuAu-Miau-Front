import { Audit } from "./audit";
import { Pagination } from "./pagination";

export type UserLogin = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

type UserRole = {
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

export type FindAllUsersPaginated = Pagination<MinimalUser>;
