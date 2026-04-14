import z from "zod";
import { isValidPhone } from "@/lib/phone";
import { api } from "../instance";

export const verifyPhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Номер телефона обязателен")
    .refine(
      (value) => isValidPhone(value),
      "Введите корректный российский номер телефона в формате +7 (XXX) XXX-XX-XX",
    ),
  code: z
    .string()
    .min(6, "Код должен состоять из 6 цифр")
    .max(6, "Код должен состоять из 6 цифр")
    .regex(/^\d{6}$/, "Код должен содержать только цифры"),
});

export type VerifyPhoneQuery = z.infer<typeof verifyPhoneSchema>;

export interface VerifyPhoneResponse {
  message: string;
}

export const verifyMobileCode = (query: VerifyPhoneQuery) =>
  api<VerifyPhoneResponse>("/auth/verify-mobile-code", { method: "POST", query });
