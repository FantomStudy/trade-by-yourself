import z from "zod";

import type { User } from "@/types";

import { isValidPhoneNumber } from "@/lib/phone";

// Login Schema
export const loginSchema = z.object({
  login: z.string().min(1, "Почта или номер телефона обязательны"),
  password: z.string().min(1, "Пароль обязателен"),
});

export type LoginData = z.infer<typeof loginSchema>;

export interface LoginResponse {
  message: string;
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
