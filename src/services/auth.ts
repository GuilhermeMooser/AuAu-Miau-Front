import { Login, LoginDto } from "@/types/login";
import { api } from "./api";

export const authLogin = async ({ login, password }: LoginDto) => {
  const response = await api.post<Login>(
    "/auth/v1/login",
    { login, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};
