import type { User } from "@/types";
import z from "zod";
import { api } from "../instance";

export const loginSchema = z.object({
  login: z.string().min(1, "Почта или номер телефона обязательны"),
  password: z.string().min(1, "Пароль обязателен"),
});

export type LoginBody = z.infer<typeof loginSchema>;

export interface LoginResponse {
  message: string;
  session_id: string;
  user: User;
}

export const login = (body: LoginBody) =>
  api<LoginResponse>("/auth/sign-in", { method: "POST", body });
