import { loginSchema } from "@/validations/Login/schemas";
import z from "zod";
import { UserLogin } from "./user";

export type LoginFormData = z.infer<typeof loginSchema>;

export type LoginDto = {
  email: string;
  password: string;
};

export type Login = {
  user: UserLogin;
};
