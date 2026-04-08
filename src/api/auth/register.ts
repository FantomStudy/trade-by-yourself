import z from "zod";
import { validatePhone } from "@/lib/validatePhone";
import { api } from "../instance";

export const registerSchema = z.object({
  fullName: z.string().min(1, "ФИО обязательно"),
  email: z.email("Введите корректный email").min(1, "Email обязателен"),
  phoneNumber: z
    .string()
    .min(1, "Номер телефона обязателен")
    .refine(
      (value) => validatePhone(value),
      "Введите корректный российский номер телефона в формате +7 (XXX) XXX-XX-XX",
    ),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type RegisterBody = z.infer<typeof registerSchema>;

export type RegisterProvider = "telegram" | "sms";

export interface RegisterResponse {
  message: string;
}

export const register = (
  body: RegisterBody,
  query: { where: RegisterProvider } = { where: "sms" },
) => api<RegisterResponse>(`/auth/sign-up`, { method: "POST", body, query });
