import type {
  ForgotPasswordData,
  ForgotPasswordResponse,
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
} from "../types";

import { api } from "../instance";

export const login = async (data: LoginData) =>
  api<LoginResponse>("/auth/sign-in", {
    method: "POST",
    body: data,
  });

export const refresh = async () =>
  api<LoginResponse>("/auth/refresh", { method: "POST" });

export const register = async (data: RegisterData) =>
  api<RegisterResponse>("/auth/sign-up", { method: "POST", body: data });

// FIXME: ADD TYPES AND CREATE SCHEMAS
export const forgotPassword = async (data: ForgotPasswordData) =>
  api<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: data,
  });

export const verifyCode = async (code: string) =>
  api<ForgotPasswordResponse>("/auth/verify-code", {
    method: "POST",
    query: { code },
  });

export const changePassword = async (data: unknown) =>
  api<unknown>("/auth/change-password", {
    method: "POST",
    body: data as BodyInit,
  });

export const checkIsAdmin = async () =>
  api<{ isAdmin: boolean }>("/auth/isAdmin");
