import type { User } from "@/types";

import z from "zod";

import { isValidPhoneNumber } from "@/lib/phone";

// Login Schema
export const loginSchema = z.object({
  login: z.string().min(1, "Почта или номер телефона обязательны"),
  password: z.string().min(1, "Пароль обязателен"),
});

export type LoginData = z.infer<typeof loginSchema>;

export interface LoginResponse {
  message: string;
  session_id: string;
  user: User;
}

// Register Schema
export const registerSchema = z.object({
  fullName: z.string().min(1, "ФИО обязательно"),
  email: z.email("Введите корректный email").min(1, "Email обязателен"),
  phoneNumber: z
    .string()
    .min(1, "Номер телефона обязателен")
    .refine(
      (value) => isValidPhoneNumber(value),
      "Введите корректный российский номер телефона в формате +7 (XXX) XXX-XX-XX",
    ),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  where: z.enum(["telegram", "sms"]).default("sms"),
});

export type RegisterData = z.infer<typeof registerSchema>;

export interface RegisterResponse {
  message: string;
}

// Recover Schema
export const forgotPasswordSchema = z.object({
  email: z.email("Введите корректный email").min(1, "Email обязателен"),
  //   code: z.string().optional(),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordResponse {
  message: string;
}

// Verify Mobile Code Schema
export const verifyMobileCodeSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Номер телефона обязателен")
    .refine(
      (value) => isValidPhoneNumber(value),
      "Введите корректный российский номер телефона в формате +7 (XXX) XXX-XX-XX",
    ),
  code: z
    .string()
    .min(6, "Код должен состоять из 6 цифр")
    .max(6, "Код должен состоять из 6 цифр")
    .regex(/^\d{6}$/, "Код должен содержать только цифры"),
});

export type VerifyMobileCodeData = z.infer<typeof verifyMobileCodeSchema>;

export interface VerifyMobileCodeResponse {
  message: string;
  /** Если бэк отдаёт как при логине — пишем cookie и кэш (иначе полагаемся на Set-Cookie) */
  session_id?: string;
  user?: User;
}
