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
  api.post<LoginResponse>("/auth/sign-in", data);

export const refresh = async () => api.post<LoginResponse>("/auth/refresh");

export const register = async (data: RegisterData) =>
  api.post<RegisterResponse>("/auth/sign-up", data);

//FIXME: ADD TYPES AND CREATE SCHEMAS
export const forgotPassword = async (data: ForgotPasswordData) =>
  api.post<ForgotPasswordResponse>("/auth/forgot-password", data);

export const verifyCode = async (code: string) =>
  api.post<ForgotPasswordResponse>("/auth/verify-code", {
    query: { code },
  });

export const changePassword = async (data: unknown) =>
  api.post<unknown>("/auth/change-password", data as RequestInit);
