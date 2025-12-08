export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

type UserRole = {
  id: string;
  name: string;
};

//** EXCLUIR */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
