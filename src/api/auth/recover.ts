import z from "zod";
import { api } from "@/api/instance";

export const forgotPasswordSchema = z.object({
  email: z.email("Введите корректный email").min(1, "Email обязателен"),
});

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;

export interface RecoverResponse {
  message: string;
}

export const forgotPassword = (body: ForgotPasswordBody) =>
  api<RecoverResponse>("/auth/forgot-password", { method: "POST", body });

export const verifyCode = (code: string) =>
  api<RecoverResponse>("/auth/verify-code", { method: "POST", query: { code } });

export interface ChangePasswordBody {
  userId: number;
  password: string;
}

export const changePassword = (body: ChangePasswordBody) =>
  api<unknown>("/auth/change-password", { method: "POST", body });
