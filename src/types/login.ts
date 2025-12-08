import { loginSchema } from "@/validations/Login/schemas";
import z from "zod";
import { UserLogin } from "./user";

export type LoginFormData = z.infer<typeof loginSchema>;

export type LoginDto = {
  login: string;
  password: string;
};

export type Login = {
  user: UserLogin;
};
